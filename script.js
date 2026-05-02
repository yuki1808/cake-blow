document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);
analyser.getByteFrequencyData(dataArray);

let max = 0;
for (let i = 0; i < bufferLength; i++) {
  if (dataArray[i] > max) {
    max = dataArray[i];
  }
}

// sensibilidad (puedes ajustar)
return max > 45;
  }

  function blowOutCandles() {
    let blownOut = 0;

    if (isBlowing()) {
      candles.forEach((candle) => {
        if (!candle.classList.contains("out") && Math.random() > 0.5) {
          candle.classList.add("out");

// 🔥 eliminar la llama visualmente
const flame = candle.querySelector(".flame");
if (flame) {
  flame.remove();
}

blownOut++;
        }
      });
    }

    if (blownOut > 0) {
  updateCandleCount();
  lanzarConfeti();
      }
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});
function lanzarConfeti() {
  for (let i = 0; i < 40; i++) {
    const confeti = document.createElement("div");
    confeti.className = "confeti";
    confeti.style.left = Math.random() * window.innerWidth + "px";
    confeti.style.backgroundColor = `hsl(${Math.random()*360}, 100%, 60%)`;
    confeti.style.animationDuration = (Math.random() * 2 + 2) + "s";
    document.body.appendChild(confeti);

    setTimeout(() => confeti.remove(), 4000);
  }
  }
