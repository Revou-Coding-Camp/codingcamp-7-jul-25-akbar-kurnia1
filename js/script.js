const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const dateInput = document.getElementById('date-input');
const taskList = document.getElementById('task-list');
const showCompletedBtn = document.getElementById('show-completed-btn');
const showAllBtn = document.getElementById('show-all-btn');
const deleteAllBtn = document.getElementById('delete-all-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === 'completed') {
            return task.completed;
        }
        return true;
    });

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<p class="text-center text-gray-500">Task is Empty!</p>`;
        return;
    }

    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'flex justify-between items-center py-3 border-b border-gray-300';
        
        const taskInfo = document.createElement('div');
        taskInfo.className = 'flex-grow pr-4';
        taskInfo.style.cursor = 'pointer';
        taskInfo.dataset.id = task.id;
        taskInfo.dataset.action = 'toggle';

        const titleElement = document.createElement('p');
        titleElement.className = 'font-semibold';
        titleElement.textContent = task.title;

        if (task.completed) {
            titleElement.classList.add('line-through', 'text-gray-400');
        }
        
        taskInfo.appendChild(titleElement);

        if (task.dueDate) {
            const dateElement = document.createElement('p');
            dateElement.className = 'text-sm text-gray-600';
            dateElement.textContent = task.dueDate;
            if (task.completed) {
                dateElement.classList.add('line-through', 'text-gray-400');
            }
            taskInfo.appendChild(dateElement);
        }

        const deleteButton = document.createElement('button');
        deleteButton.dataset.id = task.id;
        deleteButton.dataset.action = 'delete';
        deleteButton.className = 'bg-red-500 text-white text-sm py-1 px-3 rounded hover:bg-red-600';
        deleteButton.textContent = 'Delete';

        taskElement.appendChild(taskInfo);
        taskElement.appendChild(deleteButton);
        taskList.appendChild(taskElement);
    });
}

function addTask(event) {
    event.preventDefault();

    const taskTitle = taskInput.value.trim();
    if (taskTitle === '') {
        alert('Task title cannot be empty!');
        return;
    }

    const newTask = {
        id: Date.now(),
        title: taskTitle,
        dueDate: dateInput.value,
        completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    dateInput.value = '';
    saveTasks();
    renderTasks();
}

function handleTaskListClick(event) {
    const target = event.target.closest('[data-action]');

    if (!target) return;

    const action = target.dataset.action;
    const taskId = target.dataset.id;

    if (action === 'toggle') {
        const task = tasks.find(t => t.id == taskId);
        if (task) {
            task.completed = !task.completed;
        }
    } else if (action === 'delete') {
        tasks = tasks.filter(t => t.id != taskId);
    }

    saveTasks();
    renderTasks();
}

if (taskForm) {
    taskForm.addEventListener('submit', addTask);
}
if (taskList) {
    taskList.addEventListener('click', handleTaskListClick);
}
if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
        currentFilter = 'all';
        renderTasks();
    });
}
if (showCompletedBtn) {
    showCompletedBtn.addEventListener('click', () => {
        currentFilter = 'completed';
        renderTasks();
    });
}
if (deleteAllBtn) {
    deleteAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    console.log("JavaScript is running from script.js!");
});
