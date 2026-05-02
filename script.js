document.addEventListener('DOMContentLoaded', () => {
    const cake = document.querySelector('.cake');
    const display = document.getElementById('candleCount');
    let count = 0;
    let micStarted = false;

    cake.addEventListener('click', () => {
        count++;
        display.textContent = count;
        const c = document.createElement('div');
        c.className = 'candle';
        c.style.left = (Math.random() * 250 + 30) + 'px';
        c.style.top = (Math.random() * 20 + 5) + 'px';
        c.innerHTML = '<div class="flame"></div>';
        cake.appendChild(c);

        if (!micStarted) {
            startMic();
            micStarted = true;
        }
    });

    function startMic() {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const ctx = new AudioContext();
            const ana = ctx.createAnalyser();
            ctx.createMediaStreamSource(stream).connect(ana);
            const proc = ctx.createScriptProcessor(2048, 1, 1);
            ana.connect(proc);
            proc.connect(ctx.destination);
            proc.onaudioprocess = () => {
                const data = new Uint8Array(ana.frequencyBinCount);
                ana.getByteFrequencyData(data);
                if (data.reduce((a, b) => a + b) / data.length > 35) {
                    document.querySelectorAll('.flame').forEach(f => f.style.display = 'none');
                }
            };
        });
    }
});
            
