AFRAME.registerComponent('aframe-mirror', 
{
	schema:{
	    textureOne: {default: undefined},
	    textureTwo: {default: undefined},
	    wrapOne: 
	    {
	    	type: 'vec2',
	    	default: {x: 1, y: 1}
	    },
	    wrapTwo: 
	    {
	    	type: 'vec2',
	    	default: {x: 1, y: 1}
	    },
	    invertedUV:
	    {
	    	type: 'bool',
	    	default: false
	    },
	    textureWidth: {default: window.innerWidth},
	    textureHeight: {default: window.innerHeight},
	    color: {default: new THREE.Color(0x7F7F7F)},
	    intensity: {default: 1.0},
	    blendIntensity: {default: 0.5},
	},
	init: function () 
	{
	    var scene = this.el.sceneEl;
	    var three_scene = scene.object3D;
	    var mirrorObj = this.el.getObject3D('mesh');

	    if(!mirrorObj)
	    {
	    	return;
	    }

	    var gscenereflector = Ashok.GroundSceneReflector(mirrorObj, scene.renderer, three_scene, this.data);
	},
	tick: function () 
	{	    	

	}
});