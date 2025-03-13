const canvas = document.getElementById("drawCanvas");
const context = canvas.getContext("2d");

context.fillStyle = "#964B00";
context.fillRect(0,0, canvas.width, canvas.height);

let drawColour = "black";
let drawSize = "3";

let isDrawing = false;

//event listeners for when mouse or touch input occurs
canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);




function start(event){
    isDrawing = true;
    context.beginPath();
    //context.moveTo(event.clientX - canvas.offsetX, event.clientY - canvas.offsetY);
    context.moveTo(event.offsetX, event.offsetY);

    event.preventDefault();
}

function draw(event){
    if(isDrawing){
        //draws line to the mouse coordinates
        //context.lineTo(event.clientX - canvas.offsetX, event.clientY - canvas.offsetY);

        context.lineTo(event.offsetX, event.offsetY);
        context.strokeStyle = drawColour;
        context.lineWidth = drawSize;

        //default looks rougher so may be better for cave look?
        //context.lineCap = "round";
        // console.log("x: " + event.clientX);
        // console.log("y: " + event.clientY);

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