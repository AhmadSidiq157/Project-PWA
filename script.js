// Variabel untuk menyimpan event instalasi PWA
let deferredPrompt;

// Elemen UI
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterCategorySelect = document.getElementById("filterCategory");
const installBtn = document.getElementById("installBtn");

// Data Tugas
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Fungsi Simpan Tugas ke LocalStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Fungsi Render Tugas
function renderTasks() {
  taskList.innerHTML = "";
  const filter = filterCategorySelect.value;

  tasks.forEach((task, index) => {
    if (filter === "all" || task.category === filter) {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.dataset.id = index;

      li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <span class="category-badge">${task.category}</span>
        <div class="task-actions">
          <button class="complete-btn">${
            task.completed ? "Batal" : "Selesai"
          }</button>
          <button class="delete-btn">Hapus</button>
        </div>
      `;
      taskList.appendChild(li);
    }
  });
}

// Event Listeners
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const category = categorySelect.value;

  if (text) {
    tasks.push({ text, category, completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
});

taskList.addEventListener("click", (e) => {
  const li = e.target.closest("li");
  if (!li) return;

  const index = parseInt(li.dataset.id);

  if (e.target.classList.contains("complete-btn")) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  } else if (e.target.classList.contains("delete-btn")) {
    if (confirm("Hapus tugas ini?")) {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    }
  }
});

filterCategorySelect.addEventListener("change", renderTasks);

// PWA Installation Logic
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block";
  console.log("PWA siap diinstal!");
});

installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log("Hasil instalasi:", outcome);
  deferredPrompt = null;
  installBtn.style.display = "none";
});

window.addEventListener("appinstalled", () => {
  console.log("Aplikasi berhasil diinstal!");
  installBtn.style.display = "none";
});

// Inisialisasi
renderTasks();

// Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => console.log("Service Worker terdaftar:", reg))
      .catch((err) => console.error("Gagal mendaftar Service Worker:", err));
  });
}
const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  themeToggle.textContent = document.body.classList.contains("light-theme")
    ? "Tema Gelap"
    : "Tema Terang";
});
