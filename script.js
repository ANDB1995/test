import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://ppelqbcafaifrztkuriq.supabase.co/rest/v1/tasks";
const supabaseAnonKey = "sb_publishable_G1wn5mhCQj4r1Bt_6zWUoA_DXVCalpH";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const input = document.getElementById("todo-input");
const button = document.getElementById("add-todo");
const list = document.getElementById("todo-list");

async function loadTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Errore lettura tasks:", error);
    return;
  }

  list.innerHTML = "";

  data.forEach(function (task) {
    addTaskToPage(task);
  });
}

function addTaskToPage(task) {
  const item = document.createElement("li");
  item.dataset.id = task.id;
  item.textContent = task.text;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = " Elimina";
  deleteButton.style.marginLeft = "10px";

  deleteButton.addEventListener("click", async function () {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", task.id);

    if (error) {
      console.error("Errore eliminazione task:", error);
    }
  });

  item.appendChild(deleteButton);
  list.appendChild(item);
}

button.addEventListener("click", async function () {
  const taskText = input.value.trim();

  if (taskText === "") {
    return;
  }

  const { error } = await supabase
    .from("tasks")
    .insert([{ text: taskText }]);

  if (error) {
    console.error("Errore inserimento task:", error);
    return;
  }

  input.value = "";
});

supabase
  .channel("tasks-changes")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "tasks"
    },
    function () {
      loadTasks();
    }
  )
  .subscribe();

loadTasks();