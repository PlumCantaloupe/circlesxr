Interactions_Three Read Me: (Last update 01-22-2026)

This interaction requires players to reconstruct an image. There are a total of 5 AFrame cubes with component ‘circles-pickup-networked’ that have a texture that corresponds to a bigger picture. There are also 4 AFrame cubes placed onto a ‘frame’ (AFrame plane) that also have textures that correspond to a bigger picture. Like in the first interaction, players need to find the missing image cubes and place them in the correct position on the frame. Once all image cubes are found, pushing a button will cause an object to be deleted (default puzzle solved event) 

In this interaction event, by default there are 5 constructed objectPictureInfo class objects, and 1 constructed deleteObjectPicInfo class variable. After adding the scripts to your world's js folder and referencing the scripts in the index file, The following are the steps to set up the interaction event:

Create your frame. Recommended is to make an AFrame plane entity that has 4 child AFrame entity objects that are placed in a position that doesn’t need to be filled to recreate the image. Then create another 5 child entity objects that have the component ‘picturespots’, have one of the following ids each {“picturespots_red”, “picturespots_green”, “picturespots_blue”, “picturespots_purple”, picturespots_yellow”}, and has circles-interactive-object="type:highlight". Note: these ids match the requiredSpot from the already constructed objectPictureInfo objects.
Create 5 AFrame entity objects that have the component ‘circles-pickup-networked’ and one of the following ids each {“redPictureObject_01”, “bluePictureObject_01”, “greenPictureObject_01”, “purplePictureObject_01”, “yellowPictureObject_01”}. Note: these ids match the objectIDs from the already constructed objectPictureInfo objects.
Create 1 AFrame entity object that has the id “delete1pic”. Note: this has to match the objectID found in a deleteObjectPicInfo class object.
Create 1 AFrane entity object that has the component ‘buttonpic’ and id=”buttonPic”.
Create 1 AFrame entity with the id “ScreenTextPicture” and set the default text to “Missing Picture Pieces” (This can be changed). This text is made to inform users with a visual cue that they completed the puzzle.

Following the steps above should have the interaction event set up, and all you need to do is place the objects where you want them to be. If something isn’t working, double check entity ids match the corresponding object, and ensure there is only one button with the component and id.

Note: A quicker method to set up the Interaction is to go into the index file found in the Soical_Interactions world folder and copy and paste, lines 204 to 285. Doing this would only require changes to the AFrame entity (model, texture colour, ect).

More info on each JS file can be found below:

PlacementSpotsPicture.js: This is where the AFrame component ‘picturespots’ is registered. IMPORTANT: Nothing should be changed here  or it risks breaking the functionality. 

interactEventPicture.js: This is where the deleteObjectPicInfo is defined. For adding an object, create a new deleteObjectPicInfo class object and provide it the same objectID as the AFrame entity id. Also add it to the deletePicObjects array. The AFrame component ‘buttonpic’ is registered here, IMPORTANT: no changes should be made here, instead, added functionality should be put in the checkPictures function. The checkPictures function checks to see if the picture has been recreated, and if it has, it will delete the object(s) in the deletePicObjects array. There are comments in checkPictures that state where to put the added functionality. Puzzle3SolvedUpdateScreens() is the function that updates the player with a visual cue, within the function itself you can change text and color that it changes to.


HoldObjectPicture.js: This is where the class objectPictureInfo class. To create a new objectPictureInfo class object, ensure the objectID and requiredSpot match the AFrame entity’s id that needs to be found and the AFrame entity’d id where the found entity needs to be placed respectfully. Ensure any new objectPictureInfo class object is placed in the puzzlePictureObjects array. Besides that, none of the other functions should be changed as it could potentially break the functionality of the interaction.

Updates (If any):
