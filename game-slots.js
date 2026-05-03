// ==================== Slots Game 2.5D ====================
const SlotsGame = {
    symbols: ['🍒', '🍋', '🍊', '🍇', '💎', '7️⃣', '👑'],
    spinning: false,
    reelInterval: null,

    getHTML() {
        return `
            <div class="slot-3d-container">
                <div class="slot-3d-machine">
                    <!-- إطار الماكينة -->
                    <div class="slot-3d-top">🎰 ROYAL SLOTS 🎰</div>
                    <div class="slot-3d-screen">
                        <div class="slot-3d-reel" id="reel3d-1">🍒</div>
                        <div class="slot-3d-reel" id="reel3d-2">🍋</div>
                        <div class="slot-3d-reel" id="reel3d-3">🍊</div>
                    </div>
                    <div class="slot-3d-bottom">
                        <div class="slot-3d-lever" id="slotLever">🕹️</div>
                    </div>
                </div>
                <p class="slot-3d-info">✨ 3 رموز متطابقة = فوز! 👑 = 10x</p>
            </div>
            <style>
                .slot-3d-container {
                    text-align: center;
                    padding: 20px;
                    perspective: 800px;
                }
                .slot-3d-machine {
                    background: linear-gradient(180deg, #2a1a0a, #1a0a00);
                    border-radius: 20px;
                    padding: 20px;
                    border: 4px solid #d4af37;
                    box-shadow: 
                        0 10px 40px rgba(0,0,0,0.5),
                        0 0 20px rgba(212,175,55,0.3),
                        inset 0 0 20px rgba(0,0,0,0.5);
                    transform: rotateX(5deg);
                    transform-style: preserve-3d;
                    max-width: 300px;
                    margin: 0 auto;
                }
                .slot-3d-top {
                    background: linear-gradient(180deg, #d4af37, #8b6914);
                    color: #000;
                    padding: 10px;
                    font-weight: 900;
                    font-size: 18px;
                    border-radius: 10px;
                    margin-bottom: 15px;
                    text-shadow: 0 2px 4px rgba(255,255,255,0.3);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
                }
                .slot-3d-screen {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    background: #000;
                    padding: 20px;
                    border-radius: 12px;
                    border: 3px solid #333;
                    transform: translateZ(10px);
                    box-shadow: inset 0 0 30px rgba(0,0,0,0.8);
                }
                .slot-3d-reel {
                    width: 70px;
                    height: 70px;
                    background: linear-gradient(180deg, #fff, #ddd);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 40px;
                    border: 2px solid #999;
                    box-shadow: 
                        0 4px 8px rgba(0,0,0,0.3),
                        inset 0 2px 4px rgba(255,255,255,0.5);
                    transition: transform 0.1s;
                }
                .slot-3d-reel.spinning {
                    animation: reelSpin3D 0.1s linear infinite;
                }
                @keyframes reelSpin3D {
                    0% { transform: rotateX(0deg); background: #fff; }
                    50% { transform: rotateX(180deg); background: #ffd700; }
                    100% { transform: rotateX(360deg); background: #fff; }
                }
                .slot-3d-reel.win {
                    animation: winGlow 0.5s ease-in-out 3;
                    border-color: #d4af37 !important;
                    box-shadow: 0 0 20px gold, 0 0 40px gold !important;
                }
                @keyframes winGlow {
                    0%, 100% { box-shadow: 0 0 10px gold; }
                    50% { box-shadow: 0 0 30px gold, 0 0 60px gold; }
                }
                .slot-3d-bottom {
                    margin-top: 15px;
                    display: flex;
                    justify-content: center;
                }
                .slot-3d-lever {
                    font-size: 40px;
                    cursor: pointer;
                    transition: transform 0.3s;
                    display: inline-block;
                    animation: leverBounce 2s ease-in-out infinite;
                }
                @keyframes leverBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .slot-3d-lever:active {
                    transform: translateY(20px) !important;
                    animation: none;
                }
                .slot-3d-info {
                    color: #d4af37;
                    font-size: 13px;
                    margin-top: 15px;
                    font-weight: 600;
                }
            </style>
        `;
    },

    play(bet, callback) {
        if (this.spinning) return;
        this.spinning = true;

        const reels = [
            document.getElementById('reel3d-1'),
            document.getElementById('reel3d-2'),
            document.getElementById('reel3d-3')
        ];
        
        const lever = document.getElementById('slotLever');
        if (lever) lever.style.transform = 'translateY(20px)';

        // بدء الدوران
        reels.forEach(r => r.classList.add('spinning'));

        // نتائج عشوائية
        const results = [
            this.symbols[Math.floor(Math.random() * this.symbols.length)],
            this.symbols[Math.floor(Math.random() * this.symbols.length)],
            this.symbols[Math.floor(Math.random() * this.symbols.length)]
        ];

        // إيقاف اللفات واحدة واحدة
        setTimeout(() => {
            reels[0].classList.remove('spinning');
            reels[0].textContent = results[0];
        }, 600);

        setTimeout(() => {
            reels[1].classList.remove('spinning');
            reels[1].textContent = results[1];
        }, 1000);

        setTimeout(() => {
            reels[2].classList.remove('spinning');
            reels[2].textContent = results[2];
            if (lever) lever.style.transform = '';
            
            // حساب الفوز
            let win = 0, message = '';
            if (results[0] === results[1] && results[1] === results[2]) {
                const symbol = results[0];
                if (symbol === '👑') win = bet * 10;
                else if (symbol === '💎') win = bet * 7;
                else if (symbol === '7️⃣') win = bet * 5;
                else win = bet * 3;
                message = '🎰 جاك بوت!';
                reels.forEach(r => r.classList.add('win'));
                setTimeout(() => reels.forEach(r => r.classList.remove('win')), 1500);
            } else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
                win = bet * 1.5;
                message = 'رمزين متطابقين!';
            }

            this.spinning = false;
            callback({ win, message });
        }, 1400);
    }
};