// import B from "../src/biny";
import B from "binyjs";

const counter = B.state({ val: 0 }),
  actions = B.Actions({
    inc: () => (counter.val += 1),
    display: () => {
      counter.target = count;
      counter.resp = `<span>binyJS state: ${counter.val}</span>`;
    },
  });

window.onload = () => actions.display();

app.innerHTML = `
  <div>
    <h1>Hello biny</h1>
    <div>
      <button type="button" data-click="inc">
      <span data-change="display" id="count"></span>
      </button>
    </div> 
  </div>
`;
