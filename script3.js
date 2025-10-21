let faceapi;
let detections = [];

let video;
let canvas;
let screenWidth, screenHeight;
let isMobile = false;

function setup() {
    screenWidth = windowWidth;
    screenHeight = windowHeight;  
    isMobile = windowWidth <= 600;

    if (isMobile) {
        // Mobile setup - rotated 90 degrees
        canvas = createCanvas(120*5, 160*4); // Adjusted dimensions for mobile
        canvas.id("canvas");
        
        video = createCapture(VIDEO);
        video.id("video");
        video.size(120*5, 160*4);
        
        // Center main video
        centerElement(video);
        centerElement(canvas);
        
        // Apply rotation
        canvas.style('transform', 'rotate(90deg)');
        video.style('transform', 'rotate(90deg)');
        
        // Create 4 corner video copies
        createCornerVideos();
        
    } else {
        // Desktop setup (original)
        canvas = createCanvas(160*8, 120*7);
        canvas.id("canvas");
        video = createCapture(VIDEO);
        video.id("video");
        video.size(160*8, 120*7);
        
        canvas.position((screenWidth - width)/2, (screenHeight - height)/2);
        video.position((screenWidth - width)/2, (screenHeight - height)/2);
        
        // Create corner videos for desktop too (smaller)
        createCornerVideos();
    }

    const faceOptions = {
        withLandmarks: true,
        withExpressions: true,
        withDescriptors: true,
        minConfidence: 0.5
    };

    faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function createCornerVideos() {
    // Remove any existing video copies first
    const existingCopies = ['video-copy-1', 'video-copy-2', 'video-copy-3', 'video-copy-4'];
    existingCopies.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });

    const cornerSize = isMobile ? 
        { width: 120*2.2, height: 160*1.8 } : // Smaller for mobile
        { width: 160*1.5, height: 120*1.5 };  // Small for desktop
    
    // Top Left
    videoCopy1 = createCapture(VIDEO);
    videoCopy1.id("video-copy-1");
    videoCopy1.size(cornerSize.width, cornerSize.height);
    videoCopy1.position(0, 0);
    
    // Top Right
    videoCopy2 = createCapture(VIDEO);
    videoCopy2.id("video-copy-2"); 
    videoCopy2.size(cornerSize.width, cornerSize.height);
    videoCopy2.position(screenWidth - cornerSize.width - 0, 0);

    // Bottom Left
    videoCopy3 = createCapture(VIDEO);
    videoCopy3.id("video-copy-3"); 
    videoCopy3.size(cornerSize.width, cornerSize.height);
    videoCopy3.position(0, screenHeight - cornerSize.height - 0);

    // Bottom Right
    videoCopy4 = createCapture(VIDEO);
    videoCopy4.id("video-copy-4"); 
    videoCopy4.size(cornerSize.width, cornerSize.height);
    videoCopy4.position(screenWidth - cornerSize.width - 0, screenHeight - cornerSize.height - 0);

    // Apply rotation only for mobile
    if (isMobile) {
        videoCopy1.style('transform', 'rotate(90deg)');
        videoCopy2.style('transform', 'rotate(90deg)');
        videoCopy3.style('transform', 'rotate(90deg)');
        videoCopy4.style('transform', 'rotate(90deg)');
    }
}

function centerElement(element) {
    const x = (screenWidth - element.width) / 2;
    const y = (screenHeight - element.height) / 2;
    element.position(x, y);
}

function windowResized() {
    screenWidth = windowWidth;
    screenHeight = windowHeight;
    isMobile = windowWidth <= 600;
    
    // Reposition elements on resize
    if (isMobile) {
        centerElement(video);
        centerElement(canvas);
        
        // Update corner video positions
        const cornerVideos = [
            document.getElementById('video-copy-1'),
            document.getElementById('video-copy-2'),
            document.getElementById('video-copy-3'),
            document.getElementById('video-copy-4')
        ];
        
        const cornerSize = { width: 120*1.2, height: 160*0.8 };
        
        if (cornerVideos[0]) {
            // Top Left
            cornerVideos[0].style.left = '20px';
            cornerVideos[0].style.top = '20px';
            // Top Right
            cornerVideos[1].style.left = (screenWidth - cornerSize.width - 20) + 'px';
            cornerVideos[1].style.top = '20px';
            // Bottom Left
            cornerVideos[2].style.left = '20px';
            cornerVideos[2].style.top = (screenHeight - cornerSize.height - 20) + 'px';
            // Bottom Right
            cornerVideos[3].style.left = (screenWidth - cornerSize.width - 20) + 'px';
            cornerVideos[3].style.top = (screenHeight - cornerSize.height - 20) + 'px';
        }
    }
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
        }
    }
}

function drawLandmarks(detections){
    if (detections.length > 0) {
        for (f = 0; f < detections.length; f++){
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

        text("neutral: " + nf(neutral*100, 2, 2) + "%", x, y);
        text("sad: " + nf(sad*100, 2, 2) + "%", x, y + textYSpace);
    } else {
        text("neutral: ", x, y);
        text("sad: ", x, y + textYSpace * 3);
    }
}