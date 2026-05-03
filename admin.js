// ==================== Admin Panel ====================
const ADMIN_PASSWORD = "yaseN01207734039";

const Admin = {
    init() {
        this.loadStats();
    },

    checkPassword() {
        const input = document.getElementById('passwordInput').value.trim();
        const error = document.getElementById('loginError');
        
        if (input === ADMIN_PASSWORD) {
            document.getElementById('loginOverlay').style.display = 'none';
            document.getElementById('adminContent').style.display = 'block';
            sessionStorage.setItem('royal_admin_auth', 'true');
            this.init();
            this.showToast('✅ تم تسجيل الدخول');
        } else {
            error.classList.add('show');
            document.getElementById('passwordInput').value = '';
        }
    },

    loadStats() {
        db.ref('royal_casino/stats').once('value').then(snap => {
            const stats = snap.val() || { players: 0, games: 0, coins: 0 };
            document.getElementById('totalPlayers').textContent = stats.players || 0;
            document.getElementById('totalGames').textContent = stats.games || 0;
            document.getElementById('totalCoins').textContent = (stats.coins || 0).toLocaleString();
        });
    },

    updateSettings() {
        const settings = {
            name: document.getElementById('gameName').value,
            icon: document.getElementById('gameIcon').value,
            minBet: parseInt(document.getElementById('gameMinBet').value),
            maxBet: parseInt(document.getElementById('gameMaxBet').value),
            type: document.getElementById('gameType').value,
            winRate: parseInt(document.getElementById('gameWinRate').value),
            isHot: document.getElementById('gameIsHot').checked
        };
        
        db.ref('royal_casino/settings').set(settings).then(() => {
            this.showToast('💾 تم حفظ الإعدادات بنجاح');
        });
    },

    exportData() {
        db.ref('royal_casino').once('value').then(snap => {
            const data = JSON.stringify(snap.val() || {}, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = `royal_backup_${Date.now()}.json`;
            a.click(); URL.revokeObjectURL(url);
            this.showToast('💾 تم التصدير بنجاح');
        });
    },

    importData(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (!confirm('📥 استيراد البيانات؟')) return;
                db.ref('royal_casino').set(data).then(() => {
                    this.showToast('✅ تم الاستيراد');
                    this.loadStats();
                });
            } catch(err) {
                this.showToast('❌ ملف غير صالح');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    },

    resetAll() {
        if (!confirm('⚠️ حذف كل البيانات؟')) return;
        if (!confirm('تأكيد نهائي؟')) return;
        db.ref('royal_casino').set({}).then(() => {
            this.showToast('🗑️ تم حذف الكل');
            this.loadStats();
        });
    },

    showToast(msg) {
        const toast = document.getElementById('toast');
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(this._tt);
        this._tt = setTimeout(() => toast.classList.remove('show'), 2500);
    }
};

// تحقق تلقائي عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('royal_admin_auth') === 'true') {
        document.getElementById('loginOverlay').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        Admin.init();
    }
    document.getElementById('passwordInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') Admin.checkPassword();
    });
});