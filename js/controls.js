/**
 * Javascript for handling user controls.
 *
 * @link https://github.com/Buroni/spirograph
 * @author Jake Browning
 */

function addCircle() {
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    radians.push(0);
    smallestCircle = points[points.length-1];
    points.push({...smallestCircle, r: smallestCircle.r/2, speed: smallestCircle.speed+speedIncrement});
    points[0] = {...points[0], speed: points[0].speed+speedIncrement};

    circleChanges = true;
    setTimeout(() => circleChanges = false, 50);

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

    circleChanges = true;
    setTimeout(() => circleChanges = false, 50);
}

function checkButtonDisabled() {
    document.getElementById("remove-circle").disabled = (points.length <= 3);
}

let handleSlider = document.getElementById("handleRange");
handleSlider.oninput = function() {
    handleLength = this.value;
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
}

let widthSlider = document.getElementById("widthRange");
widthSlider.oninput = function() {
    points[0].r = this.value;
}

let speedSlider = document.getElementById("speedRange");
speedSlider.oninput = function() {
    points[points.length-1].speed = this.value/1000;
    points[0].speed = this.value/1000;
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
}

let circleSlider = document.getElementById("circleRange");
circleSlider.oninput = function() {
    points[points.length-1].r = this.value;
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
}