const LEVELS = [
    { level: 1, name: 'مبتدئ', pointsRequired: 0, color: '#A4B0BE' },
    { level: 2, name: 'نشط', pointsRequired: 100, color: '#4A90E2' },
    { level: 3, name: 'مجتهد', pointsRequired: 250, color: '#50C878' },
    { level: 4, name: 'محترف', pointsRequired: 500, color: '#FFA502' },
    { level: 5, name: 'خبير', pointsRequired: 1000, color: '#A55EEA' },
    { level: 6, name: 'بطل', pointsRequired: 2000, color: '#FF6B6B' },
    { level: 7, name: 'أسطورة', pointsRequired: 5000, color: '#FFD700' },
];

class PointsSystem {
    constructor() {
        this.points = 0;
        this.level = 1;
    }

    // إضافة نقاط
    addPoints(action) {
        const pointsMap = {
            'task_complete': 10,
            'all_tasks_complete': 50,
            'habit_streak': 20,
            'task_missed': -5
        };

        const points = pointsMap[action] || 0;
        this.points += points;
        
        const oldLevel = this.level;
        this.level = this.calculateLevel();
        
        return {
            points,
            totalPoints: this.points,
            level: this.level,
            leveledUp: this.level > oldLevel
        };
    }

    // حساب المستوى
    calculateLevel() {
        let currentLevel = LEVELS[0];
        for (let i = LEVELS.length - 1; i >= 0; i--) {
            if (this.points >= LEVELS[i].pointsRequired) {
                currentLevel = LEVELS[i];
                break;
            }
        }
        return currentLevel.level;
    }

    // الحصول على معلومات المستوى الحالي
    getCurrentLevel() {
        return LEVELS.find(l => l.level === this.level) || LEVELS[0];
    }

    // الحصول على المستوى التالي
    getNextLevel() {
        const currentIndex = LEVELS.findIndex(l => l.level === this.level);
        return currentIndex < LEVELS.length - 1 ? LEVELS[currentIndex + 1] : null;
    }

    // حساب نسبة التقدم
    getProgress() {
        const currentLevel = this.getCurrentLevel();
        const nextLevel = this.getNextLevel();
        
        if (!nextLevel) return 100;
        
        return Math.round(
            ((this.points - currentLevel.pointsRequired) / 
            (nextLevel.pointsRequired - currentLevel.pointsRequired)) * 100
        );
    }
}