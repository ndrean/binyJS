# BinyJS

It is a small vanilla Javascript project of 1.3kB (cf [bundlephobia](https://bundlephobia.com/package/binyjs@0.3.0)) to write reactive UI.

> This library heavily relies on _unique keys_ when dealing with lists.

You use datasets, state variables and global event listeners. The state is required to be immutable. It uses the event loop and a "diffing" function to detect which mutation you made. It then runs the corresponding render action to the DOM on a selected target.

You write your components as HTML strings with normal interpolation. Avoid CRs and whitespaces between your HTML tags.

The other ingredients are:

- [state variables] If say "data" is a state variable, you instantiate it to declare it with `data = B.state({val: [], key: "id"})` and you have a getter and a setter with "data.val". Immutability is required.
- [keys] Whenever you render a list of components, use the attribute `key` in the HTML string you want to render and in your _selectors_. You also need to declare the id used in your data. In the "todo" example, you render a "li" and your data is in the form "data = [{id:1, label: "ok},...]":

```js
const TodoItem = ({ id, label }) =>
  `<li key="${id}"><span style="display:flex;"><label style="margin-right:10px;">${label}</label><input type="checkbox" id="ckb" data-action="removeLi" value=${inputState.val}/></spa n></li>`;
```

- [data-action] These datasets link a component to an action that you will define; it looks like `data-action="create"` where "create" is the function you build. You will also need to declare the _targeted component_: this tells _where_ you want to render the reactive data. You can choose another name than "action".
- [global listeners] You can have "click", "submit", "input". Inside your global listener, you must declare the target for each reactive state variable. The target contains the dataset, so you get the `data-action` that you must set. It looks like `data.target=tbody`. You can also declare extra dependencies via a dataset if your component requires to read data hardcoded in the DOM. In the "todo" example, you have:

```js
document.addEventListener("input", ({ data, target }) => {
  todoState.target = ulis;
  inputState.target = todoInput;
  return actions[target.dataset.action](data);
});
```

- [data-change] These are callbacks you declare in the targeted component where the reactive data will be rendered. This function is attached to this "onchange" listener. It looks like `data-change="buildRows"` where the function "buildRows" will return an HTML string of the HTML you want to render. You need to return the data, normally HTML strings in the key "resp", so it looks like `data.resp=<p>...</p>`.

In the "todo" example, you define a callback:

```js
<ul id="ulis" data-change="display"></ul>
```

and in the "actions", you define it:

```js
display: () =>
(todoState.resp = todoState.val.map((todo) => TodoItem(todo))),
```

Since the "data-action" targeted the "ulis" (`todoState.target = ulis`), this callback will run.

- You pass global event listeners ("click", "input", "change", "submit").

## Reactivity pattern

Reactivity arises when you mutate state variables in your "data-action" functions. We use the simple `event` loop and a "diffing function". The flow follows a few conventions:

## Test

The performance is close to the Vanilla [JS code specific for this test](https://github.com/krausest/js-framework-benchmark) to which we compare the Biny package.

<img width="203" alt="Screenshot 2023-06-27 at 13 33 33" src="https://github.com/ndrean/binyJS/assets/6793008/a869d1e1-9f04-42c9-b8b0-4e7f005c9b4b">

<img width="202" alt="Screenshot 2023-06-26 at 13 17 28" src="https://github.com/ndrean/binyJS/assets/6793008/8dc77a66-6975-4e83-8c3c-eb6df9d257a9">

## Examples

The running bench example:
<https://githubbox.com/ndrean/binyJS/blob/main/examples/bench.js>

The code for the examples:

- a basic "todo" list: <https://github.com/ndrean/binyJS/blob/main/examples/todo.js>

- the bench framework test: <https://github.com/ndrean/binyJS/blob/main/examples/bench.js>.

- select and datalist: <https://github.com/ndrean/binyJS/blob/main/examples/select.js>
- TODOMVC

## Size

<img width="809" alt="Screenshot 2023-06-27 at 13 43 59" src="https://github.com/ndrean/binyJS/assets/6793008/e01ea587-3d09-4815-a354-4d2807255511">
