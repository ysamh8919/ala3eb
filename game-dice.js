// ==================== Dice Game 2.5D ====================
const DiceGame = {
    rolling: false,

    getHTML() {
        return `
            <div class="dice-3d-container">
                <div class="dice-3d-table">
                    <div class="dice-3d-cube" id="dice3dCube">
                        <div class="dice-3d-face front">⚀</div>
                        <div class="dice-3d-face back">⚅</div>
                        <div class="dice-3d-face right">⚃</div>
                        <div class="dice-3d-face left">⚂</div>
                        <div class="dice-3d-face top">⚄</div>
                        <div class="dice-3d-face bottom">⚁</div>
                    </div>
                </div>
                <div class="dice-3d-numbers">
                    <p style="color:#999;margin-bottom:10px">🎯 توقع الرقم:</p>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:220px;margin:0 auto">
                        ${[1,2,3,4,5,6].map(n => `
                            <button class="dice-guess-btn" onclick="DiceGame.guess3D(${n})" id="diceBtn${n}">${n}</button>
                        `).join('')}
                    </div>
                </div>
                <p id="dice3dResult" style="color:#d4af37;font-weight:700;font-size:18px;margin-top:15px;min-height:28px"></p>
            </div>
            <style>
                .dice-3d-container {
                    text-align: center;
                    padding: 20px;
                    perspective: 600px;
                }
                .dice-3d-table {
                    width: 150px;
                    height: 150px;
                    margin: 0 auto 20px;
                    background: radial-gradient(ellipse, #2a1a0a, #0a0a0a);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #8b6914;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.5);
                }
                .dice-3d-cube {
                    width: 80px;
                    height: 80px;
                    position: relative;
                    transform-style: preserve-3d;
                    transition: transform 0.1s;
                }
                .dice-3d-cube.rolling {
                    animation: diceRoll3D 1s ease-out;
                }
                @keyframes diceRoll3D {
                    0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
                    25% { transform: rotateX(360deg) rotateY(180deg) rotateZ(90deg); }
                    50% { transform: rotateX(720deg) rotateY(360deg) rotateZ(180deg); }
                    75% { transform: rotateX(1080deg) rotateY(540deg) rotateZ(270deg); }
                    100% { transform: rotateX(1440deg) rotateY(720deg) rotateZ(360deg); }
                }
                .dice-3d-face {
                    position: absolute;
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #fff, #ddd);
                    border: 2px solid #999;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 42px;
                    box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
                    backface-visibility: visible;
                }
                .front { transform: translateZ(40px); }
                .back { transform: rotateY(180deg) translateZ(40px); }
                .right { transform: rotateY(90deg) translateZ(40px); }
                .left { transform: rotateY(-90deg) translateZ(40px); }
                .top { transform: rotateX(90deg) translateZ(40px); }
                .bottom { transform: rotateX(-90deg) translateZ(40px); }
                
                .dice-guess-btn {
                    padding: 14px;
                    border-radius: 12px;
                    border: 2px solid #444;
                    background: #1a1a1a;
                    color: #fff;
                    font-size: 20px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .dice-guess-btn:hover {
                    border-color: #d4af37;
                    background: #222;
                    transform: scale(1.05);
                }
                .dice-guess-btn:active {
                    transform: scale(0.9);
                }
                .dice-guess-btn.wrong {
                    border-color: #e74c3c !important;
                    background: #2a0000 !important;
                }
                .dice-guess-btn.correct {
                    border-color: #2ecc71 !important;
                    background: #002a00 !important;
                    box-shadow: 0 0 20px rgba(46,204,113,0.5);
                }
            </style>
        `;
    },

    guess3D(userNumber) {
        if (this.rolling) return;
        this.rolling = true;

        const cube = document.getElementById('dice3dCube');
        cube.classList.add('rolling');

        // تعطيل الأزرار مؤقتاً
        document.querySelectorAll('.dice-guess-btn').forEach(b => b.disabled = true);

        const actualNumber = Math.floor(Math.random() * 6) + 1;

        setTimeout(() => {
            cube.classList.remove('rolling');
            
            // توجيه المكعب للرقم الصح
            const rotations = {
                1: 'rotateX(0deg) rotateY(0deg)',
                2: 'rotateX(180deg) rotateY(0deg)',
                3: 'rotateX(0deg) rotateY(90deg)',
                4: 'rotateX(0deg) rotateY(-90deg)',
                5: 'rotateX(-90deg) rotateY(0deg)',
                6: 'rotateX(90deg) rotateY(0deg)'
            };
            cube.style.transform = rotations[actualNumber];

            const bet = parseInt(document.getElementById('betAmount').textContent);
            let win = 0, message = '';

            if (userNumber === actualNumber) {
                win = bet * 6;
                message = `🎉 صح! الرقم ${actualNumber} - ربحت ${win} 🪙`;
                document.getElementById(`diceBtn${userNumber}`).classList.add('correct');
            } else {
                message = `😔 غلط! الرقم ${actualNumber} - خسرت ${bet} 🪙`;
                document.getElementById(`diceBtn${userNumber}`).classList.add('wrong');
                document.getElementById(`diceBtn${actualNumber}`).classList.add('correct');
            }

            document.getElementById('dice3dResult').textContent = message;
            this.rolling = false;

            setTimeout(() => {
                document.querySelectorAll('.dice-guess-btn').forEach(b => {
                    b.disabled = false;
                    b.classList.remove('correct', 'wrong');
                });
                cube.style.transform = 'rotateX(0deg) rotateY(0deg)';
            }, 2000);

            App.onGameResult({ win, message });
        }, 1000);
    },

    play(bet, callback) {
        // اللعبة بتشتغل بالضغط على الأرقام
    }
};