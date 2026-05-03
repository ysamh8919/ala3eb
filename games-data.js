// ==================== Games Data ====================
const GamesData = {
    games: [
        {
            id: 'slots',
            name: 'ماكينة السلوتس',
            icon: '🎰',
            type: 'حظ',
            minBet: 10,
            maxBet: 500,
            isHot: true,
            description: 'أدر العجلة واربح الجائزة الكبرى! 3 رموز متطابقة = فوز'
        },
        {
            id: 'blackjack',
            name: 'بلاك جاك',
            icon: '♠️',
            type: 'مهارة',
            minBet: 20,
            maxBet: 1000,
            isHot: true,
            description: 'اقترب من 21 بدون ما تعديها! العب ضد الموزع'
        },
        {
            id: 'poker',
            name: 'بوكر',
            icon: '🃏',
            type: 'مهارة',
            minBet: 50,
            maxBet: 2000,
            isHot: false,
            description: 'كوّن أفضل يد ورق واربح! ضد AI أو أصدقائك'
        },
        {
            id: 'luckywheel',
            name: 'عجلة الحظ',
            icon: '🎡',
            type: 'حظ',
            minBet: 10,
            maxBet: 300,
            isHot: true,
            description: 'دور العجلة واربح جوائز متنوعة! مضاعفات حتى 10x'
        },
        {
            id: 'dice',
            name: 'النرد',
            icon: '🎲',
            type: 'حظ',
            minBet: 5,
            maxBet: 200,
            isHot: false,
            description: 'توقع الرقم واربح! احتمالات مختلفة ومضاعفات متنوعة'
        },
        {
            id: 'crash',
            name: 'كراش',
            icon: '📈',
            type: 'مهارة',
            minBet: 10,
            maxBet: 500,
            isHot: true,
            description: 'الصاروخ بيطلع... اسحب فلوسك قبل ما ينفجر!'
        }
    ],

    getGame(id) {
        return this.games.find(g => g.id === id);
    },

    getAll() {
        return this.games;
    }
};