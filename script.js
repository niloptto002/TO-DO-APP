let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [
    {
        id: 1,
        title: "Practice C++ programming",
        category: "Coding",
        priority: "High",
        dueDate: "",
        completed: false
    },
    {
        id: 2,
        title: "Work on Vital Link project",
        category: "Project",
        priority: "High",
        dueDate: "",
        completed: false
    },
    {
        id: 3,
        title: "Practice JavaScript",
        category: "Study",
        priority: "Medium",
        dueDate: "",
        completed: false
    }
];

let currentFilter = "all";

const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}

function displayDate() {
    const date = new Date();

    document.getElementById("currentDate").textContent =
        date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric"
        });
}

function addTask() {
    const title = taskInput.value.trim();

    if (title === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        category: categoryInput.value,
        priority: priorityInput.value,
        dueDate: dateInput.value,
        completed: false
    };

    tasks.unshift(newTask);

    saveTasks();

    taskInput.value = "";
    dateInput.value = "";

    renderTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const newTitle = prompt("Edit your task:", task.title);

    if (newTitle === null) {
        return;
    }

    if (newTitle.trim() === "") {
        return;
    }

    task.title = newTitle.trim();

    saveTasks();
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);

    saveTasks();
    renderTasks();
}

function getFilteredTasks() {
    const searchText = searchInput.value.toLowerCase().trim();

    return tasks.filter(task => {

        const matchesSearch =
            task.title.toLowerCase().includes(searchText);

        let matchesFilter = true;

        if (currentFilter === "active") {
            matchesFilter = !task.completed;
        }

        if (currentFilter === "completed") {
            matchesFilter = task.completed;
        }

        return matchesSearch && matchesFilter;
    });
}

function formatDate(date) {

    if (!date) {
        return "";
    }

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
    });
}

function renderTasks() {

    const filteredTasks = getFilteredTasks();

    taskList.innerHTML = "";

    if (filteredTasks.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    filteredTasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.className = "task";

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        taskElement.innerHTML = `

            <input
                type="checkbox"
                class="task-check"
                ${task.completed ? "checked" : ""}
            >

            <div class="task-content">

                <h3>${escapeHTML(task.title)}</h3>

                <div class="task-meta">

                    <span class="badge category">
                        ${task.category}
                    </span>

                    <span class="badge priority-${task.priority.toLowerCase()}">
                        ${task.priority} Priority
                    </span>

                    ${
                        task.dueDate
                        ? `
                        <span class="badge due-date">
                            📅 ${formatDate(task.dueDate)}
                        </span>
                        `
                        : ""
                    }

                </div>

            </div>

            <div class="task-actions">

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>

            </div>
        `;

        const checkbox =
            taskElement.querySelector(".task-check");

        const editButton =
            taskElement.querySelector(".edit-btn");

        const deleteButton =
            taskElement.querySelector(".delete-btn");

        checkbox.addEventListener("change", () => {
            toggleTask(task.id);
        });

        editButton.addEventListener("click", () => {
            editTask(task.id);
        });

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        taskList.appendChild(taskElement);
    });

    updateStats();
}

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(task => task.completed).length;

    const active = total - completed;

    const progress =
        total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("totalTasks").textContent = total;

    document.getElementById("activeTasks").textContent = active;

    document.getElementById("completedTasks").textContent = completed;

    document.getElementById("progressText").textContent =
        progress + "%";

    document.getElementById("progressPercent").textContent =
        progress + "%";

    document.getElementById("progressFill").style.width =
        progress + "%";

    document.getElementById("taskSummary").textContent =
        active + (active === 1 ? " task" : " tasks") +
        " remaining";
}

function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


addButton.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {
        addTask();
    }
});


searchInput.addEventListener("input", renderTasks);


document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", function() {

        document
            .querySelectorAll(".filter")
            .forEach(btn => btn.classList.remove("active"));

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTasks();
    });
});


document
    .getElementById("clearCompleted")
    .addEventListener("click", clearCompleted);


displayDate();
renderTasks();