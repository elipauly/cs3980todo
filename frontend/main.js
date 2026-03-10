let data = [];
const api = 'http://127.0.0.1:8000/todos';
let todoIdInEdit = 0;

document.getElementById('add-btn').addEventListener('click', (e) => {
  e.preventDefault();

  const msgDiv = document.getElementById('msg');
  const titleInput = document.getElementById('title');
  const descInput = document.getElementById('desc');
  const categoryInput = document.getElementById('category');

  if (!titleInput.value || !descInput.value) {
    msgDiv.innerHTML =
      'Please provide non-empty Title and Description when creating a new Todo';
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 201) {
      const newTodo = JSON.parse(xhr.response);
      data.push(newTodo);
      renderTodos(data);

      // close modal dialog
      const closeBtn = document.getElementById('close-add-modal');
      closeBtn.click();

      // clean up
      msgDiv.innerHTML = '';
      titleInput.value = '';
      descInput.value = '';
      categoryInput.value = '';
    }
  };

  const allowedCategories = ["Produce", "Pantry", "Base/Foundation", "Condiments", "Misc."];

  if (!allowedCategories.includes(categoryInput.value)) {
    msgDiv.innerHTML = "Please select a valid category.";
    return;
  }

  xhr.open('POST', api, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ title: titleInput.value, desc: descInput.value, category: categoryInput.value }));
});

document.getElementById('edit-btn').addEventListener('click', (e) => {
  e.preventDefault();

  const msgDiv = document.getElementById('msgEdit');
  const titleInput = document.getElementById('titleEdit');
  const descInput = document.getElementById('descEdit');
  const categoryInput = document.getElementById('categoryEdit');
  console.log("Selected category:", categoryInput.value);

  if (!titleInput.value || !descInput.value) {
    msgDiv.innerHTML =
      'Please provide non-empty Title and Description when updating a Todo';
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 201) {
      const newTodo = JSON.parse(xhr.response);
      const todo = data.find((x) => x.id == todoIdInEdit);
      todo.title = newTodo.title;
      todo.desc = newTodo.desc;
      todo.category = newTodo.category;
      renderTodos(data);

      // close modal dialog
      const closeBtn = document.getElementById('close-edit-modal');
      closeBtn.click();

      // clean up
      msgDiv.innerHTML = '';
      titleInput.value = '';
      descInput.value = '';
      categoryInput.value = '';
    }
  };

  xhr.open('PUT', api + '/' + todoIdInEdit, true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.send(JSON.stringify({ title: titleInput.value, desc: descInput.value, category: categoryInput.value }));
});

function deleteTodo(id) {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status == 200 || xhr.status == 201) {
      data = data.filter((x) => x.id != id);
      renderTodos(data);
    }
  };

  xhr.open('DELETE', api + '/' + id, true);
  xhr.send();
}

function setTodoInEdit(id) {
  todoIdInEdit = id;
  const todo = data.find(x => x.id == id);

  document.getElementById('titleEdit').value = todo.title;
  document.getElementById('descEdit').value = todo.desc;
  document.getElementById('categoryEdit').value = todo.category;
}

function renderTodos(data) {
  const todoDiv = document.getElementById('todos');
  todoDiv.innerHTML = '';

  //grouper function
  const groups = data.reduce(( acc, todo) => {
    const category = todo.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(todo);
    return acc;
  }, {});

  //render each category
  Object.keys(groups).forEach(category => {
    //cat header (h3)
    todoDiv.innerHTML += `<h3 class="mt-4">${category}</h3>`;
    //sort by id in descending order and render
    groups[category].sort((a,b) => b.id - a.id).forEach(x => {
      todoDiv.innerHTML +=
      `<div id="todo-${x.id}" class="todo-box">
        <div class="fw-bold fs-4">${x.title}</div>
        <pre class="text-secondary ps-3">${x.desc}</pre>
        <div>
          <button type="button" class="btn btn-success btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#modal-edit"
            onClick="setTodoInEdit(${x.id})"
          >
            Edit
          </button>
          <button type="button" class="btn btn-danger btn-sm"
            onClick="deleteTodo(${x.id})"
          >
            Delete
          </button>
        </div>
    </div>
    `
    ;
    });
  });
}

//getting todos from backend and render them on frontend
function getAllTodos() {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    if (xhr.status == 200 || xhr.status == 201) {
      data = JSON.parse(xhr.response) || [];
      console.log(data);
      renderTodos(data);
    }
  };

  xhr.open('GET', api, true);
  xhr.send();
}
//init
(() => {
  getAllTodos();
})();