# BinyJS

It is a small vanilla Javascript project of 1.3kB to help to write reactive UI.
[![npm bundle size](https://img.badgesize.io/ndrean/binyjs/main/dist/binyjs.umd.cjs?compression=gzip)](https://bundlephobia.com/package/binyjs@0.3.3)

It can handle _arrays_ as demonstrated in the "JS-framework" bench test. It uses an immutable state and computes the diff to render the desired DOM elements.

You write HTML as strings with normal interpolation. It uses state variables with the convention of using `.val` as a setter and getter. It uses the convention of a `data-change` or `data-submit` or `data-input` with **dataset** where you want reactivity. It also uses the key `.resp` to set the rendered DOM elements. It relies on the event loop and on a "diffing" function on the data when you use arrays. For this reason, it relies on _unique keys_; you need to use the `key` attribute to identify each element of the rendered DOM array, and pass in the unique identifier you use in your data.

## Usage

You get `state` and `Actions` from the package. This handles your state and action functions.

```js
import B from "binyjs"

const todos = B.state({val: [], key: "id"})
const actions = B.Actions({remove: ()=> ...})
```

## Example: Counter#1

We want to display a button and increment the count on each click. We start by defining the state and actions.

```js
import B from "binyjs";

const mystate = B.state({ val: 0 }),
  actions = B.Actions({
    inc: () => (mystate.val += 1),
    display: () =>
      (mystate.resp = `<span>binyJS state is: ${mystate.val}</span>`),
  });
```

Our HTML template is as below. We define the dataset `data-change`. This will insert an `onchange` listener in the component you will declare:

```js
app.innerHTML = `<div>
    <h1>Hello biny</h1>
    <div>
      <button id="counter" type="button">
      <span data-change="display" id="count"></span>
      </button>
    </div> 
  </div>
`;
```

We set up the "click" listener globally. The span element "#count" is declared as the _target_ for this state. It contains the dataset `data-change="display"`. This defines an "onchange" callback to run the "display" function. It will populate the "#count" element.

```js
window.onload = () => {
  mystate.target = count;
  actions.display();
  counter.addEventListener("click", () => {
    actions.inc();
  });
};
```

## Example Counter#2

Instead of using a global listener, we can directly use a local listener when the elements are not dynamic.

Consider the change:

```js
app.innerHTML = `<div>
    <h1>Hello biny</h1>
    <div>
      <button id="counter" type="button" data-click="inc">
                                                  ^^^
      <span data-change="display" id="count"></span>
      </button>
    </div> 
  </div>
`;
```

Then we need to set the target for the action. The code becomes:

```js
const mystate = B.state({ val: 0 }),
  actions = B.Actions({
    inc: () => {
      mystate.target = count;
      mystate.val = mystate.val + 1;
    },
    display: () => {
      mystate.target = count;
      mystate.resp = `<span>binyJS state: ${mystate.val}</span>`;
    },
  });
// display the initial value of the counter
window.onload = () => actions.display();
```

## Ingredients

The state is required to be immutable. You use datasets when the event emitters are "fiexd" in the DOM, meaning they are known on build. If the component is dynamically created and has an event emitter (eg a checkbox), then you need a global listener. The "todo" demonstrates this.

The main ingredients are:

- [state variables] declared with e.g. `counter = B.state({val: 0})` and `.val` is a setter and getter.
- [actions] declared in the function `B.Actions`.

```js
const actions = B.Actions({removeLi: ()=> {...},...})
```

- [keys] Whenever you render a list of components, use the attribute `key` in the HTML string you want to render and in your _selectors_. You also need to declare the id used in your data. In the "todo" example, you render a few "li" and your data is in the form `data = [{id:1, label: "ok},...]` then you need to declare `key="${id}"` to the state that will control this rendering.Note that the " are important for the querySelectors.

```js
const todoState = B.state({ val: [], key: "id" });
```

```js
const TodoItem = ({ id, label }) =>
  `<li key="${id}">
  <span style="display:flex;">
  <label style="margin-right:10px;">${label}</label>
  <input type="checkbox"/>
  </span>
  </li>`;
```

- [data-submit] [data-input] [data-click] listeners. You have the convention `data-event` and the "onevent" listener. It requires the **target** to be set in the called function.
- [data-change] is normally used as a callback.
- You should use global listeners when the data is dynamically created, thus not present in the DOM on load.
- [target] Inside your listener, you must declare the **target** for each reactive **state** variable. You can't declare before as the DOM is not loaded. It looks like `data.target=tbody`. You can also declare extra dependencies via a dataset if your component requires to read data hardcoded in the DOM. In the "todo" example, you have:

```js
todoInput.addEventListener("input", ({ data, target }) => {
  inputState.target = todoInput;
  return actions.setInput(data);
});
```

- [state.resp] You need to return the data, normally HTML strings in the key "`.resp`". For example, you define a component that should receive reactive data:

```js
<ul id="ulis" data-change="display"></ul>
```

You added above a `data-change` dataset. You declare the attached function "buildRows to the `.Actions` function where you pass the future HTML to the `.resp` key of the state:

```js
const actions = B.Actions({
  buildRows: () => {
    todoState.target = ulis;
    (todoState.resp = todoState.val.map((todo) => TodoItem(todo))),
  }
});
```

In the event listener, you need to link the state variable with the target: `todoState.target = ulis`.

```js
fm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  todoState.target = ulis;
  return actions.addItem();
});
```

## Reactivity pattern

We use the simple `event` loop and a "diffing function" to detect the 6 following changes made to the state: "assign", "append", "clear", "remove", "update" and "swap" (rows).

## Test

The performance is close to the Vanilla [JS code specific for this test](https://github.com/krausest/js-framework-benchmark) to which we compare the Biny package.

<img width="203" alt="Screenshot 2023-06-27 at 13 33 33" src="https://github.com/ndrean/binyJS/assets/6793008/a869d1e1-9f04-42c9-b8b0-4e7f005c9b4b">

<img width="202" alt="Screenshot 2023-06-26 at 13 17 28" src="https://github.com/ndrean/binyJS/assets/6793008/8dc77a66-6975-4e83-8c3c-eb6df9d257a9">
 
## Examples

The running bench example:
<https://githubbox.com/ndrean/binyJS/blob/main/examples/bench.js>

The code for the examples:

- the famous counter: <https://github.com/ndrean/binyJS/blob/main/examples/button.js>
-
- a basic "todo" list: <https://github.com/ndrean/binyJS/blob/main/examples/todo.js>

- the bench framework test: <https://github.com/ndrean/binyJS/blob/main/examples/bench.js>.

- select and datalist: <https://github.com/ndrean/binyJS/blob/main/examples/select.js>
- TODOMVC

## Size

<img width="809" alt="Screenshot 2023-06-27 at 13 43 59" src="https://github.com/ndrean/binyJS/assets/6793008/e01ea587-3d09-4815-a354-4d2807255511">
