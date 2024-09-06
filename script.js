// Get task columns and slots
const leftTasks = document.getElementById('left-tasks');
const rightTasks = document.getElementById('right-tasks');
const slots = document.querySelectorAll('.slot');
const addTaskButton = document.getElementById('add-task');

// Event listeners for adding tasks
addTaskButton.addEventListener('click', () => {
    const newTaskInput = document.getElementById('new-task');
    const taskText = newTaskInput.value.trim();
    
    if (taskText) {
        const task = createTaskElement(taskText);
        leftTasks.appendChild(task);  // Add task to left column
        newTaskInput.value = '';
        saveState();
    }
});

// Create draggable task element
function createTaskElement(text) {
    const task = document.createElement('div');
    task.classList.add('task');
    task.setAttribute('draggable', 'true');
    task.textContent = text;
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
    return task;
}

// Drag and Drop functions
function dragStart(e) {
    e.dataTransfer.setData('text', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hidden');
    }, 0);
}

function dragEnd(e) {
    e.target.classList.remove('hidden');
}

slots.forEach(slot => {
    slot.addEventListener('dragover', dragOver);
    slot.addEventListener('drop', dropTask);
});

function dragOver(e) {
    e.preventDefault();
}

function dropTask(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text');
    const task = document.getElementById(taskId);
    e.target.appendChild(task);
    saveState();
}

// Save task states
function saveState() {
    const taskData = {
        left: getTasksFromColumn(leftTasks),
        right: getTasksFromColumn(rightTasks),
        slots: []
    };
    slots.forEach((slot, index) => {
        taskData.slots[index] = getTasksFromColumn(slot);
    });
    localStorage.setItem('taskData', JSON.stringify(taskData));
}

function getTasksFromColumn(column) {
    return Array.from(column.children).map(task => task.textContent);
}

// Load saved state
function loadState() {
    const savedData = JSON.parse(localStorage.getItem('taskData'));
    if (savedData) {
        loadTasks(savedData.left, leftTasks);
        loadTasks(savedData.right, rightTasks);
        slots.forEach((slot, index) => {
            loadTasks(savedData.slots[index], slot);
        });
    }
}

function loadTasks(taskArray, column) {
    taskArray.forEach(taskText => {
        const task = createTaskElement(taskText);
        column.appendChild(task);
    });
}

// Initialize saved state on page load
window.onload = loadState;
