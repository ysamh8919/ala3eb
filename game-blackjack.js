// ==================== Blackjack 2.5D ====================
const BlackjackGame = {
    playerCards: [],
    dealerCards: [],
    deck: [],
    gameOver: false,

    getHTML() {
        this.initDeck();
        this.playerCards = [this.drawCard(), this.drawCard()];
        this.dealerCards = [this.drawCard(), this.drawCard()];
        this.gameOver = false;

        return `
            <div class="bj-3d-container">
                <div class="bj-3d-table">
                    <div class="bj-3d-area dealer-area-3d">
                        <h4>🤖 الموزع</h4>
                        <div class="bj-3d-cards" id="dealerCards3d">
                            <div class="card-3d">${this.dealerCards[0]}</div>
                            <div class="card-3d card-back-3d">؟</div>
                        </div>
                        <span class="bj-3d-score" id="dealerScore3d">؟</span>
                    </div>
                    <div class="bj-3d-divider"></div>
                    <div class="bj-3d-area player-area-3d">
                        <h4>👤 أنت</h4>
                        <div class="bj-3d-cards" id="playerCards3d">
                            ${this.playerCards.map(c => `<div class="card-3d">${c}</div>`).join('')}
                        </div>
                        <span class="bj-3d-score" id="playerScore3d">${this.calculateScore(this.playerCards)}</span>
                    </div>
                </div>
                <div class="bj-3d-actions" id="bjActions3d">
                    <button class="btn-gold-3d" onclick="BlackjackGame.hit()">➕ اضرب</button>
                    <button class="btn-red-3d" onclick="BlackjackGame.stand()">✋ قف</button>
                </div>
                <p id="bj3dMessage" style="color:#d4af37;font-weight:700;font-size:18px;margin-top:15px;min-height:28px"></p>
            </div>
            <style>
                .bj-3d-container {
                    text-align: center;
                    padding: 10px;
                    perspective: 700px;
                }
                .bj-3d-table {
                    background: radial-gradient(ellipse at center, #0d5e2e, #063d1a);
                    border-radius: 200px;
                    padding: 30px 20px;
                    border: 6px solid #8b6914;
                    box-shadow: 
                        0 20px 50px rgba(0,0,0,0.7),
                        0 0 30px rgba(212,175,55,0.3),
                        inset 0 0 40px rgba(0,0,0,0.5);
                    transform: rotateX(8deg);
                    margin-bottom: 20px;
                }
                .bj-3d-area h4 {
                    color: #fff;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                    margin-bottom: 8px;
                }
                .bj-3d-cards {
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin: 10px 0;
                    flex-wrap: wrap;
                }
                .card-3d {
                    width: 55px;
                    height: 78px;
                    background: linear-gradient(135deg, #fff, #e8e8e8);
                    color: #000;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 22px;
                    font-weight: 700;
                    box-shadow: 
                        0 6px 15px rgba(0,0,0,0.4),
                        0 2px 4px rgba(0,0,0,0.2);
                    transition: transform 0.3s;
                    transform: rotateY(0deg);
                    border: 2px solid #aaa;
                }
                .card-3d:hover {
                    transform: rotateY(10deg) translateY(-5px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.6);
                }
                .card-back-3d {
                    background: linear-gradient(135deg, #c0392b, #8b0000);
                    color: #fff;
                    font-size: 30px;
                    border: 2px solid #600;
                }
                .bj-3d-score {
                    font-size: 22px;
                    font-weight: 900;
                    color: #d4af37;
                    text-shadow: 0 0 10px rgba(212,175,55,0.5);
                }
                .bj-3d-divider {
                    height: 2px;
                    background: linear-gradient(90deg, transparent, #d4af37, transparent);
                    margin: 20px 0;
                }
                .bj-3d-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }
                .btn-gold-3d, .btn-red-3d {
                    padding: 14px 28px;
                    border-radius: 30px;
                    border: none;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 16px;
                    transition: all 0.2s;
                    font-family: inherit;
                    box-shadow: 0 6px 15px rgba(0,0,0,0.3);
                }
                .btn-gold-3d {
                    background: linear-gradient(180deg, #f9d976, #b8960f);
                    color: #000;
                }
                .btn-red-3d {
                    background: linear-gradient(180deg, #e74c3c, #962d22);
                    color: #fff;
                }
                .btn-gold-3d:active, .btn-red-3d:active {
                    transform: scale(0.95) translateY(2px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                }
            </style>
        `;
    },

    initDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.deck = [];
        for (let s of suits) for (let v of values) this.deck.push(v + s);
        this.shuffle();
    },

    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    },

    drawCard() {
        if (this.deck.length < 10) this.initDeck();
        return this.deck.pop();
    },

    calculateScore(cards) {
        let score = 0, aces = 0;
        for (let c of cards) {
            const val = c.slice(0, -1);
            if (['J','Q','K'].includes(val)) score += 10;
            else if (val === 'A') { aces++; score += 11; }
            else score += parseInt(val);
        }
        while (score > 21 && aces > 0) { score -= 10; aces--; }
        return score;
    },

    hit() {
        if (this.gameOver) return;
        this.playerCards.push(this.drawCard());
        this.updateDisplay();
        const score = this.calculateScore(this.playerCards);
        if (score > 21) {
            this.gameOver = true;
            document.getElementById('bjActions3d').style.display = 'none';
            document.getElementById('dealerCards3d').innerHTML = this.dealerCards.map(c => `<div class="card-3d">${c}</div>`).join('');
            document.getElementById('dealerScore3d').textContent = this.calculateScore(this.dealerCards);
            document.getElementById('bj3dMessage').textContent = '💥 خصيت! فوق 21';
            const bet = parseInt(document.getElementById('betAmount').textContent);
            App.onGameResult({ win: 0, message: 'خصيت!' });
        }
    },

    stand() {
        if (this.gameOver) return;
        this.gameOver = true;
        while (this.calculateScore(this.dealerCards) < 17) {
            this.dealerCards.push(this.drawCard());
        }
        const pScore = this.calculateScore(this.playerCards);
        const dScore = this.calculateScore(this.dealerCards);
        
        document.getElementById('dealerCards3d').innerHTML = this.dealerCards.map(c => `<div class="card-3d">${c}</div>`).join('');
        document.getElementById('dealerScore3d').textContent = dScore;
        document.getElementById('bjActions3d').style.display = 'none';

        const bet = parseInt(document.getElementById('betAmount').textContent);
        let win = 0, message = '';

        if (dScore > 21 || pScore > dScore) {
            win = bet * 2; message = '🎉 أنت الفائز!';
        } else if (pScore === dScore) {
            win = bet; message = '🤝 تعادل!';
        } else {
            message = '😔 الموزع يفوز!';
        }

        document.getElementById('bj3dMessage').textContent = message;
        App.onGameResult({ win, message });
    },

    updateDisplay() {
        document.getElementById('playerCards3d').innerHTML = this.playerCards.map(c => `<div class="card-3d">${c}</div>`).join('');
        document.getElementById('playerScore3d').textContent = this.calculateScore(this.playerCards);
    },

    play(bet, callback) {}
};