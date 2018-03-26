/**
 * Javascript for handling user controls.
 *
 * @link https://github.com/Buroni/spirograph
 * @author Jake Browning
 */

const ranges = ["widthRange", "handleRange", "speedRange", "circleRange"];
const numCircles = (params.circles) ? params.circles : 3;
let sliders = [];

function buildShareUrl() {
    const paramsArray = ranges.map(id => `${id}=${sliders[id].value}`);
    const shareUrl = 'https://buroni.github.io/spirograph?'
        + paramsArray.join("&")
        + "&colour="+document.getElementById('colour').value
        + "&circles="+(points.length-1).toString();
    document.getElementById('share-url').value = shareUrl;
}


// https://stackoverflow.com/a/30810322
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

// https://stackoverflow.com/a/30810322
function copyToClipboard() {
    const text = document.getElementById('share-url').value;
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
        console.error('Async: Could not copy text: ', err);
    });
}

function setSliderAttr(sliderId, attr, val) {
    sliders[sliderId].setAttribute(attr, val);
    if (sliders[sliderId].value < val) {
        sliders[sliderId].setAttribute('value', val);
    }
    sliders[sliderId].oninput();
    sliders[sliderId].parentElement.appendChild(sliders[sliderId]);
}



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
    setSliderAttr("speedRange", "min", points.length+points.length-1);
}

function removeCircle() {
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    radians.pop();
    points.pop();
    points[0] = {...points[0], speed: points[0].speed-speedIncrement};
    checkButtonDisabled();
    document.getElementById("circleRange").setAttribute('max', points[points.length-1].r);
    setSliderAttr("speedRange", "min", points.length+points.length-3);

    circleChanges = true;
    setTimeout(() => circleChanges = false, 50);
}

function checkButtonDisabled() {
    document.getElementById("remove-circle").disabled = (points.length <= 3);
}

function setInput(id) {
    document.getElementById(id+'Input').setAttribute('value', document.getElementById(id).value);
}

function setInputs(ids) {
    ids.forEach(id => setInput(id));
}

function setSliderFromInput(id) {
    sliders[id].setAttribute('value', document.getElementById(id+"Input").value);
    sliders[id].oninput();
    sliders[id].parentElement.appendChild(sliders[id]);
}

function addCirclesFromParams() {
    for (let i = 0; i < numCircles-3; i++) {
        addCircle();
    }
}

function setInnerCircleRadius() {
    if (params.circleRange) points[points.length-1].r = params.circleRange;
}

ranges.forEach(id => {
    sliders[id] = document.getElementById(id);
    if (params[id]) sliders[id].value = params[id];
    document.getElementById(id+"Input").onblur = function() {
        setSliderFromInput(id);
    }
});

sliders["handleRange"].oninput = function() {
    handleLength = this.value;
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    setInput("handleRange");
    buildShareUrl();
}

sliders["widthRange"].oninput = function() {
    points[0].r = this.value;
    setInput("widthRange");
    buildShareUrl();
}

sliders["speedRange"].oninput = function() {
    points[points.length-1].speed = this.value/1000;
    points[0].speed = this.value/1000;
    points[points.length-1].speed = this.value/1000 - speedIncrement;
    points.forEach((point,i) => {
        if (!point.speed || i < 2 || i === points.length - 1) return;
        point.speed = this.value/1000 - speedIncrement*(points.length - i);
    });
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    setInput("speedRange");
    buildShareUrl();
}

sliders["circleRange"].oninput = function() {
    points[points.length-1].r = this.value;
    brushContext.clearRect(0, 0, brushCanvas.width, brushCanvas.height);
    setInput("circleRange");
    buildShareUrl();
}

document.getElementById('colour').value = (params.colour) ? params.colour : "8ED6FF";

addCirclesFromParams();

setInnerCircleRadius();

setInputs(ranges);

buildShareUrl();

