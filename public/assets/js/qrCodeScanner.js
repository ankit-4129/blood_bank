const qrcod = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-scan-value");
const btnScanQR = document.getElementById("btn-scan-qr");

const btnScanStop = document.getElementById("btn-scan-stop");

let scanning = false;

qrcod.callback = (res) => {
    console.log(res);
  if (res) {
    qrResult.value = res;
    scanning = false;

    video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    console.log("res is true in callback");
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
    btnScanStop.hidden = true;
  }
};

btnScanStop.onclick = () => {
    res = "";
    qrResult.value = res;
    scanning = false;

    video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
    console.log("stop clicked");
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
    btnScanStop.hidden = true;
};

btnScanQR.onclick = () => {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      btnScanQR.hidden = true;
      btnScanStop.hidden = false;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    console.log("going in side decode");
    qrcod.decode();
    console.log("out side decode");
  } catch (e) {
    if(scanning == false){
        //do nothing
        return;
    }
    setTimeout(scan, 300);
  }
}
