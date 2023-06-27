// import B from "../src/biny";
import B from "binyjs";

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

window.onload = () => actions.display();

app.innerHTML = `
  <div>
    <h1>Hello biny</h1>
    <div>
      <button id="counter" type="button" data-click="inc">
      <span data-change="display" id="count"></span>
      </button>
    </div> 
  </div>
`;
