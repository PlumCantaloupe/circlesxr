class S3Repository{ 
    uploadToS3 = async (artifact) => {
        try{
            
            console.log(JSON.stringify(artifact.toJson()));
            const response = await fetch('/s3_upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(artifact.toJson()),
            });
    
            if (response.status == 200) {
                console.log("Object uploaded successfully");
            } else {
                console.error("Error uploading object");
            }
        } catch(error){
            console.error(error);
        }
        
    }

    retrieveFromS3 = async (key) => {
        try{
            const response = await fetch(`/s3/retrieve/${key}`);
            if(response.status == 200){
                console.log("Object retrieved successfully");
                return response.json();
            } else {
                console.log("Error retrieving object");
                return null;
            }
        } catch(error){
            console.error(error);
            return null;
        }
        
    }
}