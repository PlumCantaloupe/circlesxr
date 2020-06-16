//https://github.com/aalavandhaann/three_reflector
//modified from Three.js mirror example and three_reflector ( https://github.com/aalavandhaann/three_reflector )
let Reflector = function(mesh, data)
{
    data = (data) ? data : {};
	
	//intensity doesn't work at zero
	if ( data.intensity < Number.EPSILON ) {
		data.intensity = Number.EPSILON;
	}

    var reflectorPlane			= new THREE.Plane();
	var normal 					= new THREE.Vector3();
	var reflectorWorldPosition 	= new THREE.Vector3();
	var cameraWorldPosition 	= new THREE.Vector3();
	var rotationMatrix 			= new THREE.Matrix4();
	var lookAtPosition 			= new THREE.Vector3( 0, 0, - 1 );
	var clipPlane 				= new THREE.Vector4();

	var view 					= new THREE.Vector3();
	var target 					= new THREE.Vector3();
	var q 						= new THREE.Vector4();

	var textureMatrix 			= new THREE.Matrix4();
	var virtualCamera 			= new THREE.PerspectiveCamera();
	
	var parameters = {
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBFormat,
		stencilBuffer: false,
	};

    var renderTarget = new THREE.WebGLRenderTarget(data.textureWidth, data.textureHeight, parameters );

    if ( ! THREE.Math.isPowerOfTwo( data.textureWidth ) || ! THREE.Math.isPowerOfTwo( data.textureHeight ) ) {
		renderTarget.texture.generateMipmaps = false;
	}

	var scope 		= mesh;
	var clipBias 	= 0;
	var shader 		= Reflector.ReflectorShader;

	var material = new THREE.ShaderMaterial( {
		uniforms: THREE.UniformsUtils.clone( shader.uniforms ),
		fragmentShader: shader.fragmentShader,
		vertexShader: shader.vertexShader
	});

	material.uniforms.intensity.value 		= data.intensity;
	material.uniforms.blendIntensity.value 	= data.blendIntensity;
	material.uniforms.tDiffuse.value  		= renderTarget.texture;
	material.uniforms.color.value 			= new THREE.Color(data.color);
	material.uniforms.invertedUV.value 		= data.invertedUV;
	material.uniforms.textureMatrix.value 	= textureMatrix;

	//using @westlangley's suggested change here: https://github.com/mrdoob/three.js/pull/19666#issuecomment-644450580
	material.onBeforeCompile = function ( shader, renderer ) {
		this.uniforms[ "tDiffuse" ].value.encoding = renderer.outputEncoding;
	}

	if(data.textureOne) {
		var texture 						= new THREE.TextureLoader().load(data.textureOne);
		texture.wrapS 						= THREE.RepeatWrapping;
		texture.wrapT 						= THREE.RepeatWrapping;
		texture.repeat.set( data.wrapOne.x, data.wrapOne.y );
		material.uniforms.tOneFlag.value 	= true;
		material.uniforms.tOne.value 		= texture;
		material.uniforms.tOneWrapX.value 	= texture.repeat.x;
		material.uniforms.tOneWrapY.value 	= texture.repeat.y;
	}

	if(data.textureTwo) {
		var texture 						= new THREE.TextureLoader().load(data.textureTwo);
		texture.wrapS	 					= THREE.RepeatWrapping;
		texture.wrapT 						= THREE.RepeatWrapping;
		texture.repeat.set( data.wrapTwo.x, data.wrapTwo.y );
		material.uniforms.tTwoFlag.value 	= true;
		material.uniforms.tSec.value 		= texture;
		material.uniforms.tTwoWrapX.value 	= texture.repeat.x;
		material.uniforms.tTwoWrapY.value 	= texture.repeat.y;
	}

	mesh.material = material;

    mesh.onBeforeRender = function( renderer, scene, camera ) {
		reflectorWorldPosition.setFromMatrixPosition( scope.matrixWorld );
		cameraWorldPosition.setFromMatrixPosition( camera.matrixWorld );
		
		rotationMatrix.extractRotation( scope.matrixWorld );
		normal.set( 0, 0, 1 );
		normal.applyMatrix4( rotationMatrix );
		view.subVectors( reflectorWorldPosition, cameraWorldPosition );
		
		// Avoid rendering when reflector is facing away
		if ( view.dot( normal ) > 0 ) {
			return;
		}
		
		view.reflect( normal ).negate();
		view.add( reflectorWorldPosition );
		
		rotationMatrix.extractRotation( camera.matrixWorld );
		
		lookAtPosition.set( 0, 0, - 1 );
		lookAtPosition.applyMatrix4( rotationMatrix );
		lookAtPosition.add( cameraWorldPosition );
		
		target.subVectors( reflectorWorldPosition, lookAtPosition );
		target.reflect( normal ).negate();
		target.add( reflectorWorldPosition );
		
		virtualCamera.position.copy( view );
		virtualCamera.up.set( 0, 1, 0 );
		virtualCamera.up.applyMatrix4( rotationMatrix );
		virtualCamera.up.reflect( normal );
		virtualCamera.lookAt( target );
		
		virtualCamera.far = camera.far; // Used in WebGLBackground
		virtualCamera.updateMatrixWorld();
		virtualCamera.projectionMatrix.copy( camera.projectionMatrix );
		
		// Update the texture matrix
		textureMatrix.set(
			0.5, 0.0, 0.0, 0.5,
			0.0, 0.5, 0.0, 0.5,
			0.0, 0.0, 0.5, 0.5,
			0.0, 0.0, 0.0, 1.0
		);
		textureMatrix.multiply( virtualCamera.projectionMatrix );
		textureMatrix.multiply( virtualCamera.matrixWorldInverse );
		textureMatrix.multiply( scope.matrixWorld );

		// Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
		// Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
		reflectorPlane.setFromNormalAndCoplanarPoint( normal, reflectorWorldPosition );
		reflectorPlane.applyMatrix4( virtualCamera.matrixWorldInverse );

		clipPlane.set( reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant );

		var projectionMatrix = virtualCamera.projectionMatrix;
		
		q.x = ( Math.sign( clipPlane.x ) + projectionMatrix.elements[ 8 ] ) / projectionMatrix.elements[ 0 ];
		q.y = ( Math.sign( clipPlane.y ) + projectionMatrix.elements[ 9 ] ) / projectionMatrix.elements[ 5 ];
		q.z = - 1.0;
		q.w = ( 1.0 + projectionMatrix.elements[ 10 ] ) / projectionMatrix.elements[ 14 ];

		// Calculate the scaled plane vector
		clipPlane.multiplyScalar( 2.0 / clipPlane.dot( q ) );
		
		// Replacing the third row of the projection matrix
		projectionMatrix.elements[ 2 ]	= clipPlane.x;
		projectionMatrix.elements[ 6 ] 	= clipPlane.y;
		projectionMatrix.elements[ 10 ] = clipPlane.z + 1.0 - clipBias;
		projectionMatrix.elements[ 14 ] = clipPlane.w;

		scope.visible = false;

		var currentRenderTarget = renderer.getRenderTarget();
		var currentXrEnabled = renderer.xr.enabled;
		var currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

		renderer.xr.enabled = false; // Avoid camera modification
		renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

		renderer.setRenderTarget( renderTarget );
		
		renderer.state.buffers.depth.setMask( true ); // make sure the depth buffer is writable so it can be properly cleared, see #18897

		if ( renderer.autoClear === false ) {
			renderer.clear();
		}
		renderer.render( scene, virtualCamera );

		renderer.xr.enabled = currentXrEnabled;
		renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

		renderer.setRenderTarget( currentRenderTarget );

		// Restore viewport
		var viewport = camera.viewport;
		if ( viewport !== undefined ) {
			renderer.state.viewport( viewport );
		}

		scope.visible = true;
	}	
}

Reflector.prototype = Object.create( THREE.Mesh.prototype );
Reflector.prototype.constructor = Reflector;

// 'vUv2 = textureMatrix * vec4( position, 1.0 );',
// 'vec4 reflection = texture2DProj( tDiffuse, vUv2 );',
Reflector.ReflectorShader = 
{

	uniforms: THREE.UniformsUtils.merge( [
	THREE.UniformsLib[ "ambient" ],
	THREE.UniformsLib['lights'],
    THREE.UniformsLib[ "fog" ],{
		'color': {
			type: 'c',
			value: null
		},
		'tDiffuse': {
			type: 't',
			value: null
		},
		'textureMatrix': {
			type: 'm4',
			value: null
		},
		'intensity': {
			type: 'f',
			value: 0.5
		},
		'blendIntensity': {
			type: 'f',
			value: 0.5
		},
		'tOneWrapX': {
			type: 'f',
			value: 1.0
		},
		'tOneWrapY': {
			type: 'f',
			value: 1.0
		},
		'tTwoWrapX': {
			type: 'f',
			value: 1.0
		},
		'tTwoWrapY': {
			type: 'f',
			value: 1.0
		},
		'tOne': {
			type: 't',
			value: null
		},
		'tSec':{
			type: 't',
			value: null
		},
		'tOneFlag':{
			type: 'b',
			value: false
		},
		'tTwoFlag':{
			type: 'b',
			value: false
		},
		'invertedUV':{
			type: 'b',
			value: false
		}
	}]),

	vertexShader: [
	'#ifdef GL_ES',
        'precision highp float;',
      '#endif',

      'uniform bool invertedUV;',

      'uniform mat4 textureMatrix;',
      'varying vec2 vUv;',
      'varying vec4 vUv2;',

      'void main()', 
      '{',
        'vUv = uv;',
        'vUv2 = textureMatrix * vec4( position, 1.0 );',
        'if(invertedUV)',
        '{',
          'vUv[0] = uv[0];',
          'vUv[1] = 1.0 - uv[1];',
        '}',       
        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}',
	].join( '\n' ),

	fragmentShader: [
	  '// All variables related to Texture one and two',
      '//Is Texture One available',
      'uniform bool tOneFlag;',
      '//Is Texture Two available',
      'uniform bool tTwoFlag;',
      '//If the model is GLTF sometimes the uv is inverted',
      'uniform bool invertedUV;',
      '//The wrap repeat x and y for texture one',
      'uniform float tOneWrapX;',
      'uniform float tOneWrapY;',      
      '//The wrap repeat x and y for texture two',
      'uniform float tTwoWrapX;',
      'uniform float tTwoWrapY;',
      'uniform float blendIntensity;',
      '//The textures themselves',
      'uniform sampler2D tOne;',
      'uniform sampler2D tSec;',
      '//The tDiffuse holds the texture of the scene reflection',
      'uniform sampler2D tDiffuse;  '   , 
      '//The intensity of the reflection',
      'uniform float intensity;',
      '//The color of the material incase of two textures arent available',
      'uniform vec3 color;',
      '//vUv2 and vUv is coming from uv coordinates and texture matrix projection',
      'varying vec2 vUv;',
      'varying vec4 vUv2;',
      THREE.ShaderChunk[ "common" ],
      THREE.ShaderChunk[ "fog_pars_fragment" ],

      'void main() ',
      '{',
            'vec3 c;',
            'vec3 tcolors;',
            'vec4 reflection = texture2DProj( tDiffuse, vUv2 );',
            'vec4 Ca;',
            'vec4 Cb;',
            
            'if(!tOneFlag && !tTwoFlag)',
            '{',
                'c = (reflection.rgb * (reflection.a * intensity)) + (color.rgb * (1.0 - (reflection.a * intensity)));',
            '}',
            'if(tOneFlag && tTwoFlag)',
            '{',
            	'Ca = texture2D(tOne, vec2(vUv[0] * tOneWrapX, vUv[1] * tOneWrapY));',
        		'Cb = texture2D(tSec, vec2(vUv[0] * tTwoWrapY, vUv[1] * tTwoWrapY));',
                
                'tcolors = (Ca.rgb * blendIntensity) + (Cb.rgb * (1.0 - blendIntensity));',
                'c = (reflection.rgb * (reflection.a * intensity)) + (tcolors.rgb * (1.0 - (reflection.a * intensity)));',
            '}',
            'else if(tOneFlag && !tTwoFlag)',
            '{',
            	'Ca = texture2D(tOne, vec2(vUv[0] * tOneWrapX, vUv[1] * tOneWrapY));',
                'tcolors = (Ca.rgb * 1.0);',
                'c = (reflection.rgb * (reflection.a * intensity)) + (tcolors.rgb * (1.0 - (reflection.a * intensity)));',
            '}',
            'else if(!tOneFlag && tTwoFlag)',
            '{',
            	'Cb = texture2D(tSec, vec2(vUv[0] * tTwoWrapY, vUv[1] * tTwoWrapY));',
                'tcolors = (Cb.rgb * 1.0);',
                'c = (reflection.rgb * (reflection.a * intensity)) + (tcolors.rgb * (1.0 - (reflection.a * intensity)));',
            '}',
            'gl_FragColor = vec4(c, 1.0);',
            THREE.ShaderChunk[ "fog_fragment" ],
      '}',
	].join( '\n' ),
};


AFRAME.registerComponent('aframe-mirror', 
{
	schema:{
		textureOne: 	{type:'string',   	default:''},
	    textureTwo: 	{type:'string',		default:''},
	    wrapOne: 		{type:'vec2', 		default:{x: 1, y: 1}},
	    wrapTwo: 		{type:'vec2', 		default:{x: 1, y: 1}},
	    invertedUV: 	{type:'boolean', 	default:false},
	    textureWidth: 	{type:'int', 		default:256},
	    textureHeight: 	{type:'int', 		default:256},
	    color: 			{type:'color', 		default:'#848485'},
	    intensity: 		{type:'number', 	default:0.5},
	    blendIntensity: {type:'number', 	default:1.0}
	},
	init: function () 
	{
	    const mirrorMesh 	= this.el.getObject3D('mesh');

	    if(!mirrorMesh) {
			console.warn("no mesh attached to mirror component");
	    	return;
	    }

	    this.reflector = Reflector(mirrorMesh, this.data);
	},
});