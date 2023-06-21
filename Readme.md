# BinyJS

It is a vanilla Javascript project to write reactive UI. It is under 200 LOC.

There is no templating: you write HTML as a string and pass in variables by normal interpolation. Reactivity arises when you use state variables, setup the related actions and target to this state and set some`dataset`in the HTML to link the components with the action and target.

> This library heavily relies on _unique IDs_ when dealing with lists.

## Reactivity pattern

We use the simple `event` way. The flow is:

- an event is triggered (such as a "click"),
- the EventListener on "click" runs a function depending on the context taken from the `dataset` in the sender,
- this function mutates a state object,
- in the state update, you trigger - when needed - a "change" Event and target a component. This target was set in the state object.
- this target has an "onchange" listener which runs a function,
- this function will update the `.resp` key of the state object,
- the state setter will run a function to update the DOM.

## Examples

A basic "todo" list is given, as well as the bench framework test (<https://github.com/krausest/js-framework-benchmark>).

## Test

Test mode for <https://github.com/krausest/js-framework-benchmark>
