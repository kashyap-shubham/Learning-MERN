// Get modal, button, and close elements
const modal = document.getElementById('modal');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModal');
const taskInput = document.getElementById('taskInput');
const submitTaskBtn = document.getElementById('submitTaskBtn');


// Open the modal when the button is clicked
openModalBtn.onclick = function() {
    modal.style.display = "block";
}

// Close the modal when the close button (X) is clicked
closeModalBtn.onclick = function() {
    modal.style.display = "none";
}

function closeModal() {
    modal.style.display = "none";
}

// Close the modal if the user clicks outside the modal content
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Add a task when the submit button is clicked
submitTaskBtn.onclick = async function() {
    const task = taskInput.value;
    if (task !== "") {
        // fetch('/add-task', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         // authorization: 'Bearer ' + localStorage.getItem('token'),
        //         authorization: localStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         task: task,
        //         status: "created"
        //     })
        // }).then(response => response.json())
        // .then(data => console.log(data)); 
        
        const response = await fetch('/add-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // authorization: 'Bearer ' + localStorage.getItem('token'),
                authorization: localStorage.getItem('token')
            },
            body: JSON.stringify({
                task: task,
                status: "created"
            })
        });

        const data = await response.json();
        console.log(data);

        if(!data.status === "201") {
            alert(data.message);
            closeModal();
            return;
        }

        addTask(task);
        taskInput.value = "";
        closeModal();
    }
}

function addTask(task) {
    const boardColumn = document.querySelector('.add-task');
    const taskElement = document.createElement('div');
    taskElement.classList.add('task');
    taskElement.innerHTML = `
        <p>${task}</p>
        <span>${new Date().toLocaleDateString('en-GB')}</span>
    `;
    boardColumn.appendChild(taskElement);
}