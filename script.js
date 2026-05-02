document.addEventListener('DOMContentLoaded', () => {
    const cake = document.querySelector('.cake');
    const candleCountDisplay = document.getElementById('candleCount');
    let candleCount = 0;
    let microphoneStarted = false;

    // Función para añadir velas
    cake.addEventListener('click', () => {
        candleCount++;
        candleCountDisplay.textContent = candleCount;

        const candle = document.createElement('div');
        candle.className = 'candle';
        
        // Posición aleatoria sobre el pastel
        const x = Math.random() * 250 + 30; 
        const y = Math.random() * 20 + 5;
        
        candle.style.left = x + 'px';
        candle.style.top = y + 'px';
        candle.innerHTML = '<div class="flame"></div>';
        
        cake.appendChild(candle);

        if (!microphoneStarted) {
            startMicrophone();
            microphoneStarted = true;
        }
    });

    function startMicrophone() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(stream);
                const processor = audioContext.createScriptProcessor(2048, 1, 1);

                analyser.fftSize = 256;
                source.connect(analyser);
                analyser.connect(processor);
                processor.connect(audioContext.destination);

                processor.onaudioprocess = () => {
                    const array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    let values = 0;
                    for (let i = 0; i < array.length; i++) values += array[i];
                    const average = values / array.length;

                    // Si detecta soplido fuerte
                    if (average > 35) { 
                        document.querySelectorAll('.flame').forEach(f => f.style.display = 'none');
                        if (candleCount > 0) {
                            launchConfetti();
                            candleCount = 0; // Reinicia para la próxima
                        }
                    }
                };
            }).catch(err => console.log("Error con mic:", err));
    }

    function launchConfetti() {
        const colors = ['#87CEEB', '#00BFFF', '#ffffff', '#ffeb3b'];
        for (let i = 0; i < 70; i++) {
            const c = document.createElement('div');
            c.className = 'confetti';
            c.style.left = Math.random() * 100 + 'vw';
            c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            c.style.width = '10px';
            c.style.height = '10px';
            c.style.position = 'fixed';
            c.style.top = '-10px';
            c.style.zIndex = '1000';
            c.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear forwards`;
            document.body.appendChild(c);
            
            // Borrar el confeti después de que caiga
            setTimeout(() => c.remove(), 5000);
        }
    }
});
                  
