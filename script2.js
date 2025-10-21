let faceapi;
let detections = [];

let video;
let canvas;
let screenWidth, screenHeight;
let isMobile = false;

function setup() {
    screenWidth = windowWidth;
    screenHeight = windowHeight;
    
    // Check if mobile screen
    isMobile = windowWidth <= 600;
    
    if (isMobile) {
        // For mobile: swap width/height for 90-degree rotation
        canvas = createCanvas(120*7, 160*8); // Swapped dimensions
        canvas.id("canvas");
        
        video = createCapture(VIDEO);
        video.id("video");
        video.size(120*5, 160*6); // Swapped dimensions
        
        // Apply rotation transforms
        canvas.style('transform', 'rotate(90deg)');
        video.style('transform', 'rotate(90deg)');
        
    } else {
        // Original desktop setup
        canvas = createCanvas(160*8, 120*7);
        canvas.id("canvas");
        video = createCapture(VIDEO);
        video.id("video");
        video.size(160*8, 120*7);
    }
    
    // Position elements
    canvas.position((screenWidth - width)/2, (screenHeight - height)/2);
    video.position((screenWidth - width)/2, (screenHeight - height)/2);

    // Create video copies with mobile rotation
    createVideoCopies();
    
    const faceOptions = {
        withLandmarks: true,
        withExpressions: true,
        withDescriptors: true,
        minConfidence: 0.5
    };

    // Initialize the model
    faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function createVideoCopies() {
    // Video Copy 1
    videoCopy1 = createCapture(VIDEO);
    videoCopy1.id("video-copy-1");
    if (isMobile) {
        videoCopy1.size(120*2.5, 160*3.5); // Swapped dimensions
        videoCopy1.style('transform', 'rotate(90deg)');
    } else {
        videoCopy1.size(160*3.5, 120*2.5);
    }
    videoCopy1.position(400, 770);
    
    // Video Copy 2
    videoCopy2 = createCapture(VIDEO);
    videoCopy2.id("video-copy-2"); 
    if (isMobile) {
        videoCopy2.size(120*3, 160*2); // Swapped dimensions
        videoCopy2.style('transform', 'rotate(90deg)');
    } else {
        videoCopy2.size(160*2, 120*3);
    }
    videoCopy2.position(50, 600);

    // Video Copy 3
    videoCopy3 = createCapture(VIDEO);
    videoCopy3.id("video-copy-3"); 
    if (isMobile) {
        videoCopy3.size(120*3, 160*4); // Swapped dimensions
        videoCopy3.style('transform', 'rotate(90deg)');
    } else {
        videoCopy3.size(160*4, 120*3);
    }
    videoCopy3.position(1190, 250);

    // Video Copy 4
    videoCopy4 = createCapture(VIDEO);
    videoCopy4.id("video-copy-4"); 
    if (isMobile) {
        videoCopy4.size(120*4, 160*5); // Swapped dimensions
        videoCopy4.style('transform', 'rotate(90deg)');
    } else {
        videoCopy4.size(160*5, 120*4);
    }
    videoCopy4.position(-200, -100);

    // Video Copy 5
    videoCopy5 = createCapture(VIDEO);
    videoCopy5.id("video-copy-5"); 
    if (isMobile) {
        videoCopy5.size(120*2.5, 160*3.5); // Swapped dimensions
        videoCopy5.style('transform', 'rotate(90deg)');
    } else {
        videoCopy5.size(160*3.5, 120*2.5);
    }
    videoCopy5.position(1050, -30);
}

function windowResized() {
    screenWidth = windowWidth;
    screenHeight = windowHeight;
    isMobile = windowWidth <= 600;
    
    // Reposition elements on resize
    canvas.position((screenWidth - width)/2, (screenHeight - height)/2);
    video.position((screenWidth - width)/2, (screenHeight - height)/2);
}

function faceReady() {
    faceapi.detect(gotFaces);
}

// Get faces
function gotFaces(error, result) {
    if (error) {
        console.log(error);
        return;
    }

    detections = result;
    clear();
    drawBoxs(detections);
    drawLandmarks(detections);
    drawExpressions(detections, 20, 250, 14);
    faceapi.detect(gotFaces);
}

function drawBoxs(detections){
    if (detections.length > 0) {
        for (f = 0; f < detections.length; f++){
            let {_x, _y, _width, _height} = detections[f].alignedRect._box;
            // You might want to adjust drawing coordinates for mobile
            if (isMobile) {
                // Adjust coordinates for rotated display if needed
            }
        }
    }
}

function drawLandmarks(detections){
    if (detections.length > 0) {
        for (f = 0; f < detections.length; f++){
            let points = detections[f].landmarks.positions;
            for (let i = 0; i < points.length; i++) {
                // Landmark drawing logic here
            }
        }
    }
}

function drawExpressions(detections, x, y, textYSpace){
    if (detections.length > 0) {
        let {neutral, sad} = detections[0].expressions;
        textFont('Helvetica Neue');
        textSize(14);
        noStroke();
        fill(255, 255, 225);

        text("neutral:       " + nf(neutral*100, 2, 2) + "%", x, y);
        text("sad:            " + nf(sad*100, 2, 2) + "%", x, y + textYSpace);
    } else {
        text("neutral: ", x, y);
        text("sad: ", x, y + textYSpace * 3);
    }
}