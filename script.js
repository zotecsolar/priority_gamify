// Get all the task elements and slots
const tasks = document.querySelectorAll('.task');
const slots = document.querySelectorAll('.slot');

// Add drag event listeners to tasks
tasks.forEach(task => {
    task.addEventListener('dragstart', dragStart);
    task.addEventListener('dragend', dragEnd);
});

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hidden');
    }, 0);
}

function dragEnd(e) {
    e.target.classList.remove('hidden');
}

// Add event listeners for the drop zones (slots)
slots.forEach(slot => {
    slot.addEventListener('dragover', dragOver);
    slot.addEventListener('drop', dropTask);
});

function dragOver(e) {
    e.preventDefault();
}

function dropTask(e) {
    const taskId = e.dataTransfer.getData('text/plain');
    const task = document.getElementById(taskId);
    e.target.appendChild(task);
}


function calculatePriority() {
    let score = 0;
    slots.forEach((slot, index) => {
        const tasksInSlot = slot.querySelectorAll('.task');
        tasksInSlot.forEach(() => {
            score += (5 - index); // Higher slots give more points
        });
    });
    alert(`Current Priority Score: ${score}`);
}

// Add a button to calculate the priority score
const calculateButton = document.createElement('button');
calculateButton.textContent = 'Calculate Priority Score';
calculateButton.addEventListener('click', calculatePriority);
document.body.appendChild(calculateButton);
