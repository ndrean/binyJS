# BinyJS

It is a micro vanilla Javascript project of 1.4kB to help to write reactive UI based on **event-driven** programming, aka "signals".

[![npm bundle size](https://img.badgesize.io/ndrean/binyjs/main/dist/binyjs.umd.cjs?compression=gzip)](https://bundlephobia.com/package/binyjs@0.3.3)

This project was made to handle _arrays_ and calculate the diff _on the data_, as demonstrated in the "JS-framework" bench test and the todoMVC. The performance is very close to the dedicated Javascript code written for this test. It uses **event-driven** programming: you write to the state and this triggers events with callbacks.

It uses an immutable state and computes the diff to render the desired DOM elements.

You write HTML as strings with normal interpolation.

It uses state variables. They have the following properties:

 - `.val` which is a setter and a getter,
 - `.target` which sets the DOM element which will receive the event triggered by a state change,
 - `.resp` which sets the desired rendering.

Instead of writing "event" listeners in your HTML (where "event" can be "click" or "submit" or "change" or "input"), you write a `dataset` and reference a function. For example, `data-change="compute"`.

It uses the key "stateVariable"`.resp` to set the rendered DOM elements.

It relies on _unique keys_; you need to use the `key` attribute in the HTML to identify each element of the rendered DOM array. You need to pass to the state variable the unique identifier you use in your data (eg `key: "id"`). Both "key" are different.

> Limitations: it is not fully reactive in the sense that you need to create a separate state variable for computed state. For example, you have a list of todos, completed or not. Suppose you have a counter on the total completed todos as a state variable. In the action where you change the completion of a todo, you need to modify of the counter state accordingly for the counter to be reactive. The "todoMVC" demonstrates this.

## Usage

You get `state` and `Actions` from the package. You instantiate your state and action functions.

```js
import B from "binyjs"

const todos = B.state({val: [], key: "id"})
const actions = B.Actions({remove: ()=> ...})
```

## Example Counter

We want to render this HTML string:

```js
app.innerHTML = `<div>
    <h1>Hello biny</h1>
    <div>
      <button id="counter" type="button" data-click="inc">
                                            ^^^
      <span data-change="display" id="count"></span>
               ^^^
      </button>
    </div> 
  </div>
`;
```

We build the state variable "counter", pass the actions into the "Actions" function and set up the _target_ for this state variable. We render an HTML string when we pass it to the `.resp` key of the state variable.

```js
const counter = B.state({ val: 0 }),
  actions = B.Actions({
    inc: () => (counter.val += 1),
    display: () => {
      // this action targets the "#count" element
      counter.target = count;
              ^^^
      counter.resp = `<span>binyJS state: ${counter.val}</span>`;
              ^^^
    },
  });
// display the initial state on load.
window.onload = () => actions.display();
```

## Ingredients

The state is required to be immutable. The main ingredients are:

- [state variables] You need to instantiate them. If say "data" is a state variable in the form of a collection of objects `[{id: 1, label: "..."},...]`, then `data.val` is a setter and getter. When your data is an array, set the unique identifier used by your data to the key "key".

```js
const todoState = B.state({val: [], key: "id"})
data.val = ...
```

- [actions] declared in the function `B.Actions`. You need to set the _target_ to the state variable used in the action.

```js
const actions = B.Actions({
  removeLi: ()=> {
    // the action targets the element "#ulis"
    todoState.target = ulis;
    ...
  },
  ...
})
```

- [key] As a convention, Biny uses the attribute `key` in the HTML string when you render a collection: you need to declare `key="${id}"` if your data uses "id" as unique identifier. Note that the "is important for the querySelectors. Use it in your _selectors_.

```js
const TodoItem = ({ id, label }) =>
  `<li key="${id}">
       ^^  ^     ^ 
  <span style="display:flex;">
  <label style="margin-right:10px;">${label}</label>
  <input type="checkbox"/>
  </span>
  </li>`;
```

- [data-event] Biny uses the convention `data-event` for an "event" listener. This means you use `data-click="addItem"` when the element emits a click event that should run the "addITem" action declared in your "Actions".
- You can use global listeners (`element.addEventListener`).
- [target] Inside your listener, you must declare the **target** for each reactive **state** variable. It looks like `data.target=tbody`. You can also declare extra dependencies via a dataset if your component requires to read data hardcoded in the DOM and read them.

- [state.resp] You need to return the data, normally HTML strings in the key "`.resp`".

- [data-change] is the _default callback_. For example, you have a form with a `data-submit`:

```html
<form id="fm" data-submit="addItem"></form>
```

This triggers the action below:

```js
addItem: (e) => {
  e.preventDefault();
  todoState.target = ulis;
  todoState.val = [...todoState.val, { id: ++i, label: inputState.val }];
  fm.reset(), (inputState.val = "");
},
```

Since we send a new state, we want to render this new state. The target element "#ulis" contains a `data-change="display"`:

```html
<ul id="ulis" data-change="display"></ul>
```

Biny will run the callback "display":

```js
display: () => {
  todoState.target = ulis;
  todoState.resp = todoState.val.map((todo) => TodoItem(todo));
},
```

## Reactivity pattern

We use the simple `event` loop and a "diffing function" to detect the 6 following changes made to the state: "assign", "append", "clear", "remove", "update" and "swap" (rows).

## Test

The performance is close to the Vanilla [JS code specific for this test](https://github.com/krausest/js-framework-benchmark) to which we compare the Biny package.

<img width="193" alt="Screenshot 2023-06-29 at 16 30 43" src="https://github.com/ndrean/binyJS/assets/6793008/42d79563-5015-4551-ad0c-12015052d28b">

<img width="189" alt="Screenshot 2023-06-29 at 16 31 17" src="https://github.com/ndrean/binyJS/assets/6793008/43a165fb-6e16-4891-baa3-47bc9ef7a1e5">

## Examples

The code for the examples:

- the famous counter: <https://github.com/ndrean/binyJS/blob/main/examples/button.js>
- a Select and Datalist: <https://github.com/ndrean/binyJS/blob/main/examples/select.js>

- a basic "todo" list: <https://github.com/ndrean/binyJS/blob/main/examples/todo.js>

- the famous TODOMVC: <https://github.com/ndrean/binyJS/blob/main/examples/todoMVC/todoMVC.js>
- the bench JS-framework test: <https://github.com/ndrean/binyJS/blob/main/examples/jsbench/bench.js>.
