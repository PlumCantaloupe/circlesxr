AFRAME.registerComponent("update-canvas", {
    dependencies: ['geometry', 'material'],

    schema: {},
    
    init: function() {
    
        const Context_AF = this;
        Context_AF.isDrawing = false;
        Context_AF.texture = null;
        Context_AF.material = Context_AF.el.getObject3D("mesh").material;
        let canvas = document.getElementById("drawCanvas");
        const context = canvas.getContext("2d");

        // let imgData = context.getImageData(0,0,canvas.width, canvas.height);

        Context_AF.updateButton = document.querySelector("#updateTexture");


        Context_AF.socket= null;
        Context_AF.connected  = false;


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


        Context_AF.createNetworkingSystem = function () {
            Context_AF.socket = CIRCLES.getCirclesWebsocket();
            Context_AF.connected = true;

            console.log('CONNECTED!!!!!!!!');

            Context_AF.updateButton.addEventListener("click",function(){

                // const imgData = context.getImageData(0,0,canvas.width, canvas.height);
             
                // imgData is saved as an ImageData object as expected...
                // console.log('Sending canvas: ' + imgData);  //// Sending canvas: [object ImageData]
                // console.log(imgData);
                // but it's not sending as an ImageData obj ......
                // Context_AF.socket.emit('updateCanvas', imgData);
               

                // https://developer.mozilla.org/en-US/docs/Web/API/ImageData/ImageData
                // https://stackoverflow.com/questions/22228552/serialize-canvas-content-to-arraybuffer-and-deserialize-again
                // trying to send as Uint8ClampedArray >>> did not work
                // const imgData = context.getImageData(0,0,canvas.width, canvas.height);
                // const canvasArray = new Uint8Array(imgData.data);
                // let canvasBuffer = imgData.data.buffer;
                // Context_AF.socket.emit('updateCanvas', canvasBuffer);


                // apply texture to plane client only


                applyTexture();
                sendCanvasData();
                
            });

            // recieve canvas data, updates canvas than applies texture
            // Context_AF.socket.on('updateCanvas', (dataURL) => {

            //     // console.log('front end recieving: ' + data);    //// front end recieving: [object ArrayBuffer]
            //     // let incommingBuffer = data;
            //     // let imgData = context.createImageData(canvas.width, canvas.height);
            //     // imgData.data.set(incommingBuffer); 
            //     // context.putImageData(imgData,0,0);
                
            //     console.log('recieving dataURL');
            //     const img = new Image();
            //     img.src = dataURL;
            //     img.onload = () => {
            //         context.clearRect(0, 0, canvas.width, canvas.height); // Clear before drawing
            //         context.drawImage(img, 0, 0);
            //     };
            //     applyTexture();
            // });

            Context_AF.socket.on('updateCanvas', (arrayBuffer) => {
                
                console.log('recieving arrayBuffer');

                const blob = new Blob([arrayBuffer], { type: "image/png" });
                const url = URL.createObjectURL(blob);

                console.log('url: '+ url);
                const img = new Image();
                img.src = url;
                img.onload = () => {
                    context.clearRect(0, 0, canvas.width, canvas.height); // clear before drawing
                    context.drawImage(img, 0, 0);
                    // no longer needed, clear up memory
                    URL.revokeObjectURL(url); 
                };
                applyTexture();
            });


        };

        function applyTexture (){
            material = Context_AF.el.getObject3D("mesh").material;
            material.map.needsUpdate = true;
            console.log("updating texture ");
        }

        //https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
        // https://jsfiddle.net/donmccurdy/jugzk15b/
        function sendCanvasData (){

            // const dataURL = canvas.toDataURL("image/png"); 
            // Context_AF.socket.emit("canvasData", dataURL);

            // console.log('sending dataURL');

            canvas.toBlob((blob) => {
                if (!blob) return;
        
                // Convert Blob to ArrayBuffer
                const reader = new FileReader();
                reader.readAsArrayBuffer(blob);
                reader.onloadend = () => {
                    socket.emit("canvasData", reader.result);
                };
            }, "image/png"); 

        }

        // updates canvas periodically for all users 
        //this would override all canvases. if new person joined the canvas set to blank for all 
        //setInterval(sendCanvasData, 3000);


        if (CIRCLES.isCirclesWebsocketReady()) {
            Context_AF.createNetworkingSystem();
            console.log('circles websocket is ready ');
        }
        else {
            const wsReadyFunc = function() {
                Context_AF.createNetworkingSystem();
                Context_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
            };
            Context_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        }

        Context_AF.el.addEventListener("loaded", e => {

            //console.log('the plane is loaded');
            // let mesh = Context_AF.el.getObject3D("mesh");
            // Context_AF.texture = new THREE.CanvasTexture(canvas);
            // let textureToBeRemoved = mesh.material.map;
            // mesh.material.map = Context_AF.texture;
            // if (textureToBeRemoved) textureToBeRemoved.dispose();
        });



        },

    // tick: function() {
    //     const Context_AF = this;
    //     material = Context_AF.el.getObject3D("mesh").material;
    //     if (!material.map) {
    //         console.error("no material map");
    //         return;
    //       }
    //       else if (Context_AF.isDrawing){
    //         material.map.needsUpdate = true;
    //         console.log("updating texture")

    //       }
          
    // }
  });