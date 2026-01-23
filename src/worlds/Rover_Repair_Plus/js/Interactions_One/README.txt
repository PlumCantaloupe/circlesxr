Interaction One
This interaction event is a simple placement puzzle where users are required to place certain objects in the placement spots provided. The placement spots then to be a transparent version of the puzzle objects so that the user knows it can be put there. Recommendation is to have either colour theory or different kinds of models for each puzzle object/placement spot pair so that it helps imply what users need to do.

In this interaction event, by default there are 3 constructed objectInfo class variables, and 1 constructed deleteObjectInfo class variable and 2 new registered AFrame components called ‘button’ and ‘placementSpots’. To apply this interaction copy and paste the GameManager.js and InteractionOne folder into the world’s js folder, and ensure to include the scripts in the index file of the world. Once you have the files copied follow the following steps to set up the interaction in your new world:

Create 3 AFrame entities that have the ‘circles-pickup-networked’ and ensure the id of the entities each match one of the objectIDs in the already constructed objectInfo class variables found in the HoldObject.js.
Create 3 AFrame entities that have the ‘placementSpots’ component and make sure that the id of the entities each match one of the requiredSpot variables in the already constructed objectInfo class variables found in the HoldObject.js.
Create 1 AFrame entity with the same id as the objectID in the already constructed deleteObjectInfo in the interactEvents.js.
Create 1 AFrame entity with the ‘button’ component and the id must be ‘buttonPS’ <- note this id must be unique and cannot be reused in any way.

Following the steps above should have the interaction event set up, and all you need to do is place the objects where you want them to be. If something isn’t working, ensure to double check that entity IDs are matching the corresponding constructed class object variable.
 
Note: A quicker method to set up the Interaction is to go into the index file found in the Soical_Interactions world folder and copy and paste, lines 41 to 110. Doing this would only require changes to the AFrame entity (model, texture colour, ect).

More info on each JS file can be found below:

HoldObject: Initializes the class objectInfo and has the necessary functions for the puzzle objects.
To create a new puzzle object make sure to create a new objectInfo class and ensure the objectID is the same as the id of the AFrame entity and the placementSpot entity id is the same as the requiredSpot field. Also make sure to add the new objectInfo variable to the puzzleObjects array. IMPORTANT: Any new placementspot entity must have the id start with “placementspots’ for the game manager to recognize it as a placementspot.

PlacementSpots: this JS file initializes a new AFrame component called placementspots. This ensures when a user clicks on a placement spot while holding a puzzle object that the puzzle object will be placed in the spot. No changes should be done here if more puzzle objects are created.

interactEvents: Initializes deleteObjectInfo class and any interaction event functions outside the placementSpots and HoldObject files.
To create a new delete object (an object that will be deleted when the puzzle is completed) ensure the AFrame entity id is the same as the objectID in the newly created deleteObjectInfo variable. And then make sure to add the new delete object to the deleteObjects array.
This file also creates a new AFrame component called button which creates an event listener for the button that when pressed it will check to see if all puzzle objects are in the required spot, and if they are, delete all objects.
To have the button event do more than delete the objects in the deleteObject array, adding any logic or function calls within the function ‘deleteAllObjects’ will run if all puzzle objects are in the correct position. IMPORTANT: Ensure extra logic is within the function ‘deleteAllObjects’ as this is replicated to other players when called, therefore, any additional logic would also be replicated to others. 
