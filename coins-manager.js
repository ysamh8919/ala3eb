// ==================== Coins Manager ====================
const CoinsManager = {
    coins: 1000,
    storageKey: 'royal_casino_coins',

    init() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            this.coins = parseInt(saved) || 1000;
        } else {
            this.coins = 1000;
            this.save();
        }
        this.updateDisplay();
        console.log('🪙 Coins loaded:', this.coins);
    },

    get() {
        return this.coins;
    },

    add(amount) {
        this.coins += amount;
        this.save();
        this.updateDisplay();
        this.animateAdd(amount);
    },

    spend(amount) {
        if (this.coins >= amount) {
            this.coins -= amount;
            this.save();
            this.updateDisplay();
            return true;
        }
        return false;
    },

    canAfford(amount) {
        return this.coins >= amount;
    },

    save() {
        localStorage.setItem(this.storageKey, this.coins.toString());
    },

    updateDisplay() {
        const display = document.getElementById('coinsDisplay');
        if (display) {
            display.textContent = this.formatNumber(this.coins);
        }
    },

    animateAdd(amount) {
        const badge = document.getElementById('coinsBadge');
        if (badge) {
            badge.style.transform = 'scale(1.1)';
            setTimeout(() => badge.style.transform = 'scale(1)', 200);
        }
    },

    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }
};