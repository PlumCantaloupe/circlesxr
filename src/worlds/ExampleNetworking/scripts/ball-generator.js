AFRAME.registerComponent('ball-generator', {
    schema: {
        color:                      {type:'color'},                         //ball color
        ball_radius:                {type:'number', default:0.2},           //radius of size
        ball_radius_deviation:      {type:'number', default:0.0},           //radius of size
        spawn_position:             {type:'vec3', default:{x:0, y:2, z:0}}, //where the balls spawn
        spawn_position_deviation:   {type:'number', default:0.0},           //radius of size
    },
    init() {
        const COMP_REF = this;
        COMP_REF.el.addEventListener('click', (e) => {
            let newBall = document.createElement('a-entity');
            newBall.setAttribute('geometry', {primitive:'dodecahedron', radius:COMP_REF.data.ball_radius + THREE.MathUtils.randFloat(-COMP_REF.data.ball_radius_deviation,COMP_REF.data.ball_radius_deviation)});
            newBall.setAttribute('material', {color:CIRCLES.getRandomColor()});
            newBall.setAttribute('position', {  x:COMP_REF.data.spawn_position.x + THREE.MathUtils.randFloat(-COMP_REF.data.spawn_position_deviation, COMP_REF.data.spawn_position_deviation), 
                                                y:COMP_REF.data.spawn_position.y + THREE.MathUtils.randFloat(-COMP_REF.data.spawn_position_deviation, COMP_REF.data.spawn_position_deviation), 
                                                z:COMP_REF.data.spawn_position.z + THREE.MathUtils.randFloat(-COMP_REF.data.spawn_position_deviation, COMP_REF.data.spawn_position_deviation) });
            newBall.setAttribute('circles-pickup-object', {});
            newBall.setAttribute('circles-pickup-networked', {});
            COMP_REF.el.sceneEl.append(newBall);
        });
    }
});