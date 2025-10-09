// ---------------- Auth ----------------
function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  if (!username || !password) return alert("Fill both fields");

  const users = JSON.parse(localStorage.getItem("users") || "{}");
  if (users[username]) return alert("User already exists");

  users[username] = password;
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registered! Please login.");
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (users[username] === password) {
    localStorage.setItem("loggedInUser", username);
    document.getElementById("auth").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadTasks();
  } else {
    alert("Invalid credentials");
  }
}

// ---------------- Tasks ----------------
function loadTasks() {
  const username = localStorage.getItem("loggedInUser");
  if (!username) return;

  const tasks = JSON.parse(localStorage.getItem(`tasks_${username}`) || "[]");
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const card = document.createElement("div");
    card.className = "task-card";
    card.innerHTML = `
      <h3>${task.task}</h3>
      <div class="task-meta">Deadline: ${task.deadline || "No deadline"}</div>
      <div class="task-actions">
        <select onchange="toggleStatus(${index}, this.value)">
          <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
          <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
        </select>
        <button onclick="deleteTask(${index})">✖</button>
      </div>
    `;
    taskList.appendChild(card);
  });

  updateProgress(tasks);
}

document.getElementById("taskForm").addEventListener("submit", e => {
  e.preventDefault();
  const taskInput = document.getElementById("taskInput");
  const deadlineInput = document.getElementById("deadlineInput");
  const username = localStorage.getItem("loggedInUser");

  if (!taskInput.value || !username) return;

  const tasks = JSON.parse(localStorage.getItem(`tasks_${username}`) || "[]");
  tasks.push({ task: taskInput.value, deadline: deadlineInput.value, status: "pending" });
  localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));

  taskInput.value = "";
  deadlineInput.value = "";
  loadTasks();
});

function toggleStatus(index, newStatus) {
  const username = localStorage.getItem("loggedInUser");
  const tasks = JSON.parse(localStorage.getItem(`tasks_${username}`) || "[]");
  tasks[index].status = newStatus;
  localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));
  loadTasks();
}

function deleteTask(index) {
  const username = localStorage.getItem("loggedInUser");
  const tasks = JSON.parse(localStorage.getItem(`tasks_${username}`) || "[]");
  tasks.splice(index, 1);
  localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));
  loadTasks();
}

function updateProgress(tasks) {
  const progressBar = document.getElementById("progressBar");
  const total = tasks.length;
  const done = tasks.filter(t => t.status === "done").length;
  const percent = total ? (done / total) * 100 : 0;
  progressBar.style.width = percent + "%";
}

// ---------------- Dark Mode ----------------
document.getElementById("toggleMode").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// ---------------- Logout ----------------
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  document.getElementById("app").style.display = "none";
  document.getElementById("auth").style.display = "flex";
});

// ---------------- Auto Login ----------------
window.onload = () => {
  const user = localStorage.getItem("loggedInUser");
  if (user) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("app").style.display = "block";
    loadTasks();
  } else {
    document.getElementById("auth").style.display = "flex";
    document.getElementById("app").style.display = "none";
  }
};