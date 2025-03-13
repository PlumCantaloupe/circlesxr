class FileLogic {
    getFileFromSystem = function() {
        try {
            const s3Repository = new S3Repository();
            const basicLogic = new BasicLogic();

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.display = 'none';
            document.body.appendChild(fileInput);
    
            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if(file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const arrayBuffer = e.target.result;
                        console.log(arrayBuffer);

                        // TODO => get current user id from session
                        // TODO => add custom metadata to the artifact

                        const timestamp = basicLogic.getCurrentTimestamp();
                        const binaryData = basicLogic.arrayBufferToBase64(arrayBuffer);
                        const artifact = new Artifact(file.name + timestamp, 1, "", "", [], [], binaryData);

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
}



