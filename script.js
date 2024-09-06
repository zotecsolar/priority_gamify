// Predefined tasks
const tasks = [
    'Task 1', 'Task 2', 'Task 3', 'Task 4', 'Task 5', 
    'Task 6', 'Task 7', 'Task 8', 'Task 9', 'Task 10'
];

<<<<<<< HEAD
// Function to divide tasks between left and right columns
=======
// Version key to track task changes
const versionKey = 'task_v2'; // Update this when tasks are changed

// Reset localStorage if version is updated
function checkAndResetStorage() {
    const savedVersion = localStorage.getItem('taskVersion');
    if (savedVersion !== versionKey) {
        localStorage.clear(); // Clear storage
        localStorage.setItem('taskVersion', versionKey); // Set new version
    }
}

checkAndResetStorage(); // Reset if necessary

// Function to distribute tasks to left and right columns
>>>>>>> f4c674d3a4e0e032ad9886f7ac33278bcd9ad766
function distributeTasks() {
    const leftTasks = document.getElementById('left-tasks');
    const rightTasks = document.getElementById('right-tasks');
    
    tasks.forEach((task, index) => {
        const taskElement = createTaskElement(task);
        if (index % 2 === 0) {
            leftTasks.appendChild(taskElement);
        } else {
            rightTasks.appendChild(taskElement);
        }
    });
}

// Function to create a task element
function createTaskElement(taskText) {
    const task = document.createElement('div');
    task.classList.add('task');
    task.setAttribute('draggable', 'true');
    task.textContent = taskText;
    task.id = taskText; // Set ID to match task text for saving state
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
    return task;
}

// Add priority slots dynamically (now 10 slots)
function createPrioritySlots() {
    const prioritySlots = document.getElementById('priority-slots');
    for (let i = 1; i <= tasks.length; i++) {
        const slot = document.createElement('div');
        slot.classList.add('slot');
        slot.id = `slot-${i}`;
        slot.addEventListener('dragover', dragOver);
        slot.addEventListener('drop', dropTask);
        prioritySlots.appendChild(slot);
    }
}

// Drag-and-drop functions
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function dragOver(e) {
    e.preventDefault(); // Allow drop
}

function dropTask(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text');
    const task = document.getElementById(taskId);
<<<<<<< HEAD
    e.target.appendChild(task);
    saveState();
=======
    const currentSlot = task.parentElement;

    // Allow drop only in slots, not columns
    if (!e.target.classList.contains('slot')) {
        return; // Don't allow the task to move back to columns
    }

    const targetSlotId = parseInt(e.target.id.split('-')[1], 10); // Get slot number from target slot
    const currentSlotId = currentSlot.id ? parseInt(currentSlot.id.split('-')[1], 10) : null;

    // Allow only if moving to a lower or same slot, or if coming from a column (null currentSlotId)
    if (currentSlotId === null || targetSlotId >= currentSlotId) {
        e.target.appendChild(task); // Append the task to the new slot
        saveState(); // Save new task positions
    } else {
        console.log("Cannot move to a higher slot."); // Prevent upward movement
    }
>>>>>>> f4c674d3a4e0e032ad9886f7ac33278bcd9ad766
}

function dragEnd() {
    saveState();
}

// Save the current state of tasks and slots
function saveState() {
    const state = {
        leftTasks: getTaskList('left-tasks'),
        rightTasks: getTaskList('right-tasks'),
        slots: {}
    };
    for (let i = 1; i <= tasks.length; i++) {
        state.slots[`slot-${i}`] = getTaskList(`slot-${i}`);
    }
    localStorage.setItem('taskState', JSON.stringify(state));
}

// Helper function to get task IDs from a container
function getTaskList(containerId) {
    const container = document.getElementById(containerId);
    return Array.from(container.children).map(task => task.id);
}

// Load the saved state from localStorage
function loadState() {
    const savedState = JSON.parse(localStorage.getItem('taskState'));
    if (savedState) {
        // Load left and right columns
        loadTasks('left-tasks', savedState.leftTasks);
        loadTasks('right-tasks', savedState.rightTasks);
        
        // Load priority slots
        for (let i = 1; i <= tasks.length; i++) {
            loadTasks(`slot-${i}`, savedState.slots[`slot-${i}`]);
        }
    } else {
        distributeTasks(); // If no saved state, distribute tasks
    }
}

// Helper function to load tasks into a container
function loadTasks(containerId, taskList) {
    const container = document.getElementById(containerId);
    taskList.forEach(taskText => {
        const taskElement = createTaskElement(taskText);
        container.appendChild(taskElement);
    });
}

// Initialize the app
window.onload = function () {
    createPrioritySlots();
    loadState();
};
