let faceapi;
let detections = [];

let video;
let canvas;

function setup() {
  canvas = createCanvas(480, 360);
  canvas.id("canvas");
  
  // Use CSS to center the canvas
  canvas.style('display', 'block');
  canvas.style('margin', 'auto');
  canvas.style('position', 'absolute');
  canvas.style('top', '50%');
  canvas.style('left', '50%');
  canvas.style('transform', 'translate(-50%, -50%)');

  video = createCapture(VIDEO);
  video.id("video");
  video.size(width, height);
  
  // Position video exactly over the canvas
  let canvasPosition = canvas.elt.getBoundingClientRect();
  video.position(canvasPosition.left, canvasPosition.top);




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

  detections = result;　//Now all the data in this detections: 
  // console.log(detections);

  clear();//Draw transparent background
  drawBoxs(detections);//Draw detection box:
  drawLandmarks(detections);//// Draw all the face points
  drawExpressions(detections, 20, 250, 14);//Draw face expression

  faceapi.detect(gotFaces);// Call the function again here
}

function drawBoxs(detections){
  if (detections.length > 0) {//If at least 1 face is detected: 
    for (f=0; f < detections.length; f++){
      let {_x, _y, _width, _height} = detections[f].alignedRect._box;
    }
  }
}

function drawLandmarks(detections){
  if (detections.length > 0) {//If at least 1 face is detected
    for (f=0; f < detections.length; f++){
      let points = detections[f].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
      }
    }
  }
}

function drawExpressions(detections, x, y, textYSpace){
  if(detections.length > 0){//If at least 1 face is detected
    let {neutral, sad} = detections[0].expressions;
  }else{//If no faces is detected
  }
}