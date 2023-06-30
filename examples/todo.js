// import B from "../src/biny.js";
import B from "binyjs";

let i = 0;
const todoState = B.state({ val: [], key: "id" }),
  inputState = B.state({ val: "" }),
  actions = B.Actions({
    setInput: ({ data }) => {
      inputState.target = todoInput;
      inputState.val += data.trim();
    },
    removeLi: ({ target }) => {
      todoState.target = ulis;
      const li = target.closest("li");
      const keyId = Number(li.getAttribute("key"));
      todoState.target = li;
      const idx = todoState.val.findIndex((td) => td.id === keyId);
      return (todoState.val = [
        ...todoState.val.slice(0, idx),
        ...todoState.val.slice(idx + 1),
      ]);
    },
    addItem: (e) => {
      e.preventDefault();
      todoState.target = ulis;
      todoState.val = [...todoState.val, { id: ++i, label: inputState.val }];
      fm.reset(), (inputState.val = "");
    },
    // callback
    display: () => {
      todoState.target = ulis;
      todoState.resp = todoState.val.map((todo) => TodoItem(todo));
    },
  });

const TodoItem = ({ id, label }) =>
  `<li key="${id}">
  <span style="display:flex;">
  <label style="margin-right:10px;">${label}</label>
  <input type="checkbox" data-click="removeLi"/>
  </span>
  </li>`;

const App = () =>
  `<div>
      <h1>Todo list minimal example with Biny</h1>
      <form data-action="addItem" id="fm" data-submit="addItem">
        <input type="text" id= "todoInput" data-input="setInput" autofocus/>
        <button id="btn" type="submit">Add</button>
      </form>
      <ul id="ulis" data-change="display"></ul>
    </div>
  `;

// ------------

// window.addEventListener("load", () => todoInput.focus());

app.innerHTML = App();
