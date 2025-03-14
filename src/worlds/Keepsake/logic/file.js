class FileLogic {
    getFileFromSystem = function() {
        try {
            const s3Repository = new S3Repository();
            const basicLogic = new BasicLogic();

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.display = 'none';
            document.body.appendChild(fileInput);
    
            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if(file) {
                    this.loadObjectInScene(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const arrayBuffer = e.target.result;
                        
                        console.log(arrayBuffer);

                        // TODO => get current user id from session
                        // TODO => add custom metadata to the artifact

                        const timestamp = basicLogic.getCurrentTimestamp();
                        const binaryData = basicLogic.arrayBufferToBase64(arrayBuffer);
                        const artifact = new Artifact("owl", 1, "", "", [], [], binaryData);

                        s3Repository.uploadToS3(artifact);
                    };
                    reader.readAsArrayBuffer(file);
                }
            });
            fileInput.click();
        } catch (error) {
            console.error(error);
        }
        
    }

    loadObjectInScene(file){
        const camera = document.getElementById("camera");
        const model = document.createElement("a-entity");
        model.setAttribute("gltf-model", `url(${URL.createObjectURL(file)})`);
        model.setAttribute("position", "0 0 -2");
        camera.appendChild(model);
    } 
}



