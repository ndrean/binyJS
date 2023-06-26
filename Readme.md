# BinyJS

It is a small vanilla Javascript project of 1.6kB (cf [bundlephobia](https://bundlephobia.com/package/binyjs@0.2.0)) to write reactive UI.

> This library heavily relies on _unique keys_ when dealing with lists.

You use datasets, state variables and global event listeners. The state is required to be immutable. It uses the event loop and a "diffing" function to detect which mutation you made and run the corresponding render action to the DOM on a selected target.

You write your components as HTML strings with normal interpolation. Avoid CRs and whitespaces between your HTML tags.

The other ingredients are:

- [state variables] If say "data" is a state variable, you instantiate it to declare it with `data = B.state({val: [], key: "id"})` and you have a getter and a setter with "data.val". Immutability is required.
- [keys] Whenever you render a list of components, use the attribute `key` in the HTML string you want to render and in your _selectors_. You also need to declare the id used in your data. For example, if your data is in the form "data = [{id:1, label: "ok},...]", then you need to pass "key: id" when you instantiate the state variable.
- [data-action] These datasets link a component to an action that you will define; it looks like `data-action="create"` where "create" is the function you build. You will need to declare the targeted component where you want to render the reactive data. You can choose another name than "action".
- [global listeners] Inside your global listener, you must declare the target for each reactive state variable. It looks like `data.target=tbody`. You can also declare extra dependencies via a dataset if your component requires to read data hardcoded in the DOM.
- [data-change] You declare in the targeted component where the reactive data will be rendered. This function attached to this "onchange" listener. It looks like `data-change="buildRows"` where the function "buildRows" will return an HTML string of the HTML you want to render.
- You pass global event listeners ("click", "input", "select").

That's it.

## Reactivity pattern

(after)
Reactivity arises when you mutate state variable in your "data-action" functions. We use the simple `event` loop and a "diffing function". The flow follows a few conventions:

## Test

The performance is close to the Vanilla [JS code specific for this test](https://github.com/krausest/js-framework-benchmark) to which we compare the Biny package.

<img width="202" alt="Screenshot 2023-06-26 at 13 17 10" src="https://github.com/ndrean/binyJS/assets/6793008/fd8b58a2-6752-4311-9520-957b86b14ccc">
<img width="202" alt="Screenshot 2023-06-26 at 13 17 28" src="https://github.com/ndrean/binyJS/assets/6793008/8dc77a66-6975-4e83-8c3c-eb6df9d257a9">


## Examples

- a basic "todo" list is given: <https://github.com/ndrean/binyJS/blob/main/examples/todo.js>

- the bench framework test: <https://github.com/ndrean/binyJS/blob/main/examples/bench.js>.

- datalist
- TODOMVC
