// تحديث الإحصائيات
function updateStats() {
    const data = getAppData();
    
    // المهام المكتملة
    document.getElementById('stats-completed').textContent = 
        data.tasks.filter(t => t.completed).length;
    
    // أيام متتالية
    document.getElementById('stats-streak').textContent = 
        data.streak || 0;
    
    // نسبة الإنجاز الأسبوعي
    const weeklyRate = calculateWeeklyRate(data);
    document.getElementById('stats-weekly').textContent = 
        weeklyRate + '%';
    
    // أكثر يوم إنتاجية
    const bestDay = getMostProductiveDay(data);
    document.getElementById('stats-best-day').textContent = 
        bestDay || 'لم تسجل بعد';
}

// حساب نسبة الإنجاز الأسبوعي
function calculateWeeklyRate(data) {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    
    const weeklyTasks = data.tasks.filter(t => 
        new Date(t.createdAt) >= weekStart
    );
    
    if (weeklyTasks.length === 0) return 0;
    
    const completed = weeklyTasks.filter(t => t.completed).length;
    return Math.round((completed / weeklyTasks.length) * 100);
}

// الحصول على أكثر يوم إنتاجية
function getMostProductiveDay(data) {
    if (data.tasks.length === 0) return null;
    
    const dayCount = {};
    
    data.tasks.forEach(task => {
        if (task.completed && task.completedAt) {
            const day = new Date(task.completedAt).toDateString();
            dayCount[day] = (dayCount[day] || 0) + 1;
        }
    });
    
    return Object.entries(dayCount)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}