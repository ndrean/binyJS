# BinyJS

It is a small vanilla Javascript project of 1.4kB to help to write reactive UI.
[![npm bundle size](https://img.badgesize.io/ndrean/binyjs/main/dist/binyjs.umd.cjs?compression=gzip)](https://bundlephobia.com/package/binyjs@0.3.3)

It can handle _arrays_ as demonstrated in the "JS-framework" bench test. It uses an immutable state and computes the diff to render the desired DOM elements.

You write HTML as strings with normal interpolation.

It uses state variables with the convention of using "stateVariable"`.val` as a setter and getter.

Instead of writing "event" listeners in your HTML (where "event" can be "click" or "submit" or "change" or "input"), you write a `dataset` and reference a function.

It uses the key "stateVariable"`.resp` to set the rendered DOM elements.

It relies on _unique keys_; you need to use the `key` attribute in the HTML to identify each element of the rendered DOM array. You need to pass to the state variable the unique identifier you use in your data (eg `key: "id"`). Both "key" are different.

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
<form data-action="addItem" id="fm" data-submit="addItem"></form>
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

<img width="244" alt="Screenshot 2023-06-28 at 11 07 25" src="https://github.com/ndrean/binyJS/assets/6793008/4a71c026-178b-4866-a1aa-07e754acbbe2">

<img width="262" alt="Screenshot 2023-06-28 at 11 01 24" src="https://github.com/ndrean/binyJS/assets/6793008/e0f1f777-00ef-49af-ace1-1f3d48c993f4">

 
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
