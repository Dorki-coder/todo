let todo = [],
  main_div = document.createElement("div"),
  main = document.querySelector("#list");
const clear = document.querySelector("#deleteAll"),
  clearCompleted = document.querySelector("#clearCompleted");
main_div.className = "list";

if (localStorage.getItem("todo") != undefined) {
  todo = JSON.parse(localStorage.getItem("todo"));
  out();
}

//Add task
document.getElementById("btnAdd").addEventListener("click", function () {
  let temp = {};
  temp.todo = document.querySelector("input").value;
  temp.check = false;
  let i = todo.length;
  todo[i] = temp;
  document.querySelector("input").value = "";
  out();
  localStorage.setItem("todo", JSON.stringify(todo));
});

//Delete all task
clear.addEventListener("click", function () {
  localStorage.clear();
  todo = [];
  out();
});

//Delete checked task
clearCompleted.addEventListener("click", function () {
  console.log(todo);
  todo = todo.filter((elem) => {
    return elem.check == false;
  });
  console.log(todo);
  localStorage.setItem("todo", JSON.stringify(todo));
  out();
});

//Delete task
function deleteTask(index) {
  todo.splice(index, 1);
  out();
}

//checked unchecked
function completeTask(index) {
  let todoItemsElems;
  todoItemsElems = document.querySelectorAll("span");
  todo[index].check = !todo[index].check;

  if (todo[index].check) {
    todoItemsElems[index].classList.add("checked");
  } else todoItemsElems[index].classList.remove("checked");
  localStorage.setItem("todo", JSON.stringify(todo));
}

function out() {
  main_div.innerHTML = " ";
  for (let index in todo) {
    let grid_div = document.createElement("div");
    grid_div.insertAdjacentHTML(
      "afterbegin",
      `
      <input onclick="completeTask(${index})" type="checkbox" ${
        todo[index].check ? "checked" : ""
      } />
      <span>${todo[index].todo}</span>
      <button onclick="deleteTask(${index})" class="delete">❌</button>
      `
    );
    main_div.append(grid_div);
    main.append(main_div);
    grid_div.className = "task";
  }
}