// ==================== Main Application ====================
const App = {
    currentGame: null,
    isPlaying: false,

    init() {
        SoundManager.init();
        CoinsManager.init();
        this.renderGames();
        this.renderLeaderboard();
        this.setupDailyReward();
        this.setupEventListeners();
        this.hideSplash();
        console.log('👑 Royal Casino Ready!');
    },

    hideSplash() {
        const fill = document.getElementById('loadingFill');
        let width = 0;
        const interval = setInterval(() => {
            width += 20;
            if (fill) fill.style.width = width + '%';
            if (width >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    document.getElementById('splashScreen').classList.add('hidden');
                }, 300);
            }
        }, 200);
    },

    renderGames() {
        const grid = document.getElementById('gamesGrid');
        if (!grid) return;
        
        grid.innerHTML = GamesData.getAll().map(game => `
            <div class="game-card" onclick="App.openGame('${game.id}')">
                ${game.isHot ? '<span class="badge-hot">🔥 ساخن</span>' : ''}
                <span class="game-icon">${game.icon}</span>
                <div class="game-name">${game.name}</div>
                <div class="game-type">${game.type} | ${game.minBet}-${game.maxBet} 🪙</div>
            </div>
        `).join('');
    },

    renderLeaderboard() {
        const container = document.getElementById('leaderboardMini');
        if (!container) return;
        
        // بيانات وهمية للقيادة
        const leaders = [
            { name: 'Player_King', coins: 98500 },
            { name: 'Lucky_One', coins: 76200 },
            { name: 'GoldenHand', coins: 54100 },
            { name: 'أنت', coins: CoinsManager.get(), isYou: true },
            { name: 'Ace_Master', coins: 32100 }
        ].sort((a, b) => b.coins - a.coins);

        container.innerHTML = leaders.map((p, i) => {
            let rankClass = '';
            if (i === 0) rankClass = 'gold';
            else if (i === 1) rankClass = 'silver';
            else if (i === 2) rankClass = 'bronze';
            
            return `
                <div class="leader-item" style="${p.isYou ? 'background: rgba(212,175,55,0.1); border-radius: 8px;' : ''}">
                    <span class="leader-rank ${rankClass}">#${i + 1}</span>
                    <span class="leader-name">${p.name} ${p.isYou ? '👈' : ''}</span>
                    <span class="leader-coins">🪙 ${CoinsManager.formatNumber(p.coins)}</span>
                </div>
            `;
        }).join('');
    },

    setupDailyReward() {
        const claimBtn = document.getElementById('claimRewardBtn');
        const timerEl = document.getElementById('rewardTimer');
        if (!claimBtn || !timerEl) return;

        const lastClaim = localStorage.getItem('royal_last_daily');
        const now = new Date().getTime();
        const cooldown = 24 * 60 * 60 * 1000; // 24 ساعة

        if (lastClaim && (now - parseInt(lastClaim)) < cooldown) {
            claimBtn.disabled = true;
            claimBtn.textContent = '✅ تم الاستلام اليوم';
            const remaining = cooldown - (now - parseInt(lastClaim));
            timerEl.textContent = `⏳ متبقي: ${this.formatTime(remaining)}`;
            
            const countdown = setInterval(() => {
                const r = cooldown - (new Date().getTime() - parseInt(lastClaim));
                if (r <= 0) {
                    clearInterval(countdown);
                    claimBtn.disabled = false;
                    claimBtn.textContent = '🎁 استلم مكافأتك اليومية';
                    timerEl.textContent = 'المكافأة جاهزة! 🎉';
                } else {
                    timerEl.textContent = `⏳ متبقي: ${this.formatTime(r)}`;
                }
            }, 1000);
        } else {
            claimBtn.addEventListener('click', () => this.claimDailyReward());
        }
    },

    claimDailyReward() {
        const bonus = Math.floor(Math.random() * 200) + 100;
        CoinsManager.add(bonus);
        SoundManager.play('coins');
        localStorage.setItem('royal_last_daily', new Date().getTime().toString());
        this.showToast(`🎁 مبروك! كسبت ${bonus} 🪙`);
        document.getElementById('claimRewardBtn').disabled = true;
        document.getElementById('claimRewardBtn').textContent = '✅ تم الاستلام اليوم';
        this.setupDailyReward();
    },

    formatTime(ms) {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    },

    openGame(gameId) {
        const game = GamesData.getGame(gameId);
        if (!game) return;
        
        this.currentGame = game;
        document.getElementById('modalTitle').textContent = game.icon + ' ' + game.name;
        document.getElementById('betSlider').min = game.minBet;
        document.getElementById('betSlider').max = game.maxBet;
        document.getElementById('betSlider').value = game.minBet;
        document.getElementById('betAmount').textContent = game.minBet;
        document.getElementById('modalBody').innerHTML = this.getGameHTML(game);
        document.getElementById('gameModal').classList.add('active');
        
        // إعداد اللعبة
        const playBtn = document.getElementById('playBtn');
        playBtn.onclick = () => this.playGame(game);
    },

    getGameHTML(game) {
        switch(game.id) {
            case 'slots': return SlotsGame.getHTML();
            case 'blackjack': return BlackjackGame.getHTML();
            case 'poker': return PokerGame.getHTML();
            case 'luckywheel': return LuckyWheelGame.getHTML();
            case 'dice': return DiceGame.getHTML();
            case 'crash': return CrashGame.getHTML();
            default: return '<p>اللعبة قيد التطوير</p>';
        }
    },

    playGame(game) {
        if (this.isPlaying) return;
        
        const bet = parseInt(document.getElementById('betAmount').textContent);
        if (!CoinsManager.spend(bet)) {
            this.showToast('❌ عملات غير كافية!');
            return;
        }

        this.isPlaying = true;
        SoundManager.play('spin');

        switch(game.id) {
            case 'slots': SlotsGame.play(bet, (result) => this.onGameResult(result)); break;
            case 'blackjack': BlackjackGame.play(bet, (result) => this.onGameResult(result)); break;
            case 'poker': PokerGame.play(bet, (result) => this.onGameResult(result)); break;
            case 'luckywheel': LuckyWheelGame.play(bet, (result) => this.onGameResult(result)); break;
            case 'dice': DiceGame.play(bet, (result) => this.onGameResult(result)); break;
            case 'crash': CrashGame.play(bet, (result) => this.onGameResult(result)); break;
        }
    },

    onGameResult(result) {
        this.isPlaying = false;
        if (result.win > 0) {
            CoinsManager.add(result.win);
            SoundManager.play('win');
            this.showToast(`🎉 ربحت ${result.win} 🪙! ${result.message || ''}`);
        } else {
            this.showToast(`😔 خسرت! ${result.message || 'حاول مرة تانية'}`);
        }
        this.renderLeaderboard();
    },

    closeModal() {
        document.getElementById('gameModal').classList.remove('active');
        this.currentGame = null;
    },

    setupEventListeners() {
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('gameModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('gameModal')) this.closeModal();
        });

        const betSlider = document.getElementById('betSlider');
        betSlider.addEventListener('input', () => {
            document.getElementById('betAmount').textContent = betSlider.value;
        });

        document.getElementById('addCoinsBtn').addEventListener('click', () => {
            CoinsManager.add(1000);
            this.showToast('🪙 تم إضافة 1000 عملة');
        });
    },

    showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());