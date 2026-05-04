// تسجيل Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.log('Service Worker Error:', err));
    });
}

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // عرض شاشة البداية
    setTimeout(() => {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        
        // تحميل البيانات
        updateAllScreens();
    }, 2000);
    
    // إغلاق النوافذ عند النقر خارجها
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}

// التنقل بين الشاشات
function navigateTo(screenName) {
    // إخفاء جميع الشاشات
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // إظهار الشاشة المطلوبة
    const screen = document.getElementById(`${screenName}-screen`);
    if (screen) {
        screen.classList.add('active');
    }
    
    // تحديث أزرار التنقل
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const navBtns = document.querySelectorAll('.nav-btn');
    const screenIndex = ['home', 'tasks', 'habits', 'stats'].indexOf(screenName);
    if (screenIndex >= 0 && navBtns[screenIndex]) {
        navBtns[screenIndex].classList.add('active');
    }
    
    // تحديث المحتوى
    updateScreenContent(screenName);
    
    // التمرير للأعلى
    document.querySelector('.screen-content')?.scrollTo(0, 0);
}

// تحديث محتوى الشاشة
function updateScreenContent(screenName) {
    switch(screenName) {
        case 'home':
            updateHomeScreen();
            break;
        case 'tasks':
            renderTasks();
            break;
        case 'habits':
            renderHabits();
            break;
        case 'stats':
            updateStats();
            break;
    }
}

// تحديث جميع الشاشات
function updateAllScreens() {
    updateHomeScreen();
    updateStats();
}

// تحديث الشاشة الرئيسية
function updateHomeScreen() {
    const data = getAppData();
    
    // تحديث التاريخ
    updateDates();
    
    // تحديث النقاط في الهيدر
    document.getElementById('home-points').textContent = data.points;
    document.getElementById('header-points').textContent = data.points;
    
    // نسبة الإنجاز
    const totalTasks = data.tasks.length;
    const completedTasks = data.tasks.filter(t => t.completed).length;
    const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
    
    document.getElementById('completion-percentage').textContent = percentage + '%';
    document.getElementById('tasks-completed-text').textContent = 
        `${completedTasks} من ${totalTasks} مهام مكتملة`;
    
    // تحديث دائرة التقدم
    const circle = document.getElementById('progress-circle-fill');
    if (circle) {
        const circumference = 100;
        circle.style.strokeDashoffset = circumference - (percentage * circumference / 100);
    }
    
    // تحديث المستوى
    const pointsSystem = new PointsSystem();
    pointsSystem.points = data.points;
    
    const currentLevel = pointsSystem.getCurrentLevel();
    document.getElementById('level-badge').textContent = `مستوى ${currentLevel.level}`;
    document.getElementById('level-badge').style.backgroundColor = currentLevel.color;
    
    const progress = pointsSystem.getProgress();
    document.getElementById('level-progress-fill').style.width = progress + '%';
    
    const nextLevel = pointsSystem.getNextLevel();
    if (nextLevel) {
        document.getElementById('level-points-text').textContent = 
            `${data.points}/${nextLevel.pointsRequired} نقطة`;
    } else {
        document.getElementById('level-points-text').textContent = 
            `${data.points} نقطة - أقصى مستوى`;
    }
    
    // تحديث الإحصائيات المصغرة
    document.getElementById('streak-count').textContent = data.streak || 0;
    document.getElementById('total-completed').textContent = completedTasks;
    document.getElementById('habits-count').textContent = data.habits.length;
}

// تحديث التواريخ
function updateDates() {
    const now = new Date();
    const weekdays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const months = ['يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    
    const dateStr = `${weekdays[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    document.getElementById('current-date').textContent = dateStr;
    document.getElementById('gregorian-date').textContent = dateStr;
}

// عرض رسالة Toast
function showToast(message) {
    const toast = document.getElementById('notification-toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    clearTimeout(toast.hideTimeout);
    toast.hideTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// معالجة زر الرجوع في المتصفح
window.addEventListener('popstate', () => {
    navigateTo('home');
});