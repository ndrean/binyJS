import B from "binyjs";

const mystate = B.state({ val: 0 }),
  actions = B.Actions({
    inc: () => {
      mystate.val = mystate.val + 1;
    },
    display: () => (mystate.resp = `<span>binyJS state: ${mystate.val}</span>`),
  });

window.onload = () => {
  mystate.target = count;
  actions.display();
  counter.addEventListener("click", () => {
    actions.inc();
  });
};

app.innerHTML = `
  <div>
    <h1>Hello biny</h1>
    <div>
      <button id="counter" type="button">
      <span data-change="display" id="count"></span>
      </button>
    </div> 
  </div>
`;
