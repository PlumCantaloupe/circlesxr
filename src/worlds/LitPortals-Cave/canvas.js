const canvas = document.getElementById("drawCanvas");
const context = canvas.getContext("2d");
const container = document.getElementById("canvasDiv")

let halfCanvas = canvas.width/2;

const ongoingTouches = [];


context.fillStyle = "#964B00";
context.fillRect(0,0, canvas.width, canvas.height);

let drawColour = "black";
let drawSize = "3";

let isDrawing = false;

//event listeners for when mouse or touch input occurs
canvas.addEventListener("touchstart", startTouch);
canvas.addEventListener("touchmove", drawTouch);
canvas.addEventListener("touchend", stopTouch);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);




function start(event){
    isDrawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft + halfCanvas, event.clientY - canvas.offsetTop + halfCanvas);
    // context.moveTo(event.offsetX, event.offsetY);

    event.preventDefault();
}

function draw(event){
    if(isDrawing){
        //draws line to the mouse coordinates
        context.lineTo(event.clientX - canvas.offsetLeft + halfCanvas, event.clientY - canvas.offsetTop + halfCanvas);

        // context.lineTo(event.offsetX, event.offsetY);
        context.strokeStyle = drawColour;
        context.lineWidth = drawSize;

        //default looks rougher so may be better for cave look?
        //context.lineCap = "round";
        // console.log("x clinetx - conatiner offset left: " + (event.clientX -  container.offsetLeft));
        // console.log("clinety - conatiner offsetTop: " +  (event.clientY - container.offsetTop)) ;

        // console.log("conatiner offset left: " + ( canvas.offsetLeft));
        // console.log("conatiner offsetTop: " +  (canvas.offsetTop)) ;

        //   console.log("x using client: " + (event.clientX ));
        //  console.log("using clint y: " +  (event.clientY )) ;


         console.log("Real deal x " + (event.clientX - canvas.offsetLeft + halfCanvas));
         console.log("Real deal y " +  (event.clientY -canvas.offsetTop + halfCanvas));


        console.log("x: " + event.offsetX);
        console.log("y: " + event.offsetY);
        context.stroke();
    }
    event.preventDefault();

}

function stop (event){
    if(isDrawing){
        context.stroke();
        context.closePath();
        isDrawing = false; 
    }
    event.preventDefault();
}

// https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
function startTouch(event){
    isDrawing = true;
    // context.beginPath();
    // context.moveTo(event.clientX - canvas.offsetLeft + halfCanvas, event.clientY - canvas.offsetTop + halfCanvas);
    context.fillStyle = "#red";
    context.fillRect(0,0, canvas.width, canvas.height);

    const touches = event.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        log(`touchstart: ${i}.`);
        ongoingTouches.push(copyTouch(touches[i]));
        const color = colorForTouch(touches[i]);
        log(`color of touch with id ${touches[i].identifier} = ${color}`);
        context.beginPath();
        context.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false); // a circle at the start
        context.fillStyle = color;
        context.fill();
      }

      event.preventDefault();


}

function drawTouch(event){

    const touches = event.changedTouches;

    // if(isDrawing){
    //     context.lineTo(event.clientX - canvas.offsetLeft + halfCanvas, event.clientY - canvas.offsetTop + halfCanvas);
    //     context.strokeStyle = drawColour;
    //     context.lineWidth = drawSize;
    //     context.stroke();

   
    // }

    for (let i = 0; i < touches.length; i++) {
        const color = colorForTouch(touches[i]);
        const idx = ongoingTouchIndexById(touches[i].identifier);
    
        if (idx >= 0) {
          log(`continuing touch ${idx}`);
          context.beginPath();
          log(
            `ctx.moveTo( ${ongoingTouches[idx].pageX}, ${ongoingTouches[idx].pageY} );`,
          );
          context.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
          log(`ctx.lineTo( ${touches[i].pageX}, ${touches[i].pageY} );`);
          context.lineTo(touches[i].pageX, touches[i].pageY);
          context.lineWidth = 4;
          context.strokeStyle = color;
          context.stroke();
    
          ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
        } else {
          log("can't figure out which touch to continue");
        }
      }
    event.preventDefault();

}

function stopTouch (event){
    // if(isDrawing){
    //     context.stroke();
    //     context.closePath();
    //     isDrawing = false; 
    // }
    

    event.preventDefault();

    log("touchend");
    const touches = event.changedTouches;

    for (let i = 0; i < touches.length; i++) {
        const color = colorForTouch(touches[i]);
        let idx = ongoingTouchIndexById(touches[i].identifier);
    
        if (idx >= 0) {
          context.lineWidth = 4;
          context.fillStyle = color;
          context.beginPath();
          context.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
          context.lineTo(touches[i].pageX, touches[i].pageY);
          context.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8); // and a square at the end
          ongoingTouches.splice(idx, 1); // remove it; we're done
        } else {
          log("can't figure out which touch to end");
        }
      }


}

function colorForTouch(touch) {
    let r = touch.identifier % 16;
    let g = Math.floor(touch.identifier / 3) % 16;
    let b = Math.floor(touch.identifier / 7) % 16;
    r = r.toString(16); // make it a hex digit
    g = g.toString(16); // make it a hex digit
    b = b.toString(16); // make it a hex digit
    const color = `#${r}${g}${b}`;
    return color;
  }

  function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY };
  }

  function ongoingTouchIndexById(idToFind) {
    for (let i = 0; i < ongoingTouches.length; i++) {
      const id = ongoingTouches[i].identifier;
  
      if (id === idToFind) {
        return i;
      }
    }
    return -1; // not found
  }

  function log(msg) {
    const container = document.getElementById("log");
    container.textContent = `${msg} \n${container.textContent}`;
  }