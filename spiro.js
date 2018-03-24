const width = 800, height = 800;
const speedIncrement = 0.002;
let handleLength = 60;
let radians = [0,0,0,0];
let sliderChanges = false;

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function drawPoint(point, context) {
    console.log(point.colour)
    context.beginPath();
    context.arc(point.x, point.y, point.r, 0, 2*Math.PI);
    if (point.fill) {
        context.fillStyle = point.colour;
        context.fill();
    }
    context.strokeStyle = point.colour;
    context.stroke();
}

function drawBrush(i, point, canvas, context, outer, refresh, reverse, background) {
    r = radians[i];
    point.x = outer.x + outer.r*Math.cos(r);
    point.y = outer.y + outer.r*Math.sin(r);

    let increment = 2*Math.PI*point.speed;
    if (reverse) increment = -1*increment;
    radians[i] = (r+increment == 2*Math.PI) ? 0 : r + increment;

    if (refresh) context.clearRect(0, 0, canvas.width, canvas.height);

    if (!background || document.getElementById('showBackground').checked) {
        drawPoint(point, context, true);
    }
}

function drawHandle(outerCircle, context) {
    context.beginPath();
    context.moveTo(outerCircle.x,outerCircle.y);
    context.lineTo(
        outerCircle.x + handleLength*Math.cos(radians[0]),
        outerCircle.y + handleLength*Math.sin(radians[0])
    );
    context.stroke();
}

function animate(points) {

    if (sliderChanges) {
        window.setTimeout(function() {
            sliderChanges = false;
        }, 500);
    }

    // Draw brush stroke
    drawBrush(0, points[0], brushCanvas, brushContext, {...points[points.length-1], r: handleLength, speed: points[points.length-1]}, false, true, false);

    innerCircleContext.clearRect(0, 0, innerCircleCanvas.width, innerCircleCanvas.height);
    for (i = 2; i < points.length; i++) {
        drawBrush(i, points[i], innerCircleCanvas, innerCircleContext, {...points[i-1], r: points[i-1].r - points[i].r}, false, false, true);
    }

    // Draw brush handle
    if (document.getElementById('showBackground').checked) {
        drawHandle(points[points.length - 1], innerCircleContext);
    }

    // request new frame
    requestAnimFrame(function() {
        animate(points);
    });

}

function clearBackground() {
    if (!document.getElementById('showBackground').checked) {
        innerCircleContext.clearRect(0, 0, innerCircleCanvas.width, innerCircleCanvas.height);
        outerCircleContext.clearRect(0, 0, outerCircleCanvas.width, outerCircleCanvas.height);
    } else {
        drawPoint(outerCircle, outerCircleContext);
    }
}

function clearBrush() {
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
}

function addCircle() {
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    radians.push(0);
    smallestCircle = points[points.length-1];
    points.push({...smallestCircle, r: smallestCircle.r/2, speed: smallestCircle.speed+speedIncrement});
    points[0] = {...points[0], speed: points[0].speed+speedIncrement};

    checkButtonDisabled();
    document.getElementById("circleRange").setAttribute('max', points[points.length-1].r);
}

function removeCircle() {
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    radians.pop();
    points.pop();
    points[0] = {...points[0], speed: points[0].speed-speedIncrement};
    checkButtonDisabled();
    document.getElementById("circleRange").setAttribute('max', points[points.length-1].r);
}

function checkButtonDisabled() {
    document.getElementById("remove-circle").disabled = (points.length <= 3);
}

function colourChange() {
    points[0].colour = "#" + document.getElementById('colour').value;
}

let brushCanvas = document.getElementById('brushCanvas');
let brushContext = brushCanvas.getContext('2d');
let outerCircleCanvas = document.getElementById('outerCircleCanvas');
let outerCircleContext = outerCircleCanvas.getContext('2d');
let innerCircleCanvas = document.getElementById('innerCircleCanvas');
let innerCircleContext = innerCircleCanvas.getContext('2d');

let handleSlider = document.getElementById("handleRange");
handleSlider.oninput = function() {
    handleLength = this.value;
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    sliderChanges = true;
}

let speedSlider = document.getElementById("speedRange");
speedSlider.oninput = function() {
    points[points.length-1].speed = this.value/1000;
    points[0].speed = this.value/1000;
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    sliderChanges = true;
}

let circleSlider = document.getElementById("circleRange");
circleSlider.oninput = function() {
    points[points.length-1].r = this.value;
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    sliderChanges = true;
}

let outerCircle = {
    x: width / 2,
    y: height / 2,
    r: 300,
    colour: "gray",
    fill: false
};

let innerCircle = {
    x: null,
    y: null,
    r: 150,
    colour: "gray",
    fill: false,
    speed: 0.003
};

let currentPoint = {
    x: null,
    y: null,
    r: 2,
    colour: "#8ED6FF",
    fill: true,
    speed: innerCircle.speed+speedIncrement
};

let points = [currentPoint, outerCircle, {...innerCircle}, {...innerCircle, r: innerCircle.r/2, speed: innerCircle.speed+speedIncrement}];

drawPoint(outerCircle, outerCircleContext);

animate(points);
