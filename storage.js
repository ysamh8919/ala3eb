class StorageManager {
    constructor() {
        this.prefix = 'dg_';
    }

    save(key, data) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Error saving data:', e);
            return false;
        }
    }

    load(key) {
        try {
            const data = localStorage.getItem(this.prefix + key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Error loading data:', e);
            return null;
        }
    }

    remove(key) {
        localStorage.removeItem(this.prefix + key);
    }

    clear() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }
}

const storage = new StorageManager();

// البيانات الافتراضية
const defaultData = {
    tasks: [],
    habits: [],
    points: 0,
    level: 1,
    streak: 0,
    lastActiveDate: null,
    completedTasksCount: 0,
    weeklyCompletions: [],
    bestDay: null
};

// تحميل البيانات عند بدء التطبيق
function loadAppData() {
    let data = storage.load('appData');
    if (!data) {
        data = { ...defaultData };
        storage.save('appData', data);
    }
    return data;
}

// حفظ البيانات
function saveAppData(data) {
    storage.save('appData', data);
}

// الحصول على نسخة من البيانات
function getAppData() {
    return { ...loadAppData() };
}