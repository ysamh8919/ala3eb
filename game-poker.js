// ==================== Poker 2.5D ====================
const PokerGame = {
    getHTML() {
        return `
            <div class="poker-3d-container">
                <div class="poker-3d-table">
                    <div class="poker-3d-opponent">
                        <div class="poker-avatar">🤖</div>
                        <p style="color:#fff;font-size:12px">AI Player</p>
                        <div style="display:flex;gap:6px;justify-content:center">
                            <div class="poker-mini-card">🂠</div>
                            <div class="poker-mini-card">🂠</div>
                            <div class="poker-mini-card">🂠</div>
                            <div class="poker-mini-card">🂠</div>
                            <div class="poker-mini-card">🂠</div>
                        </div>
                    </div>
                    <div class="poker-3d-center">
                        <div class="poker-pot">💰 الرهان: <span id="pokerPot">0</span> 🪙</div>
                        <div class="poker-community" id="pokerCommunity">
                            <div class="card-3d">🂠</div>
                            <div class="card-3d">🂠</div>
                            <div class="card-3d">🂠</div>
                            <div class="card-3d">🂠</div>
                            <div class="card-3d">🂠</div>
                        </div>
                    </div>
                    <div class="poker-3d-player">
                        <div class="poker-avatar">👤</div>
                        <p style="color:#fff;font-size:12px">أنت</p>
                        <div style="display:flex;gap:6px;justify-content:center" id="pokerPlayerCards">
                            <div class="card-3d">🂡</div>
                            <div class="card-3d">🂮</div>
                        </div>
                    </div>
                </div>
                <div class="poker-3d-actions" id="pokerActions3d">
                    <button class="btn-gold-3d" onclick="PokerGame.fold()">🙅‍♂️ أنسحب</button>
                    <button class="btn-red-3d" onclick="PokerGame.call()">👊 ألعب</button>
                    <button class="btn-gold-3d" onclick="PokerGame.raise()">🔼 أرفع</button>
                </div>
                <p id="poker3dMessage" style="color:#d4af37;font-weight:700;font-size:18px;margin-top:15px;min-height:28px"></p>
            </div>
            <style>
                .poker-3d-container {
                    text-align: center;
                    padding: 10px;
                    perspective: 800px;
                }
                .poker-3d-table {
                    background: radial-gradient(ellipse at center, #0d5e2e, #042d14);
                    border-radius: 50% / 30%;
                    padding: 30px 20px;
                    border: 6px solid #8b6914;
                    box-shadow: 
                        0 25px 60px rgba(0,0,0,0.8),
                        0 0 40px rgba(212,175,55,0.3),
                        inset 0 0 50px rgba(0,0,0,0.6);
                    transform: rotateX(12deg);
                    margin-bottom: 20px;
                    min-height: 280px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }
                .poker-3d-opponent, .poker-3d-player {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                }
                .poker-avatar {
                    width: 50px;
                    height: 50px;
                    background: radial-gradient(circle, #d4af37, #8b6914);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 28px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
                    border: 2px solid #fff;
                }
                .poker-mini-card {
                    width: 36px;
                    height: 50px;
                    background: linear-gradient(135deg, #c0392b, #600);
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.4);
                }
                .poker-3d-center {
                    margin: 15px 0;
                }
                .poker-pot {
                    color: #d4af37;
                    font-weight: 700;
                    font-size: 16px;
                    margin-bottom: 10px;
                    text-shadow: 0 0 10px rgba(212,175,55,0.5);
                }
                .poker-community {
                    display: flex;
                    gap: 8px;
                    justify-content: center;
                }
                .poker-3d-actions {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
            </style>
        `;
    },

    play(bet, callback) {
        document.getElementById('pokerPot').textContent = bet * 3;
        this.callback = callback;
    },

    fold() {
        const bet = parseInt(document.getElementById('betAmount').textContent);
        document.getElementById('poker3dMessage').textContent = '🙅‍♂️ انسحبت!';
        document.getElementById('pokerActions3d').style.display = 'none';
        App.onGameResult({ win: 0, message: 'انسحبت!' });
    },

    call() {
        const bet = parseInt(document.getElementById('betAmount').textContent);
        const luck = Math.random();
        let win = 0, message = '';
        
        if (luck < 0.4) {
            win = bet * 3;
            message = '🎉 يدك أفضل! فزت!';
        } else {
            message = '😔 الخصم فاز!';
        }
        document.getElementById('poker3dMessage').textContent = message;
        document.getElementById('pokerActions3d').style.display = 'none';
        App.onGameResult({ win, message });
    },

    raise() {
        const bet = parseInt(document.getElementById('betAmount').textContent);
        document.getElementById('pokerPot').textContent = bet * 6;
        const luck = Math.random();
        let win = 0, message = '';

        if (luck < 0.3) {
            win = bet * 6;
            message = '🎉 رهان عالي! فزت كبير!';
        } else {
            message = '💀 خسرت الرهان العالي!';
        }
        document.getElementById('poker3dMessage').textContent = message;
        document.getElementById('pokerActions3d').style.display = 'none';
        App.onGameResult({ win, message });
    }
};