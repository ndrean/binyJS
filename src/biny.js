let key = "id";

const state = (stateObj) => Object.assign(Object.create(stateProto), stateObj);
const stateProto = {
  get resp() {
    return this._resp;
  },
  set resp(r) {
    this._resp = r;
    this._resp &&
      this._action &&
      this._target &&
      handleAction({
        target: this._target,
        newValues: this._val,
        oldValues: this.oldVal,
        action: this._action,
        response: this._resp,
      });
    this._resp = "";
  },
  get deps() {
    return this._deps;
  },
  set deps(d) {
    this._deps = d;
  },
  get target() {
    return this._target;
  },
  set target(t) {
    this._target = t;
  },
  get action() {
    return this._action;
  },
  set action(a) {
    this._action = a;
  },
  get val() {
    return this._val;
  },
  set val(v) {
    // remove undefined on input
    if (!v) return;

    if (this._action === "submit" && this._target) {
      this._val = diffM(v, this.oldVal, "id");
      dispatch(this._target);
      return (this.oldVal = v), (this._val = v);
    }

    this._val = v;
    this._action === "append" && (this._val = diffM(v, this.oldVal, key));
    this._action === "update" && (this._val = diffValues(v, this.oldVal, key));
    // invert the diff to get the removed node
    this._action === "remove" && (this._val = diffM(this.oldVal, v, key));

    ["swap", "clear", "remove"].includes(this._action)
      ? handleAction({
          target: this._target,
          newValues: this._val,
          oldValues: this.oldVal,
          action: this._action,
        })
      : this._target && dispatch(this._target);

    (this._val = v), (this.oldVal = v);
  },
};
// event "change" triggered on state change
function dispatch(target) {
  target.dispatchEvent(new Event("change"));
}

/* ----- 
"onchange" listeners
- initialize
- setup "onchange" listeners after each rebuilt via the Actions
------*/
window.addEventListener("load", () => ParseListeners(app));

const actionsProto = {
  get actions() {
    return this._actions;
  },
  set actions(obj) {
    this._actions = obj;
  },
};

const Actions = (funcs) => (actionsProto.actions = funcs);

async function ParseListeners(dom) {
  return new Promise(() => {
    return setTimeout(() => {
      for (let node of [...dom.querySelectorAll(`[data-change]`)]) {
        node.onchange = actionsProto.actions[node.dataset.change];
      }
    });
  }, 0);
}

// ---- parsing string -> Node

function parse(dom, result) {
  const tag = dom.tagName;
  return tag === "TBODY"
    ? new DOMParser()
        .parseFromString(`<table><tbody>${result}</tbody></table>`, "text/html")
        .querySelector("tbody").childNodes
    : new DOMParser()
        .parseFromString(`<${tag}>${result}</${tag}>`, "text/html")
        .querySelector(tag).childNodes;
}

// --- rendering
function handleAction({
  target: dom,
  response,
  action,
  newValues,
  oldValues,
  id,
}) {
  const ActionMapping = {
    inc: () => (dom.innerHTML = response),
    create: () => (
      dom.replaceChildren(...parse(dom, response)), ParseListeners(dom)
    ),
    append: () => (dom.append(...parse(dom, response)), ParseListeners(dom)),
    clear: () => {
      const empty = dom.cloneNode();
      dom.parentElement.replaceChild(empty, dom);
      ParseListeners(document);
    },
    removeId: () => document.getElementById(id).remove(),
    remove: () => dom.parentElement.removeChild(dom),
    swap: () => {
      if (newValues.length < 1000) return;
      const [o, n] = swaps(newValues, oldValues, key);
      dom.insertBefore(dom.children[o - 1], dom.children[n - 1]);
      dom.insertBefore(dom.children[n], dom.children[o]);
    },
    update: () => {
      if (!response) return;
      const newNodes = parse(dom, response);
      const diffKeys = newValues.map((ob) => ob.id);
      for (let idx of diffKeys) {
        document
          .querySelector(`[id="${idx}"]`)
          .replaceWith([...newNodes].find((node) => Number(node.id) === idx));
      }
    },
  };

  setTimeout(
    () =>
      Object.keys(ActionMapping).includes(action) && ActionMapping[action](),
    0
  );
}

//---  DIFFING FUNCTIONS ---
const toMap = (arr, inputKey) => {
  if (arr === [] || arr === undefined) return new Map();

  const m = new Map();
  for (let obj of arr) {
    m.set(obj[inputKey], obj);
  }
  return m;
};

// diff append or replace
function diffM(newArray, oldArray, inputKey) {
  const mapO = toMap(oldArray, inputKey),
    mapN = toMap(newArray, inputKey);

  for (let k of mapN.keys()) {
    if (mapO.get(k) === mapN.get(k)) mapN.delete(k);
  }

  const res = [];
  for (let o of mapN.entries()) {
    res.push(o[1]);
  }
  return res;
}

const obMap = (arr, inputKey) => {
  const m = new Map();
  for (let [i, o] of arr.entries()) {
    m.set(o, i + 1);
  }
  return m;
};

// diff on values on the SAME set
function diffValues(newArray, oldArray, inputKey) {
  const mapN = obMap(newArray, inputKey),
    mapO = obMap(oldArray, inputKey);

  let res = [];
  for (let ob of mapN.keys()) {
    !mapO.has(ob) && res.push(ob);
  }
  return res;
}

// diff SWAPS in the SAME set
const swaps = (newArray, oldArray, inputKey) => {
  const mapN = obMap(newArray, inputKey),
    mapO = obMap(oldArray, inputKey);

  let swaps = new Set();
  for (let o of newArray) {
    if (mapO.get(o) !== mapN.get(o)) {
      swaps.add(mapO.get(o)), swaps.add(mapN.get(o));
    }
  }
  return [...swaps];
};

export default {
  state,
  Actions,
};
