const canvas = document.getElementById("drawCanvas");
const context = canvas.getContext("2d");
const container = document.getElementById("canvasDiv")

let halfCanvas = canvas.width/2;



context.fillStyle = "#964B00";
context.fillRect(0,0, canvas.width, canvas.height);



let drawColour = "black";
let drawSize = "3";

let isDrawing = false;

//event listeners for when mouse or touch input occurs
canvas.addEventListener("touchstart", startTouch, false);
canvas.addEventListener("touchmove", drawTouch, false);
canvas.addEventListener("touchend", stopTouch, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);




function start(event){
    isDrawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft + halfCanvas, event.clientY - canvas.offsetTop + halfCanvas);
    // context.moveTo(event.offsetX, event.offsetY);

  let x = event.clientX - canvas.offsetLeft + halfCanvas;
  let y = event.clientY - canvas.offsetTop + halfCanvas;
  let text = "Click X coords: " + x + ", Click Y coords: " + y;
  document.getElementById("clickCoords").innerHTML = text;

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
        let x = event.clientX - canvas.offsetLeft + halfCanvas;
  let y = event.clientY - canvas.offsetTop + halfCanvas;
  let text = "click X coords: " + x + ", Click Y coords: " + y;
  document.getElementById("clickCoords").innerHTML = text;
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
// on touchstart event
function startTouch(event){
    isDrawing = true;
    context.beginPath();
    context.moveTo( event.touches[0].clientX - canvas.offsetLeft + halfCanvas, event.touches[0].clientY - canvas.offsetTop + halfCanvas);
    // context.fillStyle = "red";
    // context.fillRect(50,50, 50, 50);

    let x = event.touches[0].clientX;
    let y = event.touches[0].clientY;
    let text = "Touch X coords: " + x + ", Touch Y coords: " + y;
    document.getElementById("touchCoords").innerHTML = text;

    event.preventDefault();

}
// on touchmove event
function drawTouch(event){

    if(isDrawing){
        context.lineTo(event.touches[0].clientX - canvas.offsetLeft + halfCanvas, event.touches[0].clientY - canvas.offsetTop + halfCanvas);
        context.strokeStyle = drawColour;
        context.lineWidth = drawSize;
        context.stroke();
    }
    // context.fillStyle = "blue";
    // context.fillRect(50,50, 50, 50);
    let x = event.touches[0].clientX - canvas.offsetLeft + halfCanvas;
    let y = event.touches[0].clientY - canvas.offsetTop + halfCanvas;
    let text = "Touch X coords: " + x + ", Touch Y coords: " + y;
    document.getElementById("touchCoords").innerHTML = text;

    event.preventDefault();
}

// on touchend event
function stopTouch (event){
    if(isDrawing){
        context.stroke();
        context.closePath();
        isDrawing = false; 
    }
    // context.fillStyle = "green";
    // context.fillRect(50,50, 50, 50);
    
    event.preventDefault();
}

