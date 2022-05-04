async function getUsers() {
  const response = await fetch("http://24api.ru/rest-user?page=2");
  if (response.status == 200) {
    let data = response.json();
  }
}
// console.log(getUsers());
async function getTask() {
  const response = await fetch("http://24api.ru/rest-todo/items-by-id?id=60");
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  todo = await response.json();
  out();
  return todo;
}
console.log(getTask());

async function deleteItem(id) {
  const response = await fetch("http://24api.ru/rest-todo/" + id, {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  getTask();
  return response;
}

async function deleteItems(ids) {
  const response = await fetch("http://24api.ru/rest-todo/delete-items", {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items: ids }),
  });
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  getTask();
  return response;
}

async function updateItem(id, data) {
  const response = await fetch("http://24api.ru/rest-todo/" + id, {
    method: "PUT", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return response;
}

let todo = getTask(),
  main_div = document.createElement("div"),
  main = document.querySelector("#list");
const clear = document.querySelector("#deleteAll"),
  clearCompleted = document.querySelector("#clearCompleted");
main_div.className = "list";

async function createItem(name) {
  const data = {
    name: name,
    isDone: 0,
    user_id: 60,
  };
  const response = await fetch("http://24api.ru/rest-todo", {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  getTask();
  return await response.json();
}

//Add task
document.getElementById("btnAdd").addEventListener("click", function () {
  let temp = {};
  temp.todo = document.querySelector("input").value;
  document.querySelector("input").value = "";
  createItem(temp.todo);
  getTask();
});

//Delete all task
clear.addEventListener("click", function () {
  data = todo.map((obj) => obj.id);
  deleteItems(data);
});

//Delete checked task
clearCompleted.addEventListener("click", function () {
  data = todo.filter((obj) => obj.isDone == 1);
  data = data.map((obj) => obj.id);
  deleteItems(data);
});

//checked unchecked
function completeTask(index) {
  let todoItemsElems;
  todoItemsElems = document.querySelectorAll("span");
  if (todo[index].isDone == 0) todo[index].isDone = 1;
  else todo[index].isDone = 0;
  if (todo[index].isDone) {
    todoItemsElems[index].classList.add("checked");
  } else todoItemsElems[index].classList.remove("checked");
  data = { isDone: todo[index].isDone };
  updateItem(todo[index].id, data);
}

function out() {
  main_div.innerHTML = " ";
  for (let index in todo) {
    let grid_div = document.createElement("div");
    grid_div.insertAdjacentHTML(
      "afterbegin",
      `
      <input onclick="completeTask(${index})" type="checkbox" ${
        todo[index].isDone ? "checked" : ""
      } />
      <span>${todo[index].name}</span>
      <button onclick="deleteItem(${todo[index].id})" class="delete">❌</button>
      `
    );

    main_div.append(grid_div);
    main.append(main_div);
    grid_div.className = "task";

    let todoItemsElems;
    todoItemsElems = document.querySelectorAll("span");
    if (todo[index].isDone) {
      todoItemsElems[index].classList.add("checked");
    } else todoItemsElems[index].classList.remove("checked");
  }
}
