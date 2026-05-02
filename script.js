let audioContext;
let analyser;
let microphone;

async function startMic() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        detectBlow();
    } catch (err) {
        alert("Por favor, permite el acceso al micrófono para soplar las velas.");
    }
}

function detectBlow() {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);
    
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
    let average = sum / dataArray.length;

    if (average > 45) { // Sensibilidad del soplido
        const flames = document.querySelectorAll('.flame');
        if (flames.length > 0 && flames[0].style.display !== 'none') {
            flames.forEach(f => f.style.display = 'none');
            createConfetti();
        }
    }
    requestAnimationFrame(detectBlow);
}

function createConfetti() {
    for (let i = 0; i < 75; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

// Activar al tocar la pantalla
document.addEventListener('click', () => {
    if (!audioContext) startMic();
}, { once: true });
            
