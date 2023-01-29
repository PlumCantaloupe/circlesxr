'use strict';

AFRAME.registerComponent('circles-interactive-object', {
  schema: {
    type:               {stype:'string',    default:'outline', oneOf:['outline','scale']},
    highlight_color:    {type:'color',      default:'rgb(255,255,255)'}, //only for outline effect
    neutral_scale:      {type:'number',     default:1.00},    //only for outline effect
    hover_scale:        {type:'number',     default:1.08},
    click_scale:        {type:'number',     default:1.10},
    enabled:            {type:'boolean',    default:true}
  },
  init: function() {
    const CONTEXT_AF = this;
    const data = this.data;

    //make sure this is interactive
    if (!CONTEXT_AF.el.classList.contains('interactive')) {
        CONTEXT_AF.el.classList.add('interactive');
    }

    if (data.type === 'outline') {
        CONTEXT_AF.highlightElem = document.createElement('a-entity');

        const callbackHighlight = (e) => {
            //have to make sure there is geo to copy for highlight first
            if (CONTEXT_AF.el.getObject3D('mesh')) {
                //MUST remove thos when created else an infinite loop will trigger as child highlight elem bubbles object3dset event
                CONTEXT_AF.el.removeEventListener('object3dset', callbackHighlight);
            }
            else {
                return;
            }

            CONTEXT_AF.createHighlightElement(CONTEXT_AF);
        };
        CONTEXT_AF.el.addEventListener('object3dset', callbackHighlight);

        if (CONTEXT_AF.el.getObject3D('mesh')) {
            CONTEXT_AF.createHighlightElement(CONTEXT_AF);
            CONTEXT_AF.el.removeEventListener('object3dset', callbackHighlight);
        }
    }
    else {

        CONTEXT_AF.clickListenerFunc = function(e) {
            const newScale = CONTEXT_AF.origScale.clone();
            newScale.multiplyScalar(CONTEXT_AF.data.click_scale);
            CONTEXT_AF.el.object3D.scale.set(newScale.x, newScale.y, newScale.z);
        };

        CONTEXT_AF.mouseenterListenerFunc = function(e) {
            CONTEXT_AF.origScale = (CONTEXT_AF.el.hasAttribute('circles-inspect-object')) ? CONTEXT_AF.el.components['circles-inspect-object'].getOrigScaleThree() : CONTEXT_AF.el.object3D.scale.clone();
            const newScale = CONTEXT_AF.origScale.clone();
            newScale.multiplyScalar(CONTEXT_AF.data.hover_scale);
            CONTEXT_AF.el.object3D.scale.set(newScale.x, newScale.y, newScale.z);
        };

        CONTEXT_AF.mouseleaveListenerFunc = function(e) {
            CONTEXT_AF.el.object3D.scale.set(CONTEXT_AF.origScale.x, CONTEXT_AF.origScale.y, CONTEXT_AF.origScale.z);
        };

        CONTEXT_AF.setEnabled(true);
    }
  },
  update: function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    //highlight color change
    if ( (oldData.highlight_color !== data.highlight_color) && (data.highlight_color !== '') ) {
        if (data.type === 'outline') {
            CONTEXT_AF.highlightElem.highlight_color = data.highlight_color;
            CONTEXT_AF.highlightElem.setAttribute('material', {color:data.highlight_color});
        }
    }

    //size changes
    if ( (oldData.hover_scale !== data.hover_scale) && (data.hover_scale !== '') ) {
        if (data.type === 'outline') {
            CONTEXT_AF.highlightElem.hover_scale = data.hover_scale;
        }
    }

    if ( (oldData.click_scale !== data.click_scale) && (data.click_scale !== '') ) {
        if (data.type === 'outline') {
            CONTEXT_AF.highlightElem.click_scale = data.click_scale;
        }
    }

    if ( (oldData.neutral_scale !== data.neutral_scale) && (data.neutral_scale !== '') ) {
        if (data.type === 'outline') {
            CONTEXT_AF.highlightElem.neutral_scale = data.neutral_scale;
            CONTEXT_AF.highlightElem.setAttribute('scale', {x:data.neutral_scale, y:data.neutral_scale, z:data.neutral_scale});
        }
    }

    if ( (oldData.type !== data.type) && (data.type !== '') ) {
        console.warn('circles-interactive-object: Should not change \'type\' after initialization (for now).');
    }

    if ( (oldData.enabled !== data.enabled) && (data.enabled !== '') ) {
        CONTEXT_AF.setEnabled(data.enabled);
    }
  },
  createHighlightElement : function (CONTEXT_AF) {
    const data = CONTEXT_AF.data;
    let modelElem = CONTEXT_AF.el;

    CONTEXT_AF.highlightElem = null;
    CONTEXT_AF.highlightElem = document.createElement('a-entity');
    
    //need to do this for loaded objects like gltf ...
    CONTEXT_AF.highlightElem.addEventListener('model-loaded', function (e) {
        let model               = CONTEXT_AF.highlightElem.getObject3D('mesh');
        let flatMat             = new THREE.MeshBasicMaterial();
        flatMat.color           = new THREE.Color(data.highlight_color);
        flatMat.transparency    = false;
        flatMat.side            = THREE.BackSide;

        model.traverse(function(node) {
            if (node.isMesh) {
                node.material = flatMat;
                node.castShadow = false;
                node.receiveShadow = false;
            } 
        });
    });

    CONTEXT_AF.highlightElem.setAttribute('class', 'object_highlight');

    const keys      = Object.keys(modelElem.components);
    const values    = Object.values(modelElem.components);

    //loop through existing components and copy over as efforts to clone just geo is a deadend currently with gltfs
    for(let i = keys.length - 1; i >= 0; i--) {
        if (    keys[i] !== 'id' && 
                keys[i] !== 'class' && 
                keys[i] !== 'material' && 
                keys[i] !== 'position' && 
                keys[i] !== 'rotation' && 
                keys[i] !== 'scale' &&
                keys[i] !== 'sound' && 
                keys[i] !== 'circles-sphere-env-map' && 
                keys[i] !== 'shadow' && 
                keys[i] !== 'visible' && 
                keys[i] !== 'circles-interactive-object' &&
                keys[i] !== 'circles-checkpoint' &&
                keys[i] !== 'circles-sendpoint' &&
                keys[i] !== 'circles-spawnpoint' &&
                keys[i] !== 'circles-object-label' &&
                keys[i] !== 'networked' &&
                keys[i] !== 'circles-inspect-object' &&
                keys[i] !== 'circles-object-world' && 
                keys[i] !== 'circles-artefact' ) {

                CONTEXT_AF.highlightElem.setAttribute(keys[i], values[i].data);
        }
    }

    //inverse shell method as post-processing is far too expensive for mobile VR (setting mat also so that primitives also work)
    CONTEXT_AF.highlightElem.setAttribute('material', {color:data.highlight_color, shader:'flat', side:'back'});    
    CONTEXT_AF.highlightElem.setAttribute('scale', {x:data.neutral_scale, y:data.neutral_scale, z:data.neutral_scale});
    CONTEXT_AF.highlightElem.setAttribute('shadow', {cast:false, receive:false});
    CONTEXT_AF.highlightElem.setAttribute('visible', (Math.abs(data.neutral_scale - 1.0) > Number.EPSILON)); //don't hide if neutral scale is larger suggestinga  want for a permanent outline
    modelElem.appendChild(CONTEXT_AF.highlightElem);

    //clicked
    CONTEXT_AF.clickListenerFunc = function(e) {
        CONTEXT_AF.highlightElem.setAttribute('scale', {x:data.click_scale, y:data.click_scale, z:data.click_scale});
        const timeoutObj = setTimeout(() => {
            CONTEXT_AF.highlightElem.setAttribute('scale', {x:data.hover_scale, y:data.hover_scale, z:data.hover_scale});
            clearTimeout(timeoutObj);
          }, 200);
    }

    //hovering
    CONTEXT_AF.mouseenterListenerFunc = function(e) {
        CONTEXT_AF.highlightElem.setAttribute('visible', true);
        CONTEXT_AF.highlightElem.setAttribute('scale', {x:data.hover_scale, y:data.hover_scale, z:data.hover_scale});
    }

    //not hovering
    CONTEXT_AF.mouseleaveListenerFunc = function(e) {
        CONTEXT_AF.highlightElem.setAttribute('visible', (Math.abs(data.neutral_scale - 1.0) > Number.EPSILON));
        CONTEXT_AF.highlightElem.setAttribute('scale', {x:data.neutral_scale, y:data.neutral_scale, z:data.neutral_scale});
    }

    CONTEXT_AF.setEnabled(true);
  },
  remove: function () {},
  setEnabled : function(enabled) {
    const CONTEXT_AF    = this;

    if (enabled) {
        if (CONTEXT_AF.clickListenerFunc) { CONTEXT_AF.el.addEventListener('click', CONTEXT_AF.clickListenerFunc); }
        if (CONTEXT_AF.mouseenterListenerFunc) { CONTEXT_AF.el.addEventListener('mouseenter', CONTEXT_AF.mouseenterListenerFunc); }
        if (CONTEXT_AF.mouseleaveListenerFunc) { CONTEXT_AF.el.addEventListener('mouseleave', CONTEXT_AF.mouseleaveListenerFunc); }
        if ( !CONTEXT_AF.el.classList.contains('interactive') ) {
            CONTEXT_AF.el.classList.add('interactive');
        }
        const raycasters = AFRAME.scenes[0].querySelectorAll('[raycaster]');
        raycasters.forEach(rc => {
            rc.components.raycaster.refreshObjects();
        }); 
    }
    else {
        if (CONTEXT_AF.clickListenerFunc) { CONTEXT_AF.el.removeEventListener('click', CONTEXT_AF.clickListenerFunc); }
        if (CONTEXT_AF.mouseenterListenerFunc) { CONTEXT_AF.el.removeEventListener('mouseenter', CONTEXT_AF.mouseenterListenerFunc); }
        if (CONTEXT_AF.mouseleaveListenerFunc) { 
            CONTEXT_AF.mouseleaveListenerFunc();
            CONTEXT_AF.el.removeEventListener('mouseleave', CONTEXT_AF.mouseleaveListenerFunc); 
        }
        if ( CONTEXT_AF.el.classList.contains('interactive') ) {
            CONTEXT_AF.el.classList.remove('interactive');
        }
        const raycasters = AFRAME.scenes[0].querySelectorAll('[raycaster]');
        raycasters.forEach(rc => {
            rc.components.raycaster.refreshObjects();
        }); 
    }
  },
  remove : function () {
    this.setEnabled(false);
  }
});