let faceapi;
let detections = [];

let video;
let canvas;
let screenWidth, screenHeight;

// Variables for tracking neutral expression over time
let neutralStartTime = null;
let neutralThreshold = 10; // seconds
let smileFadeInProgress = false;
let smileOpacity = 0;

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

    // Set initial opacity for wrong and smile elements
    document.getElementById('wrong').style.opacity = '0';
    document.getElementById('smile').style.opacity = '0';

    const faceOptions = {
        withLandmarks: true,
        withExpressions: true,
        withDescriptors: true,
        minConfidence: 0.5
    };

    //Initialize the model
    faceapi = ml5.faceApi(video, faceOptions, faceReady);
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

    // Handle wrong element opacity based on sad expression
    handleWrongOpacity();
    
    // Handle smile element opacity based on neutral expression
    handleSmileOpacity();

    faceapi.detect(gotFaces);// Call the function again here
}

function handleWrongOpacity() {
    const wrongElement = document.getElementById('wrong');
    
    if (detections.length > 0) {
        let { sad } = detections[0].expressions;
        
        if (sad > 0.75) { // 75% threshold
            wrongElement.style.opacity = '1';
        } else {
            wrongElement.style.opacity = '0';
        }
    } else {
        wrongElement.style.opacity = '0';
    }
}

function handleSmileOpacity() {
    const smileElement = document.getElementById('smile');
    
    if (detections.length > 0) {
        let { neutral } = detections[0].expressions;
        
        if (neutral > 0.75) { // 75% threshold
            // Start or continue tracking time
            if (neutralStartTime === null) {
                neutralStartTime = millis();
            }
            
            const currentTime = millis();
            const elapsedTime = (currentTime - neutralStartTime) / 1000; // Convert to seconds
            
            if (elapsedTime >= neutralThreshold) {
                // Start fade in if not already in progress
                if (!smileFadeInProgress) {
                    smileFadeInProgress = true;
                    startSmileFadeIn();
                }
            }
        } else {
            // Reset timer if neutral expression drops below threshold
            neutralStartTime = null;
            smileFadeInProgress = false;
            smileOpacity = 0;
            smileElement.style.opacity = '0';
        }
    } else {
        // Reset if no face detected
        neutralStartTime = null;
        smileFadeInProgress = false;
        smileOpacity = 0;
        smileElement.style.opacity = '0';
    }
}

function startSmileFadeIn() {
    const smileElement = document.getElementById('smile');
    
    // Create a smooth fade in over 2 seconds
    const fadeInterval = setInterval(() => {
        smileOpacity += 0.05; // Increment opacity
        smileElement.style.opacity = smileOpacity.toString();
        
        if (smileOpacity >= 1) {
            clearInterval(fadeInterval);
            smileOpacity = 1;
        }
    }, 100); // Update every 100ms for smooth fade
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
        // textFont('Helvetica Neue');
        // textSize(14);
        // noStroke();
        // fill(255, 255, 225);

        // text("neutral:       " + nf(neutral*100, 2, 2)+"%", x, y);
        // text("sad:            "+ nf(sad*100, 2, 2)+"%", x, y+textYSpace);
        
        // Display timer for neutral expression
        if (neutral > 0.75 && neutralStartTime !== null) {
            const currentTime = millis();
            const elapsedTime = (currentTime - neutralStartTime) / 1000;
            // text("neutral time: " + nf(elapsedTime, 2, 1) + "s", x, y + textYSpace * 2);
        }
    } else {
        // text("neutral: ", x, y);
        // text("sad: ", x, y + textYSpace*3);
    }
}