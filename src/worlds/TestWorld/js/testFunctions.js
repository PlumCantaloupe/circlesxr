function onWorldReadyAll() {
    document.querySelectorAll('[circles-user-networked]').forEach(av => {
        av.components['circles-user-local'].el.setAttribute('circles-user-local', 'userVisibility', 'wireframe');;
    });

    // also catch avatars that join after world load
    document.addEventListener(CIRCLES.EVENTS.USER_CONNECTED, (e) => {
        NAF.entities.getEntity(e.detail.id.slice(4)).querySelector('.avatar').setAttribute('circles-user-local', 'userVisibility', 'wireframe');
    });
}