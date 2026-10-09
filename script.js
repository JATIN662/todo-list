// ===============================
// SELECT HTML ELEMENTS
// ===============================

const taskInput = document.querySelector("#task-input");
const addButton = document.querySelector("#add-btn");
const taskContainer = document.querySelector(".task-container");

const searchInput = document.querySelector("#search-input");

const filters = document.querySelectorAll(".filter p");

const totalCount = document.querySelector("#total-count");
const completedCount = document.querySelector("#completed-count");


// ===============================
// TASK DATA
// ===============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";


// ===============================
// SAVE TASKS
// ===============================

function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}


// ===============================
// ADD TASK
// ===============================

addButton.addEventListener("click", addTask);


taskInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addTask();
    }

});


function addTask() {

    const taskText = taskInput.value.trim();

    // Empty task check
    if (taskText === "") {

        alert("Please enter a task");

        return;
    }


    // Create task object

    const newTask = {

        id: Date.now(),

        text: taskText,

        completed: false

    };


    // Add task to array

    tasks.push(newTask);


    // Save

    saveTasks();


    // Clear input

    taskInput.value = "";


    // Display tasks

    renderTasks();

}


// ===============================
// DISPLAY TASKS
// ===============================

function renderTasks() {

    taskContainer.innerHTML = "";


    const searchText = searchInput.value.toLowerCase().trim();


    tasks.forEach(function (task) {


        // Filter

        if (currentFilter === "pending" && task.completed) {
            return;
        }

        if (currentFilter === "completed" && !task.completed) {
            return;
        }


        // Search

        if (!task.text.toLowerCase().includes(searchText)) {
            return;
        }


        // Create task element

        const taskElement = document.createElement("div");

        taskElement.classList.add("task");


        if (task.completed) {

            taskElement.classList.add("completed");

        }


        taskElement.innerHTML = `

            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <span>${task.text}</span>

            <button class="delete-btn">🗑</button>

        `;


        // ===============================
        // CHECKBOX
        // ===============================

        const checkbox =
            taskElement.querySelector(".task-checkbox");


        checkbox.addEventListener("change", function () {

            task.completed = checkbox.checked;

            saveTasks();

            renderTasks();

        });


        // ===============================
        // DELETE
        // ===============================

        const deleteButton =
            taskElement.querySelector(".delete-btn");


        deleteButton.addEventListener("click", function () {

            tasks = tasks.filter(function (item) {

                return item.id !== task.id;

            });


            saveTasks();

            renderTasks();

        });


        // Add task to page

        taskContainer.appendChild(taskElement);

    });


    updateStats();

}


// ===============================
// FILTER
// ===============================

filters.forEach(function (filter) {


    filter.addEventListener("click", function () {


        // Remove active class

        filters.forEach(function (item) {

            item.classList.remove("active");

        });


        // Add active class

        filter.classList.add("active");


        // Get filter type

        currentFilter = filter.dataset.filter;


        // Display tasks

        renderTasks();

    });

});


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener("input", function () {

    renderTasks();

});


// ===============================
// UPDATE STATS
// ===============================

function updateStats() {


    totalCount.textContent = tasks.length;


    const completedTasks = tasks.filter(function (task) {

        return task.completed;

    });


    completedCount.textContent = completedTasks.length;

}


// ===============================
// INITIAL DISPLAY
// ===============================

renderTasks();