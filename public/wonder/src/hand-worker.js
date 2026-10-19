// Keep MediaPipe inference off the UI/render thread and off the model's GPU.
let tracker, mirrorHandResults;
self.onmessage=async({data})=>{
 try{
  if(data.type==='init'){
   ({mirrorHandResults}=await import('./logic/hand-navigation.js'));
   self.postMessage({type:'progress',stage:'Đang tải thư viện'});
   const {FilesetResolver,HandLandmarker}=await import('../node_modules/@mediapipe/tasks-vision/vision_bundle.mjs');
   const files=await FilesetResolver.forVisionTasks(new URL('../node_modules/@mediapipe/tasks-vision/wasm',self.location.href).href);
   self.postMessage({type:'progress',stage:'Đang khởi tạo mô hình'});
   tracker=await HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:new URL('../models/hand_landmarker.task',self.location.href).href,delegate:'CPU'},runningMode:'VIDEO',numHands:2,minHandDetectionConfidence:.5,minHandPresenceConfidence:.5,minTrackingConfidence:.5});
   self.postMessage({type:'ready'});return;
  }
  const started=performance.now(),result=tracker.detectForVideo(data.frame,data.timestamp);
  self.postMessage({type:'result',hands:mirrorHandResults(result),detectMs:performance.now()-started,frame:data.frame},[data.frame]);
 }catch(error){data.frame?.close();self.postMessage({type:'error',error:String(error)});}
};
