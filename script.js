const input = document.getElementById("todo-input");
const button = document.getElementById("add-todo");
const list = document.getElementById("todo-list");

button.addEventListener("click", function () {
  const task = input.value;

  if (task.trim() === "") {
    return;
  }

  const item = document.createElement("li");
  item.textContent = task;

  list.appendChild(item);
  input.value = "";
});