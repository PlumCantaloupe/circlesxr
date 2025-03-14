class Artifact {
    constructor(objectKey, userId, objectName, objectDescription, reactions, comments, binaryData) {
        this.objectKey = objectKey == undefined ? "" : objectKey;
        this.userId = userId == undefined ? 0 : userId;
        this.objectName = objectName == undefined ? "" : objectName;
        this.objectDescription = objectDescription == undefined ? "" : objectDescription;
        this.reactions = reactions == undefined ? [] : reactions;
        this.comments = comments == undefined ? [] : comments;
        this.binaryData = binaryData == undefined ? "" : binaryData;
    }

    toJson() {
        return {
            "objectKey": this.objectKey,
            "userId": this.userId,
            "objectName": this.objectName,
            "objectDescription": this.objectDescription,
            "reactions": this.reactions,
            "comments": this.comments,
            "binaryData": this.binaryData
        };
    }


    static fromJson = (json) =>
        new Artifact(json.objectKey, json.userId, json.objectName, json.objectDescription, json.reactions, json.comments, json.binaryData);
}