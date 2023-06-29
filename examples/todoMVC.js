import B from "binyjs";

let nextID = 0;

const leftCount = B.state({ val: 0 }),
  todoInput = B.state({ val: "" }),
  todos = B.state({ val: [], key: "id" }),
  status = B.state({ val: undefined }),
  actions = B.Actions({
    getInput: ({ data }) => {
      (todoInput.target = inputTodo), (todoInput.val += data);
    },
    addItem: (e) => {
      e.preventDefault();
      if (!todoInput.val) return;
      todos.val = [
        ...todos.val,
        { id: ++nextID, title: todoInput.val.trim(), done: false },
      ];
      // tell the counter
      leftCount.val = todos.val.filter((todo) => !todo.done).length;
      newInput.reset(), (todoInput.val = "");
    },
    updateTodos: () => {
      todos.resp = todos.val.map((todo) => Todo(todo));
    },
    nav: () => {
      todos.resp = todos.val
        .filter((todo) =>
          status.val === undefined ? true : todo.done === status.val
        )
        .map((todo) => Todo(todo));
    },
    todosCountLeft: () => {
      leftCount.resp =
        leftCount.val === 1
          ? `<span>${leftCount.val} item left</span>`
          : `<span>${leftCount.val} items left</span>`;
    },
    completed: (e) => {
      const id = Number(e.target.closest("li").getAttribute("key"));
      todos.val = [...todos.val].map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      );
      //   tell the counter
      leftCount.val = todos.val.filter((todo) => !todo.done).length;
    },
    removeTodo: ({ target }) => {
      const li = target.closest("li");
      const keyId = Number(li.getAttribute("key"));
      const idx = todos.val.findIndex((td) => td.id === keyId);
      todos.val = [...todos.val.slice(0, idx), ...todos.val.slice(idx + 1)];
      leftCount.val = todos.val.filter((todo) => !todo.done).length;
    },
    toggleAll: ({ target }) => {
      if (target.checked) {
        todos.val = [...todos.val].map((todo) => ({ ...todo, done: true }));
      } else {
        todos.val = [...todos.val].map((todo) => ({ ...todo, done: false }));
      }
      leftCount.val = todos.val.filter((todo) => !todo.done).length;
    },
    clearCompleted: () => {
      todos.val = [...todos.val].filter((todo) => !todo.done);
    },
  });

const Todo = (todo) =>
  `<li key="${todo.id}" class="${
    todo.done ? "completed" : ""
  }"><div class="view"><input  class="toggle" type="checkbox" checked="" data-click="completed"><label>${
    todo.title
  }</label><input type="checkbox" data-click="removeTodo" class="destroy"/></div></li>`;

const Nav = () => `<footer class="footer">
<span class="todo-count" id="count" data-change="todosCountLeft"></span>
<ul class="filters">
    <li>
        <a href="#/" class="selected" >All</a>
    </li>
    <li>
        <a href="#/active" >Active</a>
    </li>
    <li>
        <a href="#/completed">Completed</a>
    </li>
</ul>
<button class="clear-completed" data-click="clearCompleted">Clear completed</button>
</footer>`;

const Todos = () =>
  `<ul class="todo-list" id="ulis" data-change="updateTodos"></ul>`;

const App = () =>
  `<section class="todoapp">
    <header class="header">
        <h1>Todos</h1>
        <form id="newInput" data-submit="addItem">
            <input id="inputTodo" class="new-todo" placeholder="What needs to be done?" autofocus value="${
              todoInput.val
            }" data-input="getInput" 
            >
        </form>
    </header>
    <section class="main">
        <input id="toggle-all" class="toggle-all" type="checkbox" data-click="toggleAll">
        <label for="toggle-all">Mark all as complete</label>
        ${Todos()}
    </section>
    ${Nav()}
    <footer class="info">
      <p>Double-click to edit a todo</p>
      <p>Created by <a href="http://twitter.com/oscargodson">Oscar Godson</a></p>
      <p>Refactored by <a href="https://github.com/cburgmer">Christoph Burgmer</a></p>
      <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
    </footer>
  </section>`;

window.onload = () => {
  leftCount.target = count;
  todos.target = ulis;
  todoInput.target = inputTodo;

  history.pushState({}, "", "/#/");
  window.addEventListener("hashchange", locationHandler);
};

app.innerHTML = App();

const routes = {
  "/": () => (status.val = undefined),
  "/active": () => (status.val = false),
  "/completed": () => (status.val = true),
};

const locationHandler = async () => {
  const location = window.location.hash.replace("#", "");
  console.log(location);
  routes[location]();
  return actions.nav();
};
