const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskListEl = document.getElementById('task-list');
const deleteAllBtn = document.getElementById('delete-all-btn');
const filterButtons = document.getElementById('filter-buttons');
const sortSelect = document.getElementById('sort-select');
const notification = document.getElementById('notification');
const messageEl = document.getElementById('notification-message');

const confirmModal = document.getElementById('confirm-modal');
const confirmModalBox = confirmModal.querySelector('div');
const confirmModalTitle = confirmModal.querySelector('h3');
const confirmModalMessage = confirmModal.querySelector('p');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');

const alertModal = document.getElementById('alert-modal');
const alertModalBox = alertModal.querySelector('div');
const alertMessage = document.getElementById('alert-message');
const alertOkBtn = document.getElementById('alert-ok-btn');


let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let currentSort = 'dueDate';

let taskToDelete = null; 

const updateAndRender = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
};

const showNotification = (msg) => {
    messageEl.textContent = msg;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
};

const createTaskElement = (task) => {
    const div = document.createElement('div');
    div.className = `task-item flex justify-between items-center p-3 rounded-lg transition-colors duration-300 border-b border-purple-800 hover:bg-purple-900/50`;
    if (task.completed) {
        div.classList.add('completed');
    }

    const due = new Date(task.dueDate);

    const leftSide = document.createElement('div');
    leftSide.className = 'flex items-center space-x-4 flex-grow';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = `toggle-btn text-xl transition-colors duration-300 ${task.completed ? 'text-green-400' : 'text-gray-400 hover:text-green-300'}`;
    toggleBtn.innerHTML = `<i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i>`;
    toggleBtn.setAttribute('aria-label', task.completed ? 'Tandai sebagai belum selesai' : 'Tandai sebagai selesai');
    toggleBtn.addEventListener('click', () => {
        task.completed = !task.completed;
        updateAndRender();
    });

    const textDiv = document.createElement('div');
    textDiv.className = 'flex-grow';

    const taskText = document.createElement('span');
    taskText.className = `font-medium ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`;
    taskText.textContent = task.task;

    const dueDateText = document.createElement('span');
    dueDateText.className = 'text-sm text-purple-300 block';
    dueDateText.innerHTML = `<i class="fas fa-clock mr-1"></i> ${due.toLocaleDateString('id-ID')} ${due.toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}`;

    textDiv.append(taskText, dueDateText);
    leftSide.append(toggleBtn, textDiv);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn text-red-500 hover:text-red-400 transition-colors duration-300 ml-4';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.setAttribute('aria-label', `Hapus tugas: ${task.task}`);
    
    deleteBtn.addEventListener('click', () => {
        
        taskToDelete = task;
        
        confirmModalTitle.textContent = 'Hapus Tugas Ini?';
        confirmModalMessage.textContent = `Apakah Anda yakin ingin menghapus tugas "${task.task}"?`;
        
        showConfirmModal();
    });

    div.append(leftSide, deleteBtn);
    return div;
};

const displayTasks = () => {
    taskListEl.innerHTML = '';

    const filteredTasks = tasks.filter(t => {
        if (currentFilter === 'active') return !t.completed;
        if (currentFilter === 'completed') return t.completed;
        return true;
    });

    const sortedTasks = filteredTasks.sort((a, b) => {
        switch (currentSort) {
            case 'dueDate':
                return new Date(a.dueDate) - new Date(b.dueDate);
            case 'alphabet':
                return a.task.localeCompare(b.task);
            case 'createdAt':
                return new Date(a.createdAt) - new Date(b.createdAt);
            default:
                return 0;
        }
    });

    if (sortedTasks.length === 0) {
        taskListEl.innerHTML = '<p class="text-center text-gray-400">Tidak ada tugas ditemukan.</p>';
    } else {
        sortedTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskListEl.appendChild(taskElement);
        });
    }
};


const showConfirmModal = () => {
    confirmModal.classList.remove('hidden');
    setTimeout(() => confirmModalBox.classList.remove('scale-95'), 10); 
};

const hideConfirmModal = () => {
    confirmModalBox.classList.add('scale-95');
    setTimeout(() => {
        confirmModal.classList.add('hidden');
        
        taskToDelete = null;
    }, 300);
};

const showAlertModal = (msg) => {
    alertMessage.textContent = msg;
    alertModal.classList.remove('hidden');
    setTimeout(() => alertModalBox.classList.remove('scale-95'), 10);
};

const hideAlertModal = () => {
    alertModalBox.classList.add('scale-95');
    setTimeout(() => alertModal.classList.add('hidden'), 300);
};

addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    const date = dueDateInput.value;
    if (!text || !date) {
        return showNotification('Isi tugas dan tanggal jatuh tempo!');
    }
    tasks.unshift({
        task: text,
        dueDate: date,
        completed: false,
        createdAt: new Date().toISOString()
    });
    taskInput.value = '';
    dueDateInput.value = '';
    updateAndRender();
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTaskBtn.click();
    }
});

deleteAllBtn.addEventListener('click', () => {
    if (tasks.length === 0) {
        return showAlertModal('Tidak ada tugas untuk dihapus.');
    }
   
    taskToDelete = null;
    
    confirmModalTitle.textContent = 'Apakah Anda Yakin?';
    confirmModalMessage.textContent = 'Tindakan ini akan menghapus semua tugas secara permanen dan tidak dapat dibatalkan.';
    showConfirmModal();
});

cancelDeleteBtn.addEventListener('click', hideConfirmModal);

confirmDeleteBtn.addEventListener('click', () => {
    if (taskToDelete) {
        tasks = tasks.filter(t => t.createdAt !== taskToDelete.createdAt);
    } else {
        tasks = [];
    }
    updateAndRender();
    hideConfirmModal();
});

confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        hideConfirmModal();
    }
});

alertOkBtn.addEventListener('click', hideAlertModal);

alertModal.addEventListener('click', (e) => {
    if (e.target === alertModal) {
        hideAlertModal();
    }
});


filterButtons.addEventListener('click', (e) => {
    const btn = e.target.closest('button.filter-btn');
    if (!btn) return;

    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('bg-purple-800', 'text-yellow-400');
        b.classList.add('hover:bg-purple-700', 'text-white');
    });
    btn.classList.add('bg-purple-800', 'text-yellow-400');
    btn.classList.remove('hover:bg-purple-700', 'text-white');

    currentFilter = btn.dataset.filter;
    displayTasks();
});

sortSelect.addEventListener('change', () => {
    currentSort = sortSelect.value;
    displayTasks();
});

displayTasks();
