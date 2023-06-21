# Reactivity pattern

Test mode for <https://github.com/krausest/js-framework-benchmark>

We use the simple `event` way. The flow is:

- an event is triggered (such as a "click"),
- the EventListener on "click" runs a function depending on the context taken from the `dataset` in the sender,
- this function mutates a state object,
- in the state update, you trigger a "change" Event and target a component. This target was set in the state object.
- this target has an "onchange" listener which runs a function,
- this function will update the `.resp` key of the state object,
- the state setter will run a function to update the DOM.
