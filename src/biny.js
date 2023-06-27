const state = (stateObj) => Object.assign(Object.create(stateProto), stateObj);

const stateProto = {
  get resp() {
    return this._resp;
  },
  set resp(r) {
    this._resp = r;

    if (!Array.isArray(r)) (this.renderAction = "assign"), (this._resp = [r]);

    this._resp &&
      this._target &&
      handleAction({
        target: this._target,
        renderAction: this.renderAction,
        response: this._resp,
        key: this.key,
      });

    this._resp = "";
  },
  get key() {
    return this._key;
  },
  set key(k) {
    this._key = k;
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
    const state = this,
      key = state.key ?? "id";

    state._val = v;

    if (Array.isArray(v)) {
      !state.oldVal && (state.oldVal = new Map());

      if (state.target) {
        const { diff, action, curM, swap } = getDiffs({
          v,
          curM: new Map([...state.oldVal]),
          key,
        });

        state.swap = swap;
        state.oldVal = curM;
        state._val = diff;
        state.renderAction = action;
      }
    }

    if (state.renderAction === "clear") {
      return handleAction({
        target: state.target,
        renderAction: state.renderAction,
      });
    }

    if (state._val) {
      if (["remove", "swap"].includes(state.renderAction)) {
        handleAction({
          target: state.target,
          renderAction: state.renderAction,
          key: state.key,
          swap: state.swap,
        });
      } else {
        state.target && state.target.dispatchEvent(new Event("change"));
      }
    }

    !Array.isArray(v) && (state.oldVal = v);
    state._val = v;
  },
};

const actionsProto = {
    get actions() {
      return this._actions;
    },
    set actions(obj) {
      this._actions = obj;
    },
  },
  Actions = (funcs) => (actionsProto.actions = funcs);

function parseListeners(dom) {
  for (let node of [...dom.querySelectorAll(`[data-change]`)]) {
    node.onchange = actionsProto.actions[node.dataset.change];
  }
}

window.addEventListener("load", () => parseListeners(app));

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
function handleAction({ target: dom, response, renderAction, key, swap }) {
  const ActionMapping = {
    assign: () => (dom.innerHTML = response.join("")),
    append: () => dom.insertAdjacentHTML("beforeEnd", response.join("")),
    clear: () => ((dom.innerHTML = ""), parseListeners(document)),
    remove: () => dom.parentElement.removeChild(dom),
    swap: () => {
      const [o, n] = swap;
      dom.insertBefore(dom.children[o - 1], dom.children[n - 1]);
      dom.insertBefore(dom.children[n - 1], dom.children[o - 1]);
    },
    update: function () {
      const newNodes = [...parse(dom, response)];
      const initID = newNodes[0].getAttribute("key");
      for (let newNode of newNodes) {
        dom.childNodes[newNode.getAttribute("key") - initID].replaceWith(
          newNode
        );
      }
    },
  };
  ActionMapping[renderAction]();
}

//---  DIFFING FUNCTION ---
function getDiffs({ v, curM, key }) {
  if (v.length === 0 && curM.size > 1) {
    return {
      action: "clear",
      curM: new Map(),
      diff: undefined,
      swap: undefined,
    };
  } else {
    const initSize = curM.size,
      d = new Map(),
      clone = new Map([...curM]),
      swap = [];

    for (let o of v) {
      if (curM.has(o)) {
        clone.delete(o);
      } else {
        curM.set(o, o[key]);
        d.set(o, o[key]);
      }
    }

    if (clone.size > 0) {
      for (let o of clone.keys()) {
        curM.delete(o);
      }
    }

    // <-- swap
    if (d.size == 0) {
      let curE = [...curM.entries()].sort(
        ([x, y], [z, t]) => x[key] < z[key] && -1
      );

      for (let [i, o] of [...v.entries()]) {
        if (o[key] !== curE[i][1]) {
          swap.push(i + 1);
          curM.set(curE[i][0], o[key]);
        }
      }
      curE = [];
    }
    // -->

    let action;
    if (clone.size == 1 && d.size == 0) {
      action = "remove";
    } else if (swap.length > 0) {
      action = "swap";
    } else if (clone.size == 0 && initSize > 0) {
      action = "append";
    } else if (clone.size == 0 && initSize == 0) {
      action = "assign";
    } else if (clone.size == d.size && d.size < curM.size) {
      action = "update";
    } else {
      action = "assign";
    }

    let diff;
    clone.size > 0 && d.size == 0
      ? (diff = [...clone.keys()])
      : (diff = [...d.keys()]);

    return {
      action,
      diff,
      curM,
      swap: swap.sort(),
    };
  }
}

export default {
  state,
  Actions,
};

/*
const createPartial = async (dom, elements) => {
  const fgmt = new DocumentFragment();
  return new Promise((resolve) => {
    fgmt.append(...parse(dom, elements));
    resolve(fgmt);
  });
};

for (let i = 0; i < response.length; i += 1000) {
  const res = await createPartial(dom, response.slice(i, i + 1000));
  // i === 0 ? dom.replaceChildren(res) : dom.append(res);
  dom.append(res);
}
    
function getIdFromRow(row, key) {
  performance.mark("startregex");
  const rgxId = new RegExp(`\\s${key}=([^> ]*)`, "g");
  const res = [...row.matchAll(rgxId)][0][1];
  performance.mark("endregex");
  console.log(performance.measure("regex", "startregex", "endregex").duration);
  return res;
}
*/
