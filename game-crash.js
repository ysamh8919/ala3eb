// ==================== Crash Game 2.5D ====================
const CrashGame = {
    crashed: false,
    cashedOut: false,
    multiplier: 1,
    interval: null,

    getHTML() {
        return `
            <div class="crash-3d-container">
                <div class="crash-3d-space">
                    <div class="crash-3d-stars"></div>
                    <div class="crash-3d-rocket" id="crash3dRocket">🚀</div>
                    <div class="crash-3d-trail" id="crash3dTrail"></div>
                </div>
                <div class="crash-3d-hud">
                    <div class="crash-3d-multiplier" id="crash3dMultiplier">1.0x</div>
                    <button class="btn-cashout-3d" id="crash3dCashout" onclick="CrashGame.cashOut()">
                        💰 اسحب (<span id="crash3dMultVal">1.0</span>x)
                    </button>
                </div>
                <p class="crash-3d-status" id="crash3dStatus">🚀 الصاروخ بيجهز...</p>
            </div>
            <style>
                .crash-3d-container {
                    text-align: center;
                    padding: 10px;
                    perspective: 400px;
                }
                .crash-3d-space {
                    height: 220px;
                    background: radial-gradient(ellipse at center, #0a0a2a, #000);
                    border-radius: 20px;
                    position: relative;
                    overflow: hidden;
                    border: 2px solid #d4af37;
                    box-shadow: 
                        0 0 40px rgba(108,92,231,0.3),
                        inset 0 0 40px rgba(0,0,0,0.6);
                    transform: rotateX(5deg);
                    margin-bottom: 16px;
                }
                .crash-3d-stars {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        radial-gradient(1px 1px at 10% 20%, #fff, transparent),
                        radial-gradient(1px 1px at 30% 60%, #fff, transparent),
                        radial-gradient(1px 1px at 50% 10%, #fff, transparent),
                        radial-gradient(1px 1px at 70% 45%, #fff, transparent),
                        radial-gradient(1px 1px at 90% 75%, #fff, transparent),
                        radial-gradient(2px 2px at 25% 85%, #d4af37, transparent),
                        radial-gradient(2px 2px at 65% 15%, #d4af37, transparent),
                        radial-gradient(1px 1px at 45% 55%, #fff, transparent),
                        radial-gradient(1px 1px at 80% 35%, #fff, transparent),
                        radial-gradient(1px 1px at 15% 45%, #fff, transparent);
                    animation: twinkle 3s ease-in-out infinite;
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.6; }
                    50% { opacity: 1; }
                }
                .crash-3d-rocket {
                    font-size: 50px;
                    position: absolute;
                    bottom: 15px;
                    left: 50%;
                    transform: translateX(-50%) rotateZ(-45deg);
                    transition: bottom 0.1s linear;
                    filter: drop-shadow(0 0 15px rgba(255,165,0,0.8));
                    z-index: 2;
                }
                .crash-3d-trail {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 4px;
                    background: linear-gradient(to top, #ff4500, #ffa500, transparent);
                    transition: height 0.1s linear;
                    border-radius: 2px;
                    z-index: 1;
                }
                .crash-3d-hud {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .crash-3d-multiplier {
                    font-size: 48px;
                    font-weight: 900;
                    color: #2ecc71;
                    text-shadow: 0 0 20px rgba(46,204,113,0.6);
                    min-width: 120px;
                }
                .crash-3d-multiplier.crashed {
                    color: #e74c3c;
                    text-shadow: 0 0 20px rgba(231,76,60,0.8);
                    animation: shake 0.5s ease-in-out;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                .btn-cashout-3d {
                    padding: 16px 28px;
                    border-radius: 30px;
                    border: none;
                    background: linear-gradient(180deg, #f9d976, #b8960f);
                    color: #000;
                    font-weight: 900;
                    font-size: 16px;
                    cursor: pointer;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
                    transition: all 0.2s;
                    font-family: inherit;
                    animation: cashoutGlow 2s ease-in-out infinite;
                }
                @keyframes cashoutGlow {
                    0%, 100% { box-shadow: 0 6px 20px rgba(0,0,0,0.4); }
                    50% { box-shadow: 0 6px 30px rgba(212,175,55,0.6), 0 0 50px rgba(212,175,55,0.3); }
                }
                .btn-cashout-3d:active {
                    transform: scale(0.95);
                }
                .crash-3d-status {
                    color: #999;
                    font-size: 14px;
                    margin-top: 12px;
                }
            </style>
        `;
    },

    play(bet, callback) {
        this.crashed = false;
        this.cashedOut = false;
        this.multiplier = 1;
        this.callback = callback;
        const crashPoint = parseFloat((Math.random() * 8 + 1.5).toFixed(1));

        document.getElementById('crash3dMultiplier').textContent = '1.0x';
        document.getElementById('crash3dMultiplier').classList.remove('crashed');
        document.getElementById('crash3dMultVal').textContent = '1.0';
        document.getElementById('crash3dStatus').textContent = '🚀 الصاروخ طاير... اسحب قبل ما ينفجر!';
        document.getElementById('crash3dCashout').style.display = 'inline-block';
        const rocket = document.getElementById('crash3dRocket');
        const trail = document.getElementById('crash3dTrail');
        rocket.textContent = '🚀';
        rocket.style.bottom = '15px';
        trail.style.height = '0px';

        this.interval = setInterval(() => {
            this.multiplier = parseFloat((this.multiplier + 0.1).toFixed(1));
            document.getElementById('crash3dMultiplier').textContent = this.multiplier + 'x';
            document.getElementById('crash3dMultVal').textContent = this.multiplier.toFixed(1);

            const progress = Math.min((this.multiplier / crashPoint), 1);
            rocket.style.bottom = (15 + progress * 170) + 'px';
            trail.style.height = (progress * 180) + 'px';

            if (this.multiplier >= crashPoint) {
                this.explode();
            }
        }, 250);
    },

    cashOut() {
        if (this.crashed || this.cashedOut) return;
        this.cashedOut = true;
        clearInterval(this.interval);
        const bet = parseInt(document.getElementById('betAmount').textContent);
        const win = Math.floor(bet * this.multiplier);
        document.getElementById('crash3dStatus').textContent = `🎉 سحبت ${this.multiplier}x! +${win} 🪙`;
        document.getElementById('crash3dCashout').style.display = 'none';
        this.callback({ win, message: `سحبت ${this.multiplier}x` });
    },

    explode() {
        if (this.cashedOut) return;
        this.crashed = true;
        clearInterval(this.interval);
        document.getElementById('crash3dMultiplier').classList.add('crashed');
        document.getElementById('crash3dRocket').textContent = '💥';
        document.getElementById('crash3dStatus').textContent = '💀 انفجر! خسرت الرهان';
        document.getElementById('crash3dCashout').style.display = 'none';
        setTimeout(() => {
            document.getElementById('crash3dRocket').textContent = '🚀';
            this.callback({ win: 0, message: 'انفجر الصاروخ!' });
        }, 1000);
    }
};