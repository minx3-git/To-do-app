import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// 🔴 PASTE YOUR VALUES HERE
const supabaseUrl = "https://cksxveddoftpgcpqntvx.supabase.co";
const supabaseKey = "sb_publishable_UZfWIK_6INd6PcPVafASFQ_Uu6QbBo7";

const supabase = createClient(supabaseUrl, supabaseKey);

// ---------- AUTH ----------

window.signUp = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({ email, password });
  alert(error ? error.message : "Signup successful! Check email.");
};

window.signIn = async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) alert(error.message);
  else loadTodos();
};

window.signOut = async () => {
  await supabase.auth.signOut();
  document.getElementById("todo-section").style.display = "none";
};

// ---------- TODOS ----------

async function loadTodos() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  document.getElementById("todo-section").style.display = "block";

  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user.id);

  if (error) return alert(error.message);

  const list = document.getElementById("todoList");
  list.innerHTML = "";

  data.forEach((todo) => {
    const li = document.createElement("li");
    li.textContent = todo.task;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => deleteTodo(todo.id);

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

window.addTodo = async () => {
  const task = document.getElementById("taskInput").value;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return alert("Not logged in");

  const { error } = await supabase.from("todos").insert([
    {
      task,
      user_id: user.id,
    },
  ]);

  if (error) alert(error.message);
  else {
    document.getElementById("taskInput").value = "";
    loadTodos();
  }
};

async function deleteTodo(id) {
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) alert(error.message);
  else loadTodos();
}

// ---------- AUTO LOGIN CHECK ----------

loadTodos();
