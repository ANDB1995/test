import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCWHVhxcWJIS9KvVkNMF1eanQS1qETbJm0",
  authDomain: "to-do-list-36eae.firebaseapp.com",
  databaseURL: "https://to-do-list-36eae-default-rtdb.firebaseio.com",
  projectId: "to-do-list-36eae",
  storageBucket: "to-do-list-36eae.firebasestorage.app",
  messagingSenderId: "948212587236",
  appId: "1:948212587236:web:ec8effc054efc7de7a2af1"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const tasksRef = ref(database, "tasks");

const input = document.getElementById("todo-input");
const button = document.getElementById("add-todo");
const list = document.getElementById("todo-list");

button.addEventListener("click", function () {
  const task = input.value.trim();

  if (task === "") {
    return;
  }

  push(tasksRef, {
    text: task,
    createdAt: Date.now()
  });

  input.value = "";
});

onValue(tasksRef, function (snapshot) {
  list.innerHTML = "";

  snapshot.forEach(function (childSnapshot) {
    const taskId = childSnapshot.key;
    const task = childSnapshot.val();

    const item = document.createElement("li");
    item.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = " Elimina";
    deleteButton.style.marginLeft = "10px";

    deleteButton.addEventListener("click", function () {
      remove(ref(database, "tasks/" + taskId));
    });

    item.appendChild(deleteButton);
    list.appendChild(item);
  });
});