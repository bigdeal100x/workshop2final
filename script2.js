let faceapi;
let detections = [];

let video;
let canvas;
let screenWidth, screenHeight;
let tracker = null;
let positions = null;

function setup() {
    screenWidth = windowWidth;
    screenHeight = windowHeight;  

    canvas = createCanvas(160*8, 120*7);
    canvas.id("canvas");
    canvas.position((screenWidth - width)/2, (screenHeight - height)/2);

    video = createCapture(VIDEO);// Create video
    video.id("video");
    video.size(160*8, 120*7);
    video.position((screenWidth - width)/2, (screenHeight - height)/2);

    // Create two additional video copies
    videoCopy1 = createCapture(VIDEO);
    videoCopy1.id("video-copy-1");
    videoCopy1.size(160*3.5, 120*2.5); // Smaller size
    videoCopy1.position(400, 770);
    
    videoCopy2 = createCapture(VIDEO);
    videoCopy2.id("video-copy-2"); 
    videoCopy2.size(160*2, 120*3);
    videoCopy2.position(50, 600);
    videoCopy2.hide(); // Hide the original video element

    videoCopy3 = createCapture(VIDEO);
    videoCopy3.id("video-copy-3"); 
    videoCopy3.size(160*4, 120*3);
    videoCopy3.position(1190, 250);

    videoCopy4 = createCapture(VIDEO);
    videoCopy4.id("video-copy-4"); 
    videoCopy4.size(160*5, 120*4);
    videoCopy4.position(-200, -100);

    videoCopy5 = createCapture(VIDEO);
    videoCopy5.id("video-copy-5"); 
    videoCopy5.size(160*3.5, 120*2.5);
    videoCopy5.position(1050, -30);

    const faceOptions = {
        withLandmarks: true,
        withExpressions: true,
        withDescriptors: true,
        minConfidence: 0.5
    };

    // Initialize the model
    faceapi = ml5.faceApi(video, faceOptions, faceReady);

    // Initialize clmtrackr for videoCopy2 eye tracking
    tracker = new clm.tracker();
    tracker.init();
    tracker.start(videoCopy2.elt);
}

function faceReady() {
    faceapi.detect(gotFaces);// Start detecting faces: 顔認識開始
}

// Get faces
function gotFaces(error, result) {
    if (error) {
        console.log(error);
        return;
    }

    detections = result;
    clear();//Draw transparent background
    drawBoxs(detections);//Draw detection box:
    drawLandmarks(detections);//// Draw all the face points
    drawExpressions(detections, 20, 250, 14);//Draw face expression

    // Draw videoCopy2 with eye zoom effect
    drawVideoCopy2WithZoom();

    faceapi.detect(gotFaces);// Call the function again here
}

function drawVideoCopy2WithZoom() {
    positions = tracker.getCurrentPosition();

    // Always draw the video at the fixed position and size first
    push();
    // Draw at videoCopy2's original position and size
    image(videoCopy2, 50, 600, 160*2, 120*3);
    pop();

    if (positions && positions.length > 0) {
        // Eye points from clmtrackr
        const eye1 = {
            center: getPoint(27),
            top: getPoint(24),
            bottom: getPoint(26),
        };
        const eye2 = {
            center: getPoint(32),
            top: getPoint(29),
            bottom: getPoint(31),
        };
        
        // Calculate the bounding box around both eyes for zooming
        const eyeBounds = calculateEyeBounds(eye1, eye2);
        
        // Create a graphics buffer for the zoomed content
        let zoomBuffer = createGraphics(160*2, 120*3);
        
        // Apply zoom transformation to the buffer
        zoomBuffer.push();
        zoomBuffer.translate(160*2, 0);
        zoomBuffer.scale(-1.0, 1.0); // Mirror effect
        
        // Calculate scale for zoom
        const scaleX = (160*2) / eyeBounds.width;
        const scaleY = (120*3) / eyeBounds.height;
        const scaleFactor = min(scaleX, scaleY);
        
        // Apply zoom transformation
        zoomBuffer.translate((160*2)/2, (120*3)/2);
        zoomBuffer.scale(scaleFactor);
        zoomBuffer.translate(-eyeBounds.x - eyeBounds.width/2, -eyeBounds.y - eyeBounds.height/2);
        
        // Draw the zoomed video into the buffer
        zoomBuffer.image(videoCopy2, 0, 0, 160*2, 120*3);
        zoomBuffer.pop();
        
        // Draw the zoomed buffer at the fixed position
        image(zoomBuffer, 50, 600);
    }
}

function getPoint(index) {
    return createVector(positions[index][0], positions[index][1]);
}

function calculateEyeBounds(eye1, eye2) {
    // Find the min and max coordinates of both eyes
    let minX = min(eye1.center.x, eye2.center.x);
    let maxX = max(eye1.center.x, eye2.center.x);
    let minY = min(eye1.center.y, eye2.center.y);
    let maxY = max(eye1.center.y, eye2.center.y);
    
    // Add some padding around the eyes
    const padding = 30; // Adjust this for zoom level
    minX -= padding;
    maxX += padding;
    minY -= padding;
    maxY += padding;
    
    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };
}

function drawBoxs(detections){
    if (detections.length > 0) {
        for (f=0; f < detections.length; f++){
            let {_x, _y, _width, _height} = detections[f].alignedRect._box;
        }
    }
}

function drawLandmarks(detections){
    if (detections.length > 0) {
        for (f=0; f < detections.length; f++){
            let points = detections[f].landmarks.positions;
            for (let i = 0; i < points.length; i++) {
            }
        }
    }
}

function drawExpressions(detections, x, y, textYSpace){
    if(detections.length > 0){
        let {neutral, sad} = detections[0].expressions;
        textFont('Helvetica Neue');
        textSize(14);
        noStroke();
        fill(255, 255, 225);

        text("neutral:       " + nf(neutral*100, 2, 2)+"%", x, y);
        text("sad:            "+ nf(sad*100, 2, 2)+"%", x, y+textYSpace);
    }else{
        text("neutral: ", x, y);
        text("sad: ", x, y + textYSpace*3);
    }
}