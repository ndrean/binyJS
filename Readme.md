# BinyJS

It is a vanilla Javascript project to write a tiny reactive UI.

There is no templating: you write HTML as a string and pass in variables by normal interpolation. It uses `addEventListener` to trigger actions.

Reactivity arises since you use state variables.

You setup the related actions in the HTML with `dataset`. You also link the components with the action and target.

> This library heavily relies on _unique keys_ when dealing with lists.

## Reactivity pattern

We use the simple `event` loop. The flow is:

- an event is triggered (such as a "click"),
- the EventListener on "click" runs a function as it reads the `dataset` of the `event.target`. You also setup the targeted component where to render.
- this function mutates a state object,
- in the state update, you run a function to get calculate the **diff** between the "old" data and the "new" data.
- this _diff_ function will detect the change: a clearall, a delete, an assign, an append, an update or a swap between rows.
- if you have a diff, it emits a "change" `new Event` and target a component. This target was set in the state object.
- this target has an **"onchange" listener** which runs a function,
- this function will update the `.resp` key of the state object,
- the state setter will run the function designed by the diff function to update the DOM accordingly.

## Test

Todo: <https://github.com/krausest/js-framework-benchmark>

## Examples

- a basic "todo" list is given: <https://github.com/ndrean/binyJS/blob/main/examples/todo.js>

- the bench framework test: <https://github.com/ndrean/binyJS/blob/main/examples/bench.js> as found in (<https://github.com/krausest/js-framework-benchmark>).
