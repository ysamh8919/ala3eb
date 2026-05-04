let currentFrequency = 'daily';

// عرض نافذة إضافة عادة
function showAddHabitModal() {
    document.getElementById('habit-modal').classList.add('show');
    document.getElementById('habit-text').focus();
    currentFrequency = 'daily';
    resetFrequencyButtons();
}

// اختيار التكرار
function selectFrequency(freq) {
    currentFrequency = freq;
    document.querySelectorAll('.freq-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.freq === freq) {
            btn.classList.add('selected');
        }
    });
}

function resetFrequencyButtons() {
    document.querySelectorAll('.freq-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.freq === 'daily') {
            btn.classList.add('selected');
        }
    });
}

// إضافة عادة جديدة
function addHabit() {
    const habitText = document.getElementById('habit-text').value.trim();
    
    if (!habitText) {
        showToast('⚠️ يرجى إدخال اسم العادة');
        return;
    }

    const data = getAppData();
    
    const newHabit = {
        id: Date.now().toString(),
        name: habitText,
        frequency: currentFrequency,
        streak: 0,
        lastCompleted: null,
        completedDates: [],
        createdAt: new Date().toISOString()
    };
    
    data.habits.push(newHabit);
    saveAppData(data);
    
    closeModal('habit-modal');
    renderHabits();
    showToast('✅ تمت إضافة العادة بنجاح');
}

// إكمال عادة
function completeHabit(habitId) {
    const data = getAppData();
    const habit = data.habits.find(h => h.id === habitId);
    
    if (!habit) return;
    
    const today = new Date().toDateString();
    
    // التحقق من اكتمالها اليوم
    if (habit.lastCompleted === today) {
        showToast('⚠️ لقد أكملت هذه العادة اليوم بالفعل');
        return;
    }
    
    // تحديث التتابع
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (habit.lastCompleted === yesterday.toDateString()) {
        habit.streak++;
    } else {
        habit.streak = 1;
    }
    
    habit.lastCompleted = today;
    habit.completedDates.push(today);
    
    // إضافة نقاط
    const pointsSystem = new PointsSystem();
    pointsSystem.points = data.points;
    const result = pointsSystem.addPoints('habit_streak');
    
    data.points = result.totalPoints;
    data.level = result.level;
    
    saveAppData(data);
    renderHabits();
    updateHomeScreen();
    
    showToast(`🔥 ${habit.streak} يوم متتالي! +${result.points} نقطة`);
    
    if (result.leveledUp) {
        showToast(`🎉 مبروك! وصلت للمستوى ${result.level}`);
    }
}

// عرض العادات
function renderHabits() {
    const data = getAppData();
    const habitsList = document.getElementById('habits-list');
    const emptyState = document.getElementById('empty-habits');
    
    if (data.habits.length === 0) {
        habitsList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    const today = new Date().toDateString();
    
    habitsList.innerHTML = data.habits.map(habit => `
        <div class="habit-item">
            <div class="habit-top">
                <span class="habit-name">${habit.name}</span>
                <span class="habit-freq">
                    ${habit.frequency === 'daily' ? 'يومي' : 'أسبوعي'}
                </span>
            </div>
            <div class="habit-streak">
                <span>🔥</span>
                <span>${habit.streak} يوم متتالي</span>
            </div>
            <button 
                class="habit-complete-btn"
                ${habit.lastCompleted === today ? 'disabled' : ''}
                onclick="completeHabit('${habit.id}')"
            >
                ${habit.lastCompleted === today ? '✓ مكتملة اليوم' : 'إكمال العادة'}
            </button>
        </div>
    `).join('');
}