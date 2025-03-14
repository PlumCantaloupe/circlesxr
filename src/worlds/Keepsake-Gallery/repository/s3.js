class S3Repository{ 
    uploadToS3 = async (artifact, file) => {
        try{
            const response = await fetch('/s3_upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(artifact.toJson()),
            });
    
            if (response.status == 200) {
                console.log("Object uploaded successfully");
                await this.retrieveAllObjects(artifact.objectKey, file);
            } else {
                console.error("Error uploading object");
            }
        } catch(error){
            console.error(error);
        }
        
    }

    retrieveAllObjects = async (key, file) => {
        try{
            const response = await fetch(`/s3_retrieveObject:${key}`);
            if(response.status == 200){
                console.log("Object retrieved successfully!");
                new FileLogic().loadObjectInScene(file);
                // const jsonResponse = await response.json();
                // const data = jsonResponse.data.Contents;
                // const sortedArtifacts = data.sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));
                // const lastArtifact = sortedArtifacts[0];
                //await this.retrieveObject(lastArtifact.Key);
            } else {
                console.log("Error retrieving object");
                return null;
            }
        } catch(error){
            console.error(error);
            return null;
        }
    }

    retrieveObject = async (key) => {
        try{
            const response = await fetch(`/s3_retrieveObject${key}`);
            if(response.status == 200){
                const data = await response.json();
                console.log(data);
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