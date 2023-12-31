// import B from "../src/biny.js";
import B from "binyjs";
// import B from "../../src/biny";
import { A, N, C } from "./constants.js";

//
let nextId = 1;

const random = (max) => Math.round(Math.random() * 1000) % max;
const buildData = (count) => {
  const data = new Array(count);
  for (let i = 0; i < count; i++) {
    data[i] = {
      id: nextId++,
      label: `${A[random(A.length)]} ${C[random(C.length)]} ${
        N[random(N.length)]
      }`,
    };
  }
  return data;
};

function remove(target) {
  const tg = target.closest("tr");
  const keyId = Number(tg.getAttribute("key"));
  if (select.val === keyId) select.val = 0;
  const idx = data.val.findIndex((d) => d.id === keyId);
  return [...data.val.slice(0, idx), ...data.val.slice(idx + 1)];
}

//  !!! immutable way
function update() {
  const cp = [...data.val];
  for (let i = 0; i < cp.length; i += 10) {
    const r = cp[i];
    cp[i] = { id: r.id, label: r.label + " !!!" };
  }
  return cp;
}

let l = 999;
function swap() {
  let len = data.val.length;
  if (len < l - 1) {
    return data.val;
  } else {
    let tmp = data.val[l - 1];
    (data.val[l - 1] = data.val[1]), (data.val[1] = tmp);
    return data.val;
  }
}

const data = B.state({ val: [], key: "id" }),
  select = B.state({ val: 0 }),
  actions = B.Actions({
    clear: () => ((data.target = tbody), (select.val = 0), (data.val = [])),
    select: ({ target }) => {
      document
        .querySelector(`[key="${select.val}"]`)
        ?.classList.remove("danger");
      select.val = target.closest("tr").getAttribute("key");
      document.querySelector(`[key="${select.val}"]`).classList.add("danger");
    },
    delete: ({ target }) => {
      data.val = remove(target);
    },
    create: (e) => {
      data.target = tbody;
      const deps = Number(e.target.dataset.deps);
      data.val = buildData(deps);
    },
    append: () => {
      data.target = tbody;
      data.val = [...data.val, ...buildData(1000)];
    },
    update: () => (data.val = update()),
    swap: () => (data.val = swap()),
    // callbacks: return  in "state.response"
    buildRows: () => {
      data.target = tbody;
      data.resp = data.val.map((item) => Row(item));
    },
  });

const Row = ({ id, label }) =>
  `<tr key="${id}"><td class="col-md-1">${id}</td><td class="col-md-4"><a data-click="select" >${label}</a></td><td class="col-md-1"><a data-click="delete"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></a></td><td class="col-md-6"></td></tr>`;

const Button = ({ id, text, deps, action }) =>
  `<div class='col-sm-6 smallpad'><button id=${id} class="btn btn-primary btn-block" type="button" data-click=${action} data-deps=${deps} >${text}</button></div>`;

const App = () =>
  `<div class="container"><div class="jumbotron"><div class="row"><div class="col-md-6"><h1>BinyJS keyed</h1></div><div class="col-md-6"><div class="row">${Button(
    { id: "run", text: "Create 1000 rows", deps: "1000", action: "create" }
  )}${Button({
    id: "runlots",
    text: "Create 10,000 rows",
    deps: "10000",
    action: "create",
  })}${Button({
    id: "add",
    text: "Append 1,000 rows",
    deps: "1000",
    action: "append",
  })}${Button({
    id: "update",
    text: "Update every 10th row",
    action: "update",
  })}${Button({ id: "clear", text: "Clear", action: "clear" })}${Button({
    id: "swaprows",
    text: "Swap Rows",
    action: "swap",
  })}</div></div></div></div></div><table class="table table-hover table-striped test-data"><tbody id="tbody" data-change="buildRows"></tbody></table><span class="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span></div>`;

app.innerHTML = App();
