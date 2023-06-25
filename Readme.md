# BinyJS

It is a small vanilla Javascript project of 1.6kB (cf [bundlephobia](https://bundlephobia.com/package/binyjs@0.2.0)) to write reactive UI.

It is _keyed_ though any key can be used, not only an ID, but you need to declare it.

You use datasets, state variables and global event listeners. It uses the event loop and a "diffing" function to detect which mutation you ran and perform the corresponding render action to the DOM on a selected target.

You write your components as HTML strings with normal interpolation. The other ingredients are:

- [state variables] They will make the app reactive. If say "data" is a state variable, you instantiate it to declare it and you have a getter and a setter with "data.val".
- [data-action] These datasets link a component to an action that you will define. You also declare the targeted component where you want to render the reactive data.
- [data-change] You declare in the targeted component who the reactive data will be rendered via the function attached to this "onchange" listener declare the function you want to render as reactive data.
- You pass global event listeners ("click", "input", "select").

That's it.

You set up the related actions in the HTML with `dataset`. You also link the components with the action and target.

> This library heavily relies on _unique keys_ when dealing with lists.

## Reactivity pattern

Reactivity arises when you mutate state variable in your "data-action" functions. We use the simple `event` loop and a "diffing function". The flow follows a few conventions:

- an event is triggered (such as a "click" or "input"),
- a global EventListener runs a function that is written in a `dataset` of the `event.target`. If you want reactivity, you use a _state variable_. You also need to set up the _targeted component_ for this state variable as to where to render.
- this function mutates a state object,
- in the state update, you run a function to get calculate the **diff** between the "old" data and the "new" data.
- this _diff_ function will detect the change: a clearall, a delete, an assign, an append, an update or a swap between rows where your data is an array.
- if you have a diff, it emits a "change" `new Event` to calculate the desired output in a callback attached to the target component (the "data-change" callback).
- this target has an **"onchange" listener** which runs a function,
- this function _should_ update the `.resp` key of the state object.
- this triggers a state change and triger a DOM update with the appropriate data, appropriate target component and appropriate rendering method detected in the "diff" function.
- the state setter will run the function designed by the diff function to update the DOM accordingly.

## Test

The performance is close to the Vanilla JS code. This is based on the [JS-framework bench testing](https://github.com/krausest/js-framework-benchmark) to which we compare the Biny library to the specific Vannila JS code written for this test.

<img width="237" alt="Screenshot 2023-06-25 at 16 09 50" src="https://github.com/ndrean/binyJS/assets/6793008/7d944ccd-1437-49a9-9658-1b7648eb8de8">
<img width="230" alt="Screenshot 2023-06-25 at 16 09 28" src="https://github.com/ndrean/binyJS/assets/6793008/33da3253-eec2-4d33-a6d1-51fc5d74cec2">

## Examples

- a basic "todo" list is given: <https://github.com/ndrean/binyJS/blob/main/examples/todo.js>

- the bench framework test: <https://github.com/ndrean/binyJS/blob/main/examples/bench.js>.

- datalist
- TODOMVC
