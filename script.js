// Predefined tasks
const tasks = [
	'Preventivatore (Digitalizzazione)',
	'Native APPs (Digitalizzazione)',
	'Chabot (Digitalizzazione)',
	'Inventario (Magazzino)',
	'Listini (Contabilità)',
	'Documenti Firmabili (Contabilità)',
	'Visibilità Organica (Branding)',
	'Customer Engagement (Branding)',
	'Supporto Sopralluoghi (Installazioni)',
	'Assistenza (Installazioni)',
	'Assistenza (Rete Vendita)',
	'Supporto Sopralluoghi (Rete Vendita)',
	'Supporto Preventivazione (Rete Vendite)',
	'Lead Generated (Rete Vendite)',
	'Ticketing/Tasks (Business Flow)',
	'CRM/ERP System (Business Flow)',
	'Algoritmo di Automazione (Business Flow)',
	'Index (Data Center)',
	'Open API (Data Center)'
];

// Function to divide tasks between left and right columns
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
    e.preventDefault();
}

function dropTask(e) {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData('text');
    const task = document.getElementById(taskId);
    
    const currentSlot = task.parentElement;
    const targetSlot = e.target;
    
    // Get slot numbers (assuming slots are named slot-1, slot-2, etc.)
    const currentSlotNumber = parseInt(currentSlot.id.split('-')[1]);
    const targetSlotNumber = parseInt(targetSlot.id.split('-')[1]);

    // Allow drop only if task is moved to a lower slot (higher number)
    if (targetSlotNumber >= currentSlotNumber || !currentSlot.classList.contains('slot')) {
        targetSlot.appendChild(task); // Move task to target slot
        saveState(); // Save the new state
    } else {
        alert("You can only move tasks down, not up!");
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
