// import B from "../src/biny.js";
import B from "../src/biny.js";

let i = 0;
const todoState = B.state({ val: [], action: "append" }),
  inputState = B.state({ val: "", action: "input" }),
  actions = B.Actions({
    setInput: (data) => (inputState.val = data),
    removeLi: (li) => {
      const idx = todoState.val.findIndex((td) => td.id === Number(li.d));
      li.remove();
      return (todoState.val = [
        ...todoState.val.slice(0, idx),
        ...todoState.val.slice(idx + 1),
      ]);
    },
    addItem: () => {
      fm.reset(), (inputState.val = "");
      todoState.val = [...todoState.val, { id: ++i, label: inputState.val }];
    },
    // callback
    display: () =>
      (todoState.resp = todoState.val.map((todo) => TodoItem(todo))),
  });

const TodoItem = ({ id, label }) =>
    `<li id=${id}>
      <span style="display:flex;">
        <label style="margin-right:10px;">${label}</label>
        <input type="checkbox" id="ckb" value=${inputState.val}/>
      </span>
    </li>
  `,
  App = () =>
    `<div>
      <h1>Todo list minimal example with Tiny</h1>
      <form data-action="addItem" id="fm">
        <input type="text" id= "todoInput"/>
        <button id="btn" type="submit">Add</button>
      </form>
      <ul id="ulis" data-change="display"></ul>
    </div>
  `;

// ------------

window.addEventListener("load", () => {
  todoState.target = ulis;
  inputState.target = todoInput;

  todoInput.focus();

  document.addEventListener("input", ({ data, target }) => {
    // delete is a checkbox, responds first change, then input.
    let li = target.closest("li");
    if (li) {
      return target.checked && actions.removeLi(li);
    }
    return actions.setInput(data);
  });

  document.addEventListener("submit", (evt) => {
    evt.preventDefault();
    return actions.addItem(evt);
  });
});

app.innerHTML = App();
