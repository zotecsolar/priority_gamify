// Predefined tasks
const tasks = [
    'Updated Task 1', 'Updated Task 2', 'Updated Task 3', 
    'Updated Task 4', 'Updated Task 5', 'Updated Task 6', 
    'Updated Task 7', 'Updated Task 8', 'Updated Task 9', 
    'Updated Task 10'
];

// Version key to track task changes
const versionKey = 'task_v1'; // Update this when tasks are changed

// Reset localStorage if version is updated
function checkAndResetStorage() {
    const savedVersion = localStorage.getItem('taskVersion');
    if (savedVersion !== versionKey) {
        localStorage.clear(); // Clear storage
        localStorage.setItem('taskVersion', versionKey); // Set new version
    }
}

checkAndResetStorage(); // Reset if necessary

// Function to distribute tasks
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
    task.id = taskText;
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
    return task;
}

// Add priority slots dynamically (10 slots)
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
    console.log("Drag Start: ", e.target.id);
}

function dragOver(e) {
    e.preventDefault(); // Allow drop
}

function dropTask(e) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text');
    const task = document.getElementById(taskId);
    
    // Check if task is already inside a slot
    const currentSlot = task.parentElement;
    if (e.target.classList.contains('slot')) {
        const targetSlotId = parseInt(e.target.id.split('-')[1], 10); // Get slot number from ID
        const currentSlotId = currentSlot.id ? parseInt(currentSlot.id.split('-')[1], 10) : null;

        // Allow only if moving to a lower or same slot, or from the task column
        if (currentSlotId === null || targetSlotId >= currentSlotId) {
            e.target.appendChild(task); // Append task to new slot
            saveState(); // Save new task positions
        } else {
            console.log("Cannot move to a higher slot.");
        }
    }
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

// Get task IDs from container
function getTaskList(containerId) {
    const container = document.getElementById(containerId);
    return Array.from(container.children).map(task => task.id);
}

// Load saved state
function loadState() {
    const savedState = JSON.parse(localStorage.getItem('taskState'));
    if (savedState) {
        loadTasks('left-tasks', savedState.leftTasks);
        loadTasks('right-tasks', savedState.rightTasks);
        for (let i = 1; i <= tasks.length; i++) {
            loadTasks(`slot-${i}`, savedState.slots[`slot-${i}`]);
        }
    } else {
        distributeTasks(); // Distribute tasks if no saved state
    }
}

// Load tasks into a container
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
