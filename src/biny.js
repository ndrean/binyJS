let key;
const state = (stateObj) => Object.assign(Object.create(stateProto), stateObj);
const stateProto = {
  currVal: new Map(),
  get resp() {
    return this._resp;
  },
  set resp(r) {
    this._resp = r;

    console.log(this.renderAction);
    this._resp &&
      this.renderAction &&
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
    // remove undefined on input
    if (!v) return;
    key = this._key;

    // if (this._action === "submit" && this._target) {
    //   this._val = diffM(v, this.currVal, "id");
    //   dispatch(this._target);
    //   return (this.currVal = new Map([...v])), (this._val = v);
    // }

    if (Array.isArray(v) && this._target) {
      const { diff, action, curM, swap } = getDiffs({
        v,
        curM: this.currVal,
        key,
      });

      this.swap = swap;
      this.currVal = curM;
      this._val = diff ?? v;
      this.renderAction = action;
    } else {
      console.log("Wilkomen");
    }

    ["clear", "remove", "swap"].includes(this.renderAction)
      ? handleAction({
          target: this._target,
          renderAction: this.renderAction,
          key: this._key,
          swap: this.swap,
        })
      : this._target && dispatch(this._target);

    this._val = v;
    this.currVal ||= !Array.isArray(v) && v;
  },
};
// event "change" triggered on state change
function dispatch(target) {
  target.dispatchEvent(new Event("change"));
}

/* ----- 
Initialize actions to setup "onchange" listeners after each rebuilt via the Actions
------*/
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
      const newNodes = parse(dom, response);
      const ids = [...newNodes].map((node) => node.id);
      for (let newNode of [...newNodes]) {
        dom.childNodes[newNode.id - ids[0]].replaceWith(newNode);
      }

      /*
      const initID = getIdFromRow(response[0], key);
      for (let newNode of response) {
        // dom.querySelector(
        //   `[${key}="${getIdFromRow(newNode, key)}"]`
        // ).innerHTML = newNode;
        dom.childNodes[getIdFromRow(newNode, key) - initID].innerHTML = newNode;
      }
      */
    },
  };

  Object.keys(ActionMapping).includes(renderAction) &&
    ActionMapping[renderAction]();
  // window.requestAnimationFrame(ActionMapping[renderAction]);
}

//---  DIFFING FUNCTION ---
function getDiffs({ v, curM, key }) {
  window.performance.mark("start");

  if (!v.length == 0) {
    const initSize = curM.size,
      d = new Map(),
      s = new Map(),
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

    performance.mark("end");
    console.log(performance.measure("diff", "start", "end").duration);
    return {
      action,
      diff,
      curM: curM,
      swap: swap.sort(),
    };
  } else {
    return {
      action: "clear",
      curM: new Map(),
      diff: undefined,
      swap: undefined,
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
*/

/*
    for (let i = 0; i < response.length; i += 1000) {
      const res = await createPartial(dom, response.slice(i, i + 1000));
      // i === 0 ? dom.replaceChildren(res) : dom.append(res);
      dom.append(res);
    }
    */
//  {
//   const empty = dom.cloneNode();
//   dom.parentElement.replaceChild(empty, dom);
// },

/*
function getIdFromRow(row, key) {
  performance.mark("startregex");
  const rgxId = new RegExp(`\\s${key}=([^> ]*)`, "g");
  const res = [...row.matchAll(rgxId)][0][1];
  performance.mark("endregex");
  console.log(performance.measure("regex", "startregex", "endregex").duration);
  return res;
}
*/
