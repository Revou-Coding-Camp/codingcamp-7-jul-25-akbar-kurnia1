const taskInput = document.getElementById('task-input');
const dueDateInput = document.getElementById('due-date-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskListEl = document.getElementById('task-list');
const deleteAllBtn = document.getElementById('delete-all-btn');
const filterButtons = document.getElementById('filter-buttons');
const notification = document.getElementById('notification');
const messageEl = document.getElementById('notification-message');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function showNotification(msg) {
  messageEl.textContent = msg;
  notification.classList.add('show');
  setTimeout(() => notification.classList.remove('show'), 3000);
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function displayTasks() {
  taskListEl.innerHTML = '';
  const filtered = tasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  if (filtered.length === 0) {
    taskListEl.innerHTML = '<p class="text-center text-gray-500">Tidak ada tugas ditemukan.</p>';
    return;
  }

  filtered.forEach(task => {
    const div = document.createElement('div');
    div.className = `task-item ${task.completed ? 'completed' : ''} flex justify-between items-center border-b pb-2`;
    div.innerHTML = `
      <div class="flex items-center space-x-3">
        <button class="toggle-btn text-xl ${task.completed ? 'text-green-500' : 'text-gray-400'}">
          <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
        </button>
        <div>
          <span class="font-medium">${task.task}</span><br>
          <span class="text-sm text-gray-500">${new Date(task.dueDate).toLocaleDateString('id-ID')}</span>
        </div>
      </div>
      <button class="delete-btn text-red-500"><i class="fas fa-trash"></i></button>
    `;
    div.querySelector('.toggle-btn').onclick = () => {
      task.completed = !task.completed;
      saveTasks();
      displayTasks();
    };
    div.querySelector('.delete-btn').onclick = () => {
      tasks = tasks.filter(t => t !== task);
      saveTasks();
      displayTasks();
    };
    taskListEl.appendChild(div);
  });
}

addTaskBtn.onclick = () => {
  const text = taskInput.value.trim();
  const date = dueDateInput.value;
  if (!text || !date) return showNotification('Isi tugas dan tanggal!');
  tasks.unshift({ task: text, dueDate: date, completed: false });
  saveTasks();
  displayTasks();
  taskInput.value = '';
  dueDateInput.value = '';
};

deleteAllBtn.onclick = () => {
  if (!confirm('Hapus semua tugas?')) return;
  tasks = [];
  saveTasks();
  displayTasks();
};

filterButtons.onclick = e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('bg-white', 'text-blue-600'));
  btn.classList.add('bg-white', 'text-blue-600');
  currentFilter = btn.dataset.filter;
  displayTasks();
};

displayTasks();