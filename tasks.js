let currentTaskType = 'personal';
let currentFilter = 'all';

// عرض نافذة إضافة مهمة
function showAddTaskModal() {
    document.getElementById('task-modal').classList.add('show');
    document.getElementById('task-text').focus();
}

// إغلاق النافذة
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    document.getElementById('task-text').value = '';
    document.getElementById('task-time').value = '';
    currentTaskType = 'personal';
    resetTypeButtons();
}

// اختيار نوع المهمة
function selectType(type) {
    currentTaskType = type;
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.type === type) {
            btn.classList.add('selected');
        }
    });
}

function resetTypeButtons() {
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.type === 'personal') {
            btn.classList.add('selected');
        }
    });
}

// إضافة مهمة جديدة
function addTask() {
    const taskText = document.getElementById('task-text').value.trim();
    const taskTime = document.getElementById('task-time').value;
    
    if (!taskText) {
        showToast('⚠️ يرجى إدخال نص المهمة');
        return;
    }

    const data = getAppData();
    
    const newTask = {
        id: Date.now().toString(),
        text: taskText,
        type: currentTaskType,
        time: taskTime || null,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };
    
    data.tasks.push(newTask);
    saveAppData(data);
    
    closeModal('task-modal');
    renderTasks();
    showToast('✅ تمت إضافة المهمة بنجاح');
    updateHomeScreen();
}

// تغيير حالة المهمة
function toggleTask(taskId) {
    const data = getAppData();
    const task = data.tasks.find(t => t.id === taskId);
    
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        
        // إضافة أو خصم النقاط
        const action = task.completed ? 'task_complete' : 'task_missed';
        const pointsSystem = new PointsSystem();
        pointsSystem.points = data.points;
        const result = pointsSystem.addPoints(action);
        
        data.points = result.totalPoints;
        data.level = result.level;
        data.completedTasksCount = data.tasks.filter(t => t.completed).length;
        
        saveAppData(data);
        renderTasks();
        updateHomeScreen();
        
        if (task.completed) {
            showToast(`🌟 +${result.points} نقطة`);
        }
        
        if (result.leveledUp) {
            showToast(`🎉 مبروك! وصلت للمستوى ${result.level}`);
        }
    }
}

// حذف مهمة
function deleteTask(taskId) {
    if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
        const data = getAppData();
        data.tasks = data.tasks.filter(t => t.id !== taskId);
        data.completedTasksCount = data.tasks.filter(t => t.completed).length;
        saveAppData(data);
        renderTasks();
        updateHomeScreen();
        showToast('🗑️ تم حذف المهمة');
    }
}

// عرض المهام
function renderTasks() {
    const data = getAppData();
    const tasksList = document.getElementById('tasks-list');
    const emptyState = document.getElementById('empty-tasks');
    
    let tasks = data.tasks;
    
    // تطبيق الفلتر
    if (currentFilter === 'completed') {
        tasks = tasks.filter(t => t.completed);
    } else if (currentFilter === 'pending') {
        tasks = tasks.filter(t => !t.completed);
    }
    
    // ترتيب المهام: غير المكتملة أولاً
    tasks.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });
    
    if (tasks.length === 0) {
        tasksList.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    const typeLabels = {
        study: '📚 دراسة',
        sport: '⚽ رياضة',
        worship: '🕌 عبادة',
        personal: '👤 شخصي'
    };
    
    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-checkbox" onclick="toggleTask('${task.id}')">
                ${task.completed ? '✓' : ''}
            </div>
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-meta">
                    <span class="task-type-badge">${typeLabels[task.type] || task.type}</span>
                    ${task.time ? `<span>🕐 ${task.time}</span>` : ''}
                </div>
            </div>
            <button class="task-delete" onclick="deleteTask('${task.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// فلترة المهام
function toggleFilter() {
    const filterTabs = document.getElementById('filter-tabs');
    filterTabs.style.display = filterTabs.style.display === 'none' ? 'flex' : 'none';
}

function filterTasks(filter) {
    currentFilter = filter;
    
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.includes(filter === 'all' ? 'الكل' : filter === 'pending' ? 'قيد' : 'مكتملة')) {
            tab.classList.add('active');
        }
    });
    
    renderTasks();
}