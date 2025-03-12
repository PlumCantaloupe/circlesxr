AFRAME.registerComponent("update-canvas", {
    dependencies: ['geometry', 'material'],

    schema: {},
    
    init: function() {
    
        const Context_AF = this;
        Context_AF.isDrawing = false;
        Context_AF.texture = null;
        Context_AF.material = Context_AF.el.getObject3D("mesh").material;
        let canvas = document.getElementById("drawCanvas");

        canvas.addEventListener("mouseup", e => {
            Context_AF.isDrawing = false;
            console.log("mouseup in the updatee component")
        });
        canvas.addEventListener("mouseout", e => {
            Context_AF.isDrawing = false;
            console.log("mouse out in the updatee component")
        });
        canvas.addEventListener("mousedown", e => {
            Context_AF.isDrawing = true;
            console.log("mousedown in the updatee component")
        });

        Context_AF.el.addEventListener("loaded", e => {

            //console.log('the plane is loaded');
            // let mesh = Context_AF.el.getObject3D("mesh");
            // Context_AF.texture = new THREE.CanvasTexture(canvas);
            // let textureToBeRemoved = mesh.material.map;
            // mesh.material.map = Context_AF.texture;
            // if (textureToBeRemoved) textureToBeRemoved.dispose();
        });
        },

    tick: function() {
        const Context_AF = this;
        material = Context_AF.el.getObject3D("mesh").material;
        if (!material.map) {
            console.error("no material map");
            return;
          }
          else if (Context_AF.isDrawing){
            material.map.needsUpdate = true;
            console.log("updating texture")

          }
          

    // if (Context_AF.texture && Context_AF.isDrawing) Context_AF.texture.needsUpdate = true;
    }
  });