const input = document.querySelector("#search");
const span = document.querySelector(".footer-span");
const btn = document.querySelector(".btn2");
const editInput = document.querySelector("#editor");
const form = document.querySelector("form");
const editBlock = document.querySelector(".edit-block");
const container = document.querySelector(".container");
let todos = [];
localStorage.setItem("todos", JSON.stringify(todos));
const archive = [];
let editingTODOLabel = "";

document.querySelector(".edit-btn").addEventListener("click", () => {
    editingTODOLabel.innerText = editInput.value;
    editBlock.style.display = "none";
    form.style.pointerEvents = "all";
    container.style.filter = "blur(0px)";
});

function updateTodos() {
    span.innerText = `${todos.length} / ${todos.filter(todo => todo.isCompleted === true).length} Completed`;
}

form.addEventListener("submit", e => {
    e.preventDefault();

    const todo = document.createElement("div");
    todo.classList.add("todo");

    const checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.id = todos.length + 1;

    const label = document.createElement("span");
    label.innerText = input.value;
    label.id = checkbox.id;

    checkbox.addEventListener("change", evt => {
        const initTodo = todos.filter(todo => todo.label.id === evt.target.id)[0];
        initTodo.isCompleted ? initTodo.isCompleted = false : initTodo.isCompleted = true;

        updateTodos();
    });

    const button = document.createElement("button");
    button.innerText = "Edit TODO";
    button.addEventListener("click", () => {
        editBlock.style.display = "block";
        editInput.value = label.innerText;
        form.style.pointerEvents = "none";
        container.style.filter = "blur(20px)";
        editingTODOLabel = label;
    });

    todo.append(label, checkbox, button);

    const newDate = new Date();
    newDate.setMinutes(new Date().getMinutes() + 1);

    const obj = {
        id: `${Date.now()}_${Math.random()}`,
        label: label,
        isCompleted: false,
        created: new Date().toTimeString(),
        deadline: newDate.toTimeString()
    }

    todos.push(obj);
    localStorage.setItem("todos", JSON.stringify(todos));

    const id = setInterval(() => {
        if (obj.deadline === new Date().toTimeString()) {
            obj.label.parentElement.style.pointerEvents = "none";
            clearInterval(id);
            console.log("The time to do TODO with " + obj.id + " id is up");
        } else if (label.parentElement.style.display === "none") {
            clearInterval(id);
        }
    }, 10000);

    console.log(todos);

    updateTodos();
    input.value = "";

    input.focus();
    document.querySelector(".todos").append(todo);
});

function clearCompleted() {
    todos.filter(todo => todo.isCompleted).forEach(todo => {
        todo.label.parentElement.style.display = "none";
    });

    todos = todos.filter(todo => todo.isCompleted === false);

    localStorage.setItem("todos", JSON.stringify(todos));

    updateTodos();
}

btn.addEventListener("click", clearCompleted);

document.querySelector(".btn1").addEventListener("click", () => {
    if (todos.length !== todos.filter(todo => todo.isCompleted === true).length) {
        todos.filter(todo => todo.isCompleted === false).forEach(todo => {
            todo.label.parentElement.children[1].checked = true;
            todo.isCompleted = true;
        });
    } else {
        todos.forEach(todo => {
            !todo.label.parentElement.children[1].checked ? todo.label.parentElement.children[1].checked = true : todo.label.parentElement.children[1].checked = false;
            !todo.isCompleted ? todo.isCompleted = true : todo.isCompleted = false;
        });
    }

    updateTodos();
});

document.querySelector(".archive").addEventListener("click", () => {
    todos.forEach(todo => {
        if (todo.label.parentElement.style.pointerEvents === "none") {
            archive.push(todo);
            todo.label.parentElement.style.display = "none";
        }
    });

    todos = todos.filter(todo => todo.label.parentElement.style.pointerEvents !== "none");
    updateTodos();
    localStorage.setItem("todos", JSON.stringify(todos));
});