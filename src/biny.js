const state = (stateObj) => Object.assign(Object.create(stateProto), stateObj);

const stateProto = {
  get resp() {
    return this._resp;
  },
  set resp(r) {
    this._resp = r;

    if (!Array.isArray(r)) (this.renderAction = "assign"), (this._resp = [r]);

    this.renderAction ||= "assign";

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
  set val(newVector) {
    const state = this,
      key = state.key ?? "id";

    state._val = newVector;

    if (Array.isArray(newVector)) {
      !state.oldVal && (state.oldVal = new Map());

      if (state.target) {
        const { diff, action, curMap, swap } = getDiffs({
          newVector,
          curMap: new Map([...state.oldVal]),
          key,
        });

        state.swap = swap;
        state.oldVal = curMap;
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

    if (state._val !== null || state._val !== undefined) {
      if (state.renderAction === "swap") {
        handleAction({
          target: state.target,
          renderAction: state.renderAction,
          key: state.key,
          swap: state.swap,
          response: state._val,
        });
      } else {
        state.target && state.target.dispatchEvent(new Event("change"));
      }
    }

    !Array.isArray(newVector) && (state.oldVal = newVector);
    (state._val = newVector), (state.renderAction = "");
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
  for (let node of [...dom.querySelectorAll(`[data-input]`)]) {
    node.oninput = actionsProto.actions[node.dataset.input];
  }
  for (let node of [...dom.querySelectorAll(`[data-submit]`)]) {
    node.onsubmit = actionsProto.actions[node.dataset.submit];
  }
  for (let node of [...dom.querySelectorAll(`[data-click]`)]) {
    node.onclick = actionsProto.actions[node.dataset.click];
  }
}

window.addEventListener("load", () => parseListeners(app));

// ---- parsing string -> Node
function parse(dom, result) {
  const tag = dom.tagName;
  let newDom;
  tag === "TBODY"
    ? (newDom = new DOMParser()
        .parseFromString(`<table><tbody>${result}</tbody></table>`, "text/html")
        .querySelector("tbody"))
    : (newDom = new DOMParser()
        .parseFromString(`<${tag}>${result}</${tag}>`, "text/html")
        .querySelector(tag));

  parseListeners(newDom);
  return newDom.childNodes;
}

// --- rendering
function handleAction({ target: dom, response, renderAction, key, swap }) {
  const ActionMapping = {
    assign: () => ((dom.innerHTML = response.join("")), parseListeners(dom)),
    append: () => {
      const newNodes = parse(dom, response.join(""));
      dom.append(...newNodes);
    },
    clear: () => ((dom.innerHTML = ""), parseListeners(document)),
    remove: () => {
      const nodes = parse(dom, response.join(""));
      for (let node of [...nodes]) {
        const keyID = Number(node.getAttribute("key"));
        dom.querySelector(`[key="${keyID}"]`).remove();
      }
    },
    swap: () => {
      const [o, n] = swap;
      dom.insertBefore(dom.children[o - 1], dom.children[n - 1]);
      dom.insertBefore(dom.children[n - 1], dom.children[o - 1]);
    },
    update: function () {
      const newNodes = [...parse(dom, response.join(""))];
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
function getDiffs({ newVector, curMap, key }) {
  /*
  when last of list is remonewVectored, [] is receinewVectored, so action would be "clear". To avoid this, we check that "oldVal" has only one elt
  */
  if (newVector.length === 0 && curMap.size > 1) {
    return {
      action: "clear",
      curMap: new Map(),
      diff: [],
      swap: [],
    };
  } else {
    const initSize = curMap.size,
      d = new Map(),
      clone = new Map([...curMap]),
      swap = [];

    /* 
      "v" is the new data as a list", and "curMap" is the current map whose keys are the objects. {obj => obj.id}
      Build 2 lists, "d" & "clone" to determine if "v" is a subset or superset or modification of curMap
      "d" should contain all new/modified objects from v not in curMap
      "clone" is a subset of curMap containing all objects not in v
      curMap is appended with any new object
      */
    for (let o of newVector) {
      if (curMap.has(o)) {
        clone.delete(o);
      } else {
        curMap.set(o, o[key]);
        d.set(o, o[key]);
      }
    }

    /* 
    clone contains objects in curMap not in newVector, so we remove them
    curMap should be "newVector", or its map version and we detected the difference "d" between "newVector" and "curMap"
    */
    if (clone.size > 0) {
      for (let o of clone.keys()) {
        curMap.delete(o);
      }
    }

    /*
    REMOVE is when d.size=0 and clone.size>0 
   
    APPEND is when clone.size=0 and d.size>0
    
    UPDATE:different objects but same values: [obj1=>ob.id] => [obj2 => ob.id]
    is when d.size == clone.size && d.size<curMap.size (otherwise its an ASSIGN, all new)
    
    SWAP:same object but different value: [obj1 => ob.id] => [obj1 => ob.id']
    detected below
    
    ASSIGN is the rest when not SWAP
    */

    // <--SWAP: occurs only when same objects, thus d.size==0
    if (d.size == 0) {
      let curE = [...curMap.entries()].sort(
        ([x, y], [z, t]) => x[key] < z[key] && -1
      );

      for (let [i, o] of [...v.entries()]) {
        if (o[key] !== curE[i][1]) {
          swap.push(i + 1);
          curMap.set(curE[i][0], o[key]);
        }
      }
      curE = [];
    }
    // -->

    let action, diff;

    if (clone.size > 0 && d.size == 0) {
      (action = "remove"), (diff = [...clone.keys()]);
    } else if (swap.length > 0) {
      (action = "swap"), (diff = [...d.keys()]);
    } else if (clone.size == 0 && d.size > 0 && initSize > 0) {
      (action = "append"), (diff = [...d.keys()]);
    } else if (clone.size == d.size && d.size < curMap.size) {
      (action = "update"), (diff = [...d.keys()]);
    } else {
      (action = "assign"), (diff = newVector);
    }

    return {
      action,
      diff,
      curMap,
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
