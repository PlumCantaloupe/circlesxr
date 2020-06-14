//https://github.com/aalavandhaann/three_reflector

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
	    blendIntensity: {type:'number', 	default:0.5},
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
	}
});