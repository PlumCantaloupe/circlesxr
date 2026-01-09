This interaction event is a simple placement puzzle where users are required to place certain objects in the placement spots provided. The placement spots then to be a transparent version of the puzzle objects so that the user knows it can be put there. Recommendation is to have either colour theory or different kinds of models for each puzzle object/placement spot pair so that it helps imply what users need to do.

In this interaction event, by default there are 3 constructed objectInfo class variables, and 1 constructed deleteObjectInfo class variable and 2 new registered AFrame components called ‘button’ and ‘placementSpots’ . To apply this interaction event to your world ensure that there are 3.
After adding the scripts to your world’s js folder and referencing the scripts in the index file, the following the steps to set up this interaction event:
    
    1. Create 3 AFrame entities that have the ‘circles-pickup-networked’ and ensure the id of the entities each match one of the objectIDs in the already constructed objectInfo class variables found in the HoldObject.js.
    2. Create 3 AFrame entities that have the ‘placementSpots’ component and make sure that the id of the entities each match one of the requiredSpot variable in the already constructed objectInfo class variables found in the HoldObject.js.
    3. Create 1 AFrame entity with the same id as the objectID in the already constructed deleteObjectInfo in the interactEvents.js. 
    4. Create 1 AFrame entity with the ‘button’ component.

Following the steps above should have the interaction event set up, and all you need to do is place the objects where you want them to be. If something isn’t working, ensure to double check that entity IDs are matching the corresponding constructed class object variable objectID.
 
More info on each JS file can be found below:

HoldObject: Initializes the class objectInfo and has the necessary functions for the puzzle objects.
To create a new puzzle object make sure to create a new objectInfo class and ensure the objectID is the same as the id of the AFrame entity and the placementSpot entity id is the same as the requiredSpot field. Also make sure to add the new objectInfo variable to the puzzleObjects array.


PlacementSpots: this JS file initializes a new AFrame component called placementspots. This ensures when a user clicks on a placement spot while holding a puzzle object that the puzzle object will be placed in the spot. No changes should be done here if more puzzle objects are created.


interactEvents: Initializes deleteObjectInfo class and any interaction event functions outside the placementSpots and HoldObject files.
To create a new delete object (an object that will be deleted when the puzzle is completed) ensure the AFrame entity id is the same as the objectID in the newly created deleteObjectInfo variable. And then make sure to add the new delete object to the deleteObjects array.
This file also creates a new AFrame component called button which creates an event listener for the button that when pressed it will check to see if all puzzle objects are in the required spot, and if they are, delete all objects.
To have the button event do more than delete the objects in the deleteObject array, adding any logic or function calls within the if statement will run if all puzzle objects are in the correct position. 




