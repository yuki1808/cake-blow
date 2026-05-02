document.addEventListener('DOMContentLoaded', () => {
  const cake = document.querySelector('.cake');
  const candleCountDisplay = document.getElementById('candleCount');
  let candleCount = 0;
  let candlesHtml = '';
  let audioContext;
  let analyser;
  let microphone;
  let javascriptNode;
  const CONFETTI_COLORS = ['#87CEEB', '#00BFFF', '#ff4081', '#ffeb3b', '#ffffff'];

  // 1. Función para añadir velas celestes al tocar el pastel
  cake.addEventListener('click', (e) => {
    if (!microphone) {
      candleCount++;
      candleCountDisplay.textContent = candleCount;
      
      const cakeRect = cake.getBoundingClientRect();
      
      // Posicionamiento aleatorio sobre la crema blanca
      const x = Math.random() * (cakeRect.width - 40) + 20;
      const y = Math.random() * 30 + 10; 

      const candleId = `candle-${candleCount}`;
      candlesHtml += `<div class="candle" id="${candleId}" style="left: ${x}px; top: ${y}px;"><div class="flame"></div></div>`;
      cake.innerHTML = `<div class="plate"></div><div class="icing"></div><div class="drip drip1"></div><div class="drip drip2"></div><div class="drip drip3"></div>` + candlesHtml;
      
      if (candleCount === 1) {
        startMicrophone();
      }
    }
  });

  // 2. Lógica del micrófono para detectar el soplido
  function startMicrophone() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then(function(stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 1024;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = function() {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          let values = 0;

          for (let i = 0; i < array.length; i++) {
            values += array[i];
          }

          const average = values / array.length;

          // Si el soplido es fuerte (ajustable), se apagan las velas
          if (average > 45 && candleCount > 0) {
            blowOutCandles();
          }
        }
      })
      .catch(function(err) {
        console.error("Acceso al micrófono denegado:", err);
      });
  }

  // 3. Apagar velas y lanzar la fiesta de confeti
  function blowOutCandles() {
    const flames = document.querySelectorAll('.flame');
    flames.forEach(flame => flame.style.display = 'none');

    if (javascriptNode) {
      javascriptNode.onaudioprocess = null;
    }

    launchConfeti();
    
    setTimeout(() => {
        alert("¡Feliz Cumpleaños Isaac! ✨");
    }, 1000);
  }

  // 4. Efecto de confeti cayendo
  function launchConfeti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);

    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = confetti.style.width;
      container.appendChild(confetti);
    }

    setTimeout(() => container.remove(), 5000);
  }
});
        
