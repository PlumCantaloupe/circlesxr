'use strict';

AFRAME.registerComponent('circles-interactive-object', {
  schema: {
    highlight_color:    {type:'color',      default:'rgb(255,255,255)'},
    hovered_scale:      {type:'number',     default:1.05},
    clicked_scale:      {type:'number',     default:1.05},
    neutral_scale:      {type:'number',     default:1.05},
  },
  init: function() {
    const Context_AF = this;
    const data = this.data;

    //Context_AF.highlightElem    = null;
    //this is the visible object model
    Context_AF.highlightElem = document.createElement('a-entity');
    Context_AF.highlightElem.addEventListener('loaded', function (evt) {
        Context_AF.highlightElem.emit(CIRCLES.EVENTS.OBJECT_HIGHLIGHT_LOADED, false);
    });
    // Context_AF.createHighlightElement(); 

    if (Context_AF.el.sceneEl.hasLoaded) {
        Context_AF.createHighlightElement(); 
        console.log('SCENE LOADED');
    }
    else {
        Context_AF.el.sceneEl.addEventListener('loaded', () => Context_AF.createHighlightElement());
        console.log('SCENE not LOADED yet');
    }

    // const loadFunc = (e) => {
    //     if (e.detail.type === 'mesh') { 
    //         Context_AF.createHighlightElement(); 
    //         Context_AF.el.removeEventListener('object3dset', loadFunc);
    //     }
    //     //targetObj.getObject3D('mesh');
    //     console.log(e.detail.type);
    // };

    // Context_AF.el.addEventListener('object3dset', loadFunc);

    // Context_AF.el.addEventListener('model-loaded', (e) => {

    // });
  },
  update: function(oldData) {
    const Context_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    //highlight color change
    if ( (oldData.highlight_color !== data.highlight_color) && (data.highlight_color !== '') ) {
        Context_AF.highlightElem.highlight_color = data.highlight_color;
        Context_AF.highlightElem.setAttribute('material', {color:data.highlight_color});
    }

    //size changes
    if ( (oldData.hovered_scale !== data.hovered_scale) && (data.hovered_scale !== '') ) {
        Context_AF.highlightElem.hovered_scale = data.hovered_scale;
    }

    if ( (oldData.clicked_scale !== data.clicked_scale) && (data.clicked_scale !== '') ) {
        Context_AF.highlightElem.clicked_scale = data.clicked_scale;
    }

    if ( (oldData.neutral_scale !== data.neutral_scale) && (data.neutral_scale !== '') ) {
        Context_AF.highlightElem.neutral_scale = data.neutral_scale;
        Context_AF.highlightElem.setAttribute('scale', {x:data.neutral_scale, y:data.neutral_scale, z:data.neutral_scale});
    }
  },
  createHighlightElement : function () {
    const Context_AF = this;
    const data = this.data;
    let modelElem = Context_AF.el;
    
    //need to do this for loaded objects like gltf ...
    Context_AF.highlightElem.addEventListener('model-loaded', function (e) {
        let model               = Context_AF.highlightElem.getObject3D('mesh');
        let flatMat             = new THREE.MeshBasicMaterial();
        flatMat.color           = data.highlight_color;
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

    Context_AF.highlightElem.setAttribute('class', 'object_highlight');
    
    //copy attributes over (this really sucks ... find a better way :)
    if (modelElem.hasAttributes()) {
        const attrs = modelElem.attributes;
        for(let i = attrs.length - 1; i >= 0; i--) {
            if (    attrs[i].name !== 'id' && 
                    attrs[i].name !== 'class' && 
                    attrs[i].name !== 'material' && 
                    attrs[i].name !== 'position' && 
                    attrs[i].name !== 'rotation' && 
                    attrs[i].name !== 'scale' &&
                    attrs[i].name !== 'sound' && 
                    attrs[i].name !== 'circles-sphere-env-map' && 
                    attrs[i].name !== 'shadow' && 
                    attrs[i].name !== 'visible' && 
                    attrs[i].name !== 'circles-interactive-object' &&
                    attrs[i].name !== 'circles-object-label' &&
                    attrs[i].name !== 'networked' &&
                    attrs[i].name !== 'circles-inspect-object' &&
                    attrs[i].name !== 'circles-object-world' && 
                    attrs[i].name !== 'circles-artefact' ) {
                Context_AF.highlightElem.setAttribute(attrs[i].name,attrs[i].value);
            }
        }
    }

    //inverse shell method as post-processing is far too expensive for mobile VR (setting mat also so that primitives also work)
    Context_AF.highlightElem.setAttribute('material', {color:data.highlight_color, shader:'flat', side:'back'});    
    Context_AF.highlightElem.setAttribute('scale', {x:data.neutral_scale, y:data.neutral_scale, z:data.neutral_scale});
    Context_AF.highlightElem.setAttribute('shadow', {cast:false, receive:false});
    Context_AF.highlightElem.setAttribute('visible', false);
    modelElem.appendChild(Context_AF.highlightElem);

    //clicked
    modelElem.addEventListener('click', (e) => {
        Context_AF.highlightElem.setAttribute('scale', {x:data.clicked_scale, y:data.clicked_scale, z:data.clicked_scale});
        const timeoutObj = setTimeout(() => {
            Context_AF.highlightElem.setAttribute('scale', {x:data.hovered_scale, y:data.hovered_scale, z:data.hovered_scale});
            clearTimeout(timeoutObj);
          }, 200);
    });

    //hovering
    modelElem.addEventListener('mouseenter', (e) => {
        Context_AF.highlightElem.setAttribute('visible', true);
        Context_AF.highlightElem.setAttribute('scale', {x:data.hovered_scale, y:data.hovered_scale, z:data.hovered_scale});
    });

    //not hovering
    modelElem.addEventListener('mouseleave', (e) => {
        Context_AF.highlightElem.setAttribute('visible', false);
        Context_AF.highlightElem.setAttribute('scale', {x:data.neutral_scale, y:data.neutral_scale, z:data.neutral_scale});
    });
  },
  tick: function (time, timeDelta) {
    // from discussion here: https://github.com/aframevr/aframe/issues/3556
    // if (time === 0) {
    //     this.createHighlightElement();
    // }
  },
  remove: function () {}
});