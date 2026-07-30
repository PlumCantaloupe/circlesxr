# Circles Core Functions

Circles gives you access to useful functions that can aid in the creation of your own components and immersive spaces.

```js
//get the name of the group we are in (users in a group can only see each other)
CIRCLES.getCirclesGroupName();

//get the name of the Circles' world the user is in
CIRCLES.getCirclesWorldName();

//get the name of the current user
CIRCLES.getCirclesUserName();

//find out if Circles is ready i.e., your avatar is constructed.
CIRCLES.isReady();

//return the avatar element (perhaps we want to add something to the avatar or query for body elements to change their colour).
CIRCLES.getAvatarElement();

//return the rig of the avatar (when we want to move our avatar i.e., teleport them somewhere. or access things like aframe-extra's "movement-controls" to adjust speed, enable/disble etc.)
CIRCLES.getAvatarRigElement();

//return the camera element (from the avatar's point of view, if you want parent things to the camera e.g., adding UIs))
CIRCLES.getMainCameraElement();

//get reference to the Circles manager entity
CIRCLES.getCirclesManagerElement();

//get reference to the Circles manager component
CIRCLES.getCirclesManagerComp();

//returns reference to held element, or null if no held object on this player/client  
CIRCLES.getPickedUpElement();

//to get the non-networked id of an elem (queries the 'circles-object-world' component for the original "id") 
CIRCLES.getNonNetworkedID(elem);

//get communication socket
CIRCLES.getCirclesWebsocket();

//return all avatars in the scene. Yourself and other networked-aframe avatar entities
CIRCLES.getNetworkedAvatarElements();

//return all networked-aframe networked entities (includes avatars and any other objects). You may have to dig into children for the geometry, materials etc.
CIRCLES.getAllNetworkedElements();
```