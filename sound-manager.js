// ==================== Sound Manager ====================
const SoundManager = {
    sounds: {},
    enabled: true,

    init() {
        this.sounds.spin = document.getElementById('sound-spin');
        this.sounds.win = document.getElementById('sound-win');
        this.sounds.click = document.getElementById('sound-click');
        this.sounds.coins = document.getElementById('sound-coins');
        
        // ضبط مستوى الصوت
        Object.values(this.sounds).forEach(s => {
            if (s) s.volume = 0.5;
        });
    },

    play(name) {
        if (!this.enabled) return;
        const sound = this.sounds[name];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(() => {});
        }
    },

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
};