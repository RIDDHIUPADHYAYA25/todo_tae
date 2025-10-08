// ---------------- Auth ----------------
async function registerUser() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;

  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert("Registration successful! Please login.");
    window.location.href = "/login"; // redirect to login page
  } else {
    alert(data.error);
  }
}

async function loginUser() {
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert("Login successful!");
    window.location.href = "/"; // redirect to main app
  } else {
    alert(data.error);
  }
}

// ---------------- Tasks ----------------
async function loadTasks() {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();

  const taskList = document.getElementById("taskList");
  if (!taskList) return;
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const card = document.createElement("div");
    card.className = "task-card";

    card.innerHTML = `
      <h3>${task.task}</h3>
      <div class="task-meta">Deadline: ${task.deadline || "No deadline"}</div>
      <div class="task-actions">
        <select onchange="toggleStatus(${task.id}, this.value)">
          <option value="pending" ${task.status === "pending" ? "selected" : ""}>Pending</option>
          <option value="done" ${task.status === "done" ? "selected" : ""}>Done</option>
        </select>
        <button onclick="deleteTask(${task.id})">✖</button>
      </div>
    `;

    taskList.appendChild(card);
  });

  updateProgress(tasks);
}

// Add a new task
const taskForm = document.getElementById("taskForm");
if (taskForm) {
  taskForm.addEventListener("submit", async e => {
    e.preventDefault();
    const taskInput = document.getElementById("taskInput");
    const deadlineInput = document.getElementById("deadlineInput");

    if (!taskInput.value) return alert("Enter a task!");

    await fetch("/api/add_task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: taskInput.value,
        deadline: deadlineInput.value
      })
    });

    taskInput.value = "";
    deadlineInput.value = "";
    loadTasks();
  });
}

// Toggle task status
async function toggleStatus(id, newStatus) {
  await fetch(`/api/update_task/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus })
  });
  loadTasks();
}

// Delete a task
async function deleteTask(id) {
  await fetch(`/api/delete_task/${id}`, { method: "DELETE" });
  loadTasks();
}

// Progress bar update
function updateProgress(tasks) {
  const progressBar = document.getElementById("progressBar");
  if (!progressBar) return;
  const total = tasks.length;
  const done = tasks.filter(t => t.status === "done").length;
  const percent = total ? (done / total) * 100 : 0;
  progressBar.style.width = percent + "%";
}

// Auto-load tasks if on index.html
if (document.getElementById("taskList")) {
  loadTasks();
}