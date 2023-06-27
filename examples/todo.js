import B from "../src/biny";
// import B from "binyjs";

let i = 0;
const todoState = B.state({ val: [], key: "id" }),
  inputState = B.state({ val: "" }),
  actions = B.Actions({
    setInput: (data) => (inputState.val += data),
    removeLi: (target) => {
      const li = target.closest("li");
      const keyId = Number(li.getAttribute("key"));
      todoState.target = li;
      const idx = todoState.val.findIndex((td) => td.id === keyId);
      return (todoState.val = [
        ...todoState.val.slice(0, idx),
        ...todoState.val.slice(idx + 1),
      ]);
    },
    addItem: () => {
      todoState.val = [...todoState.val, { id: ++i, label: inputState.val }];
      fm.reset(), (inputState.val = "");
    },
    // callback
    display: () =>
      (todoState.resp = todoState.val.map((todo) => TodoItem(todo))),
  });

const TodoItem = ({ id, label }) =>
  `<li key="${id}"><span style="display:flex;"><label style="margin-right:10px;">${label}</label><input type="checkbox" id="ckb" data-action="removeLi" value=${inputState.val}/></spa n></li>`;

const App = () =>
  `<div>
      <h1>Todo list minimal example with Tiny</h1>
      <form data-action="addItem" id="fm">
        <input type="text" id= "todoInput" data-action="setInput"/>
        <button id="btn" type="submit">Add</button>
      </form>
      <ul id="ulis" data-change="display"></ul>
    </div>
  `;

// ------------

window.addEventListener("load", () => {
  inputState.target = todoInput;
  todoInput.focus();

  document.addEventListener("click", ({ target }) => {
    todoState.target = ulis;
    // delete is a checkbox,
    if (target.checked) {
      return actions[target.dataset.action](target);
    }
  });
  document.addEventListener("input", ({ data, target }) => {
    todoState.target = ulis;
    inputState.target = todoInput;
    return actions[target.dataset.action](data);
  });

  document.addEventListener("submit", (evt) => {
    evt.preventDefault();
    return actions[evt.target.dataset.action](evt);
  });
});

app.innerHTML = App();
