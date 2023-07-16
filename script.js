// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyByvK7GYhb9_C0WjRebnfGs56jZi6BHgQ4",
    authDomain: "to-do-application-8bfc8.firebaseapp.com",
    projectId: "to-do-application-8bfc8",
    storageBucket: "to-do-application-8bfc8.appspot.com",
    messagingSenderId: "71146767266",
    appId: "1:71146767266:web:ada9dabf21a6025786e8fb"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const tasksRef = collection(db, "tasks");

// Get references to HTML elements
const newTaskInput = document.getElementById("new-task");
const tasksList = document.getElementById("tasks");

// Add event listener for adding new tasks
newTaskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter" && newTaskInput.value.trim() !== "") {
    addTask(newTaskInput.value.trim());
    newTaskInput.value = "";
  }
});

// Function to add a new task
async function addTask(taskText) {
  await addDoc(tasksRef, {
    taskText: taskText,
    completed: false,
  });
}

// Function to render tasks from database
function renderTasks(snapshot) {
  tasksList.innerHTML = "";

  snapshot.forEach(function (doc) {
    const key = doc.id;
    const task = doc.data();

    const li = document.createElement("li");
    li.className = "task-item";

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.taskText;

    const actionButtons = document.createElement("div");
    actionButtons.className = "action-buttons";

    const editButton = document.createElement("button");
    editButton.className = "edit-button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function () {
      showEditPrompt(key, task.taskText);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      showDeleteConfirmation(key);
    });

    actionButtons.appendChild(editButton);
    actionButtons.appendChild(deleteButton);

    li.appendChild(taskText);
    li.appendChild(actionButtons);

    tasksList.appendChild(li);
  });
}

// Function to show the edit prompt using SweetAlert2
function showEditPrompt(taskId, currentTaskText) {
    Swal.fire({
      title: "Edit Task",
      input: "textarea",
      inputLabel: "Task Text",
      inputPlaceholder: "Type the new task text here...",
      inputValue: currentTaskText,
      inputAttributes: {
        "aria-label": "Type the new task text here",
      },
      showCancelButton: true,
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You need to enter a task text!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const newTaskText = result.value.trim();
        updateTask(taskId, newTaskText);
        Swal.fire({
          title: "Task Updated",
          text: newTaskText,
          icon: "success",
        });
      }
    });
  }
  
  
  
  
  

// Function to show the delete confirmation using SweetAlert2
function showDeleteConfirmation(taskId) {
  Swal.fire({
    title: "Delete Task",
    text: "Are you sure you want to delete this task?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteTask(taskId);
    }
  });
}

// Function to update a task
async function updateTask(taskId, newTaskText) {
  const taskRef = doc(tasksRef, taskId);
  await updateDoc(taskRef, { taskText: newTaskText });
}

// Function to delete a task
async function deleteTask(taskId) {
  const taskRef = doc(tasksRef, taskId);
  await deleteDoc(taskRef);
}

// Listen for changes in the database and update the UI
onSnapshot(tasksRef, function (snapshot) {
  renderTasks(snapshot.docs);
});