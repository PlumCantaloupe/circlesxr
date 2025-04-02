'use strict';


//this component will make the collider box follow the players position
AFRAME.registerComponent('follow-book', {
  schema: {
    bookid: {type: 'int', default: 0}
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  tick: function(){
    const CONTEXT_AF = this;
    CONTEXT_AF.book = document.querySelector([`#book${CONTEXT_AF.data.bookid}`]);

    CONTEXT_AF.worldPos = new THREE.Vector3();
    CONTEXT_AF.position = CONTEXT_AF.book.object3D.getWorldPosition(CONTEXT_AF.worldPos);
    
    CONTEXT_AF.el.setAttribute('position', {x:CONTEXT_AF.worldPos.x, y:CONTEXT_AF.worldPos.y, z:CONTEXT_AF.worldPos.z});
  }
});