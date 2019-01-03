/**
 * Javascript for calculating and animating the spirograph.
 *
 * @link https://github.com/Buroni/spirograph
 * @author Jake Browning
 */

const width = 800, height = 800;
const params = getSearchParameters();
const speedIncrement = 0.002;
const radians = [0,0,0,0];

let handleLength = (params.handleRange) ? params.handleRange : document.getElementById('handleRange').value;
let circleChanges = true;

const brushCanvas = document.getElementById('brushCanvas');
const brushContext = brushCanvas.getContext('2d');
const outerCircleCanvas = document.getElementById('outerCircleCanvas');
const outerCircleContext = outerCircleCanvas.getContext('2d');
const innerCircleCanvas = document.getElementById('innerCircleCanvas');
const innerCircleContext = innerCircleCanvas.getContext('2d');

const pointSpeed = (params.speedRange) ? params.speedRange/1000 : document.getElementById('speedRange').value/1000;

const outerCircle = {
    x: width / 2,
    y: height / 2,
    r: 300,
    colour: "gray",
    fill: false
};

const innerCircle = {
    x: null,
    y: null,
    r: 150,
    colour: "gray",
    fill: false,
    speed: pointSpeed - speedIncrement
};

const currentPoint = {
    x: null,
    y: null,
    r: (params.widthRange) ? params.widthRange : 2,
    colour: (params.colour) ? "#"+params.colour : "#8ED6FF",
    fill: true,
    speed: pointSpeed
};

window.requestAnimFrame = (callback => {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function drawCircle(point, context) {
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
        drawCircle(point, context, true);
    }
}

function drawStroke(i, point, canvas, context, outer, refresh, reverse, background) {
    r = radians[i];
    let oldX = point.x, oldY = point.y;
    point.x = outer.x + outer.r*Math.cos(r);
    point.y = outer.y + outer.r*Math.sin(r);

    let increment = 2*Math.PI*point.speed;
    if (reverse) increment = -1*increment;
    radians[i] = (r+increment == 2*Math.PI) ? 0 : r + increment;

    if (refresh) context.clearRect(0, 0, canvas.width, canvas.height);

    if ((!background || document.getElementById('showBackground').checked) && !circleChanges) {
        context.beginPath();
        context.moveTo(oldX,oldY);
        context.lineTo(
            point.x,
            point.y
        );
        context.strokeStyle = point.colour;
        context.lineWidth = point.r;
        context.stroke();
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

    // Draw brush stroke
    drawStroke(0, points[0], brushCanvas, brushContext, {...points[points.length-1], r: handleLength, speed: points[points.length-1].speed}, false, true, false);


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
        drawCircle(outerCircle, outerCircleContext);
    }
}

function clearBrush() {
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
}

function colourChange() {
    points[0].colour = "#" + document.getElementById('colour').value;
    buildShareUrl();
}

let points = [currentPoint, outerCircle, {...innerCircle}, {...innerCircle, r: innerCircle.r/2, speed: pointSpeed - speedIncrement}];
drawCircle(outerCircle, outerCircleContext);

animate(points);
setTimeout(() => circleChanges = false, 100);
