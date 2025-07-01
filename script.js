// Variabel untuk menyimpan event instalasi PWA
let deferredPrompt;

// Elemen UI
const taskInput = document.getElementById("taskInput");
const categorySelect = document.getElementById("categorySelect");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterCategorySelect = document.getElementById("filterCategory");
const installBtn = document.getElementById("installBtn");
const themeToggle = document.getElementById("themeToggle");

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
        <div class="task-content">
          <input 
            type="checkbox" 
            ${task.completed ? "checked" : ""} 
            class="task-checkbox"
          >
          <span class="task-text">${task.text}</span>
        </div>
        <div class="task-right">
          <span class="category-badge ${task.category}">${task.category}</span>
          <button class="delete-btn" title="Hapus tugas">🗑️</button>
        </div>
      `;

      // Event listeners
      li.querySelector(".task-checkbox").addEventListener("change", () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
      });

      li.querySelector(".delete-btn").addEventListener("click", () => {
        if (confirm("Hapus tugas ini?")) {
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        }
      });

      taskList.appendChild(li);
    }
  });
}

// Event Listeners
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  const category = categorySelect.value;

  if (text) {
    tasks.push({
      text,
      category,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    taskInput.value = "";
    saveTasks();
    renderTasks();
  }
});

filterCategorySelect.addEventListener("change", renderTasks);

// PWA Installation Logic
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block";
});

installBtn.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("Hasil instalasi:", outcome);
    deferredPrompt = null;
    installBtn.style.display = "none";
  }
});

window.addEventListener("appinstalled", () => {
  console.log("Aplikasi berhasil diinstal!");
  installBtn.style.display = "none";
});

// Toggle Tema
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  themeToggle.textContent = document.body.classList.contains("light-theme")
    ? "Tema Gelap"
    : "Tema Terang";
  localStorage.setItem(
    "theme",
    document.body.classList.contains("light-theme") ? "light" : "dark"
  );
});

// Inisialisasi
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-theme");
  themeToggle.textContent = "Tema Gelap";
}

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
