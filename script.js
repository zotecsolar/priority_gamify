// GitHub Repo and Token Configuration
const GITHUB_USERNAME = 'zotecsolar';
const GITHUB_REPOSITORY = 'priority_gamify';
let GITHUB_TOKEN = '';  // Leave it empty for now


// Function to load the task state from GitHub
async function loadStateFromGitHub() {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/contents/state.json`, {
        headers: {
            'Accept': 'application/vnd.github.v3.raw',
            'Authorization': `token ${GITHUB_TOKEN}`
        }
    });

    const data = await response.json();
    return data;
}

// Function to save the task state back to GitHub
async function saveStateToGitHub(state) {
    const stateData = btoa(JSON.stringify(state));  // Convert state object to Base64 string
    
    // First, get the file's current SHA (required by GitHub for file updates)
    const getFileResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/contents/state.json`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${GITHUB_TOKEN}`
        }
    });

    const fileData = await getFileResponse.json();
    const fileSha = fileData.sha;  // Get the SHA of the file for updating

    // Now, update the file with the new state
    const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPOSITORY}/contents/state.json`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            message: 'Update task state',
            content: stateData,  // Base64-encoded task state
            sha: fileSha  // The SHA of the previous file version
        })
    });

    const result = await response.json();
    console.log('State updated on GitHub:', result);
}

// Function to create task elements
function createTaskElement(taskText) {
    const task = document.createElement('div');
    task.classList.add('task');
    task.setAttribute('draggable', 'true');
    task.textContent = taskText;
    task.id = taskText;  // Set the ID to the task name for identification
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
    return task;
}

// Function to handle drag start
function dragStart(e) {
    e.dataTransfer.setData('text', e.target.id);
}

// Function to handle drag end
function dragEnd(e) {
    saveCurrentState();  // Save the state each time a task is moved
}

// Function to handle drag over a slot (needed to allow dropping)
function dragOver(e) {
    e.preventDefault();
}

// Function to handle dropping tasks into slots with the rule that prevents moving up
function dropTask(e) {
    e.preventDefault();
    
    const taskId = e.dataTransfer.getData('text');
    const task = document.getElementById(taskId);
    
    const currentSlot = task.parentElement;
    const targetSlot = e.target;
    
    // Get the current and target slot numbers
    const currentSlotNumber = currentSlot.id ? parseInt(currentSlot.id.split('-')[1]) : null;
    const targetSlotNumber = parseInt(targetSlot.id.split('-')[1]);
    
    // Check if the task is moving to a lower or equal priority slot (higher number)
    if (currentSlotNumber === null || targetSlotNumber >= currentSlotNumber) {
        targetSlot.appendChild(task);  // Move the task to the new slot
        saveCurrentState();  // Save the updated state
    } else {
        alert("You can only move tasks down, not up!");  // Prevent upward movement
    }
}

// Load the task state and populate the tasks and slots
window.onload = async function() {
    const state = await loadStateFromGitHub();
    
    // Populate left column tasks
    state.leftTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        document.getElementById('left-tasks').appendChild(taskElement);
    });

    // Populate right column tasks
    state.rightTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        document.getElementById('right-tasks').appendChild(taskElement);
    });

    // Populate priority slots
    for (const slotId in state.slots) {
        const slot = document.getElementById(slotId);
        state.slots[slotId].forEach(task => {
            const taskElement = createTaskElement(task);
            slot.appendChild(taskElement);
        });
    }
};

// Save the current state to GitHub
function saveCurrentState() {
    const newState = {
        leftTasks: getTaskList('left-tasks'),
        rightTasks: getTaskList('right-tasks'),
        slots: {}
    };

    // Get the tasks from each slot and save them in the state
    for (let i = 1; i <= 10; i++) {
        newState.slots[`slot-${i}`] = getTaskList(`slot-${i}`);
    }

    // Save the new state to GitHub
    saveStateToGitHub(newState);
}

// Helper function to get task list from a specific container
function getTaskList(containerId) {
    const container = document.getElementById(containerId);
    return Array.from(container.children).map(task => task.id);
}

// Add drag-and-drop event listeners to all priority slots
document.querySelectorAll('.slot').forEach(slot => {
    slot.addEventListener('dragover', dragOver);
    slot.addEventListener('drop', dropTask);
});
