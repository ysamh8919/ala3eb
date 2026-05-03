// ==================== Lucky Wheel 2.5D ====================
const LuckyWheelGame = {
    prizes: ['1x', '2x', '0', '3x', '1x', '5x', '0', '2x', '1x', '10x', '0', '3x'],
    spinning: false,

    getHTML() {
        return `
            <div class="wheel-3d-container">
                <div class="wheel-3d-frame">
                    <div class="wheel-3d-pointer">▼</div>
                    <canvas id="wheel3dCanvas" width="280" height="280"></canvas>
                </div>
                <p class="wheel-3d-info" id="wheel3dInfo">🎡 جرب حظك! مضاعفات حتى 10x</p>
            </div>
            <style>
                .wheel-3d-container {
                    text-align: center;
                    padding: 20px;
                    perspective: 500px;
                }
                .wheel-3d-frame {
                    display: inline-block;
                    background: radial-gradient(ellipse, #2a1a0a, #000);
                    padding: 20px;
                    border-radius: 50%;
                    border: 6px solid #d4af37;
                    box-shadow: 
                        0 15px 40px rgba(0,0,0,0.6),
                        0 0 30px rgba(212,175,55,0.4),
                        inset 0 0 30px rgba(0,0,0,0.6);
                    transform: rotateX(10deg);
                    position: relative;
                }
                .wheel-3d-pointer {
                    font-size: 34px;
                    color: #d4af37;
                    position: relative;
                    z-index: 10;
                    text-shadow: 0 0 15px gold;
                    animation: pointerGlow 2s ease-in-out infinite;
                }
                @keyframes pointerGlow {
                    0%, 100% { text-shadow: 0 0 10px gold; }
                    50% { text-shadow: 0 0 25px gold, 0 0 50px gold; }
                }
                #wheel3dCanvas {
                    margin-top: -12px;
                    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.5));
                }
                .wheel-3d-info {
                    color: #d4af37;
                    font-weight: 700;
                    font-size: 16px;
                    margin-top: 18px;
                }
            </style>
        `;
    },

    drawWheel(rotation = 0) {
        const canvas = document.getElementById('wheel3dCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const size = 280;
        canvas.width = size; canvas.height = size;
        const cx = size / 2, cy = size / 2, r = 130;
        const sliceAngle = (2 * Math.PI) / this.prizes.length;

        ctx.clearRect(0, 0, size, size);
        
        // ظل ثلاثي الأبعاد للعجلة
        ctx.save();
        ctx.translate(cx + 4, cy + 4);
        ctx.beginPath();
        ctx.arc(0, 0, r + 4, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rotation);

        const colors = ['#c0392b', '#1a1a1a', '#c0392b', '#1a1a1a', '#c0392b', '#d4af37', '#c0392b', '#1a1a1a', '#c0392b', '#d4af37', '#1a1a1a', '#c0392b'];

        for (let i = 0; i < this.prizes.length; i++) {
            const startAngle = i * sliceAngle;
            const endAngle = (i + 1) * sliceAngle;

            // شريحة مع تأثير 3D
            const grad = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, r);
            grad.addColorStop(0, colors[i]);
            grad.addColorStop(1, '#000');

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, r, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = grad;
            ctx.fill();
            ctx.strokeStyle = '#d4af37';
            ctx.lineWidth = 2;
            ctx.stroke();

            // كتابة النص
            ctx.save();
            ctx.rotate(startAngle + sliceAngle / 2);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px "Cairo", sans-serif';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 4;
            ctx.fillText(this.prizes[i], r * 0.68, 6);
            ctx.restore();
        }

        // مركز العجلة (برايمي)
        const centerGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 30);
        centerGrad.addColorStop(0, '#fff');
        centerGrad.addColorStop(0.5, '#d4af37');
        centerGrad.addColorStop(1, '#8b6914');
        ctx.beginPath();
        ctx.arc(0, 0, 28, 0, 2 * Math.PI);
        ctx.fillStyle = centerGrad;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // مسمار في النص
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();

        ctx.restore();
    },

    play(bet, callback) {
        if (this.spinning) return;
        this.spinning = true;

        this.drawWheel(0);
        const targetIndex = Math.floor(Math.random() * this.prizes.length);
        const sliceAngle = (2 * Math.PI) / this.prizes.length;
        const targetAngle = (targetIndex * sliceAngle) + (sliceAngle / 2);
        const totalRotation = (Math.PI * 2 * 6) + (Math.PI * 2 - targetAngle);

        let currentRotation = 0;
        const duration = 3500;
        const startTime = Date.now();

        const spin = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            currentRotation = totalRotation * eased;
            this.drawWheel(currentRotation);

            if (progress < 1) {
                requestAnimationFrame(spin);
            } else {
                this.spinning = false;
                const prize = this.prizes[targetIndex];
                let multiplier = prize === '0' ? 0 : parseInt(prize.replace('x', ''));
                const win = bet * multiplier;
                const message = prize === '0' ? '😔 خسرت!' : `🎉 ربحت ${prize}!`;
                document.getElementById('wheel3dInfo').textContent = message;
                callback({ win, message });
            }
        };

        requestAnimationFrame(spin);
    }
};