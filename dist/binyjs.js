const A = (t) => Object.assign(Object.create(_), t), _ = {
  get resp() {
    return this._resp;
  },
  set resp(t) {
    this._resp = t, Array.isArray(t) || (this.renderAction = "assign", this._resp = [t]), this.renderAction || (this.renderAction = "assign"), this._resp && this._target && u({
      target: this._target,
      renderAction: this.renderAction,
      response: this._resp,
      key: this.key
    }), this._resp = "";
  },
  get key() {
    return this._key;
  },
  set key(t) {
    this._key = t;
  },
  get deps() {
    return this._deps;
  },
  set deps(t) {
    this._deps = t;
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
  set action(t) {
    this._action = t;
  },
  get val() {
    return this._val;
  },
  set val(t) {
    const e = this, s = e.key ?? "id";
    if (e._val = t, Array.isArray(t) && (!e.oldVal && (e.oldVal = /* @__PURE__ */ new Map()), e.target)) {
      const { diff: c, action: n, curMap: l, swap: i } = w({
        newVector: t,
        curMap: new Map([...e.oldVal]),
        key: s
      });
      e.swap = i, e.oldVal = l, e._val = c, e.renderAction = n;
    }
    if (e.renderAction === "clear")
      return u({
        target: e.target,
        renderAction: e.renderAction
      });
    (e._val !== null || e._val !== void 0) && (e.renderAction === "swap" ? u({
      target: e.target,
      renderAction: e.renderAction,
      key: e.key,
      swap: e.swap,
      response: e._val
    }) : e.target && e.target.dispatchEvent(new Event("change"))), !Array.isArray(t) && (e.oldVal = t), e._val = t, e.renderAction = "";
  }
}, f = {
  get actions() {
    return this._actions;
  },
  set actions(t) {
    this._actions = t;
  }
}, k = (t) => f.actions = t;
function p(t) {
  for (let e of [...t.querySelectorAll("[data-change]")])
    e.onchange = f.actions[e.dataset.change];
  for (let e of [...t.querySelectorAll("[data-input]")])
    e.oninput = f.actions[e.dataset.input];
  for (let e of [...t.querySelectorAll("[data-submit]")])
    e.onsubmit = f.actions[e.dataset.submit];
  for (let e of [...t.querySelectorAll("[data-click]")])
    e.onclick = f.actions[e.dataset.click];
}
window.addEventListener("load", () => p(app));
function h(t, e) {
  const s = t.tagName;
  let c;
  return s === "TBODY" ? c = new DOMParser().parseFromString(`<table><tbody>${e}</tbody></table>`, "text/html").querySelector("tbody") : c = new DOMParser().parseFromString(`<${s}>${e}</${s}>`, "text/html").querySelector(s), p(c), c.childNodes;
}
function u({ target: t, response: e, renderAction: s, key: c, swap: n }) {
  ({
    assign: () => (t.innerHTML = e.join(""), p(t)),
    append: () => {
      const i = h(t, e.join(""));
      t.append(...i);
    },
    clear: () => (t.innerHTML = "", p(document)),
    remove: () => {
      const i = h(t, e.join(""));
      for (let r of [...i]) {
        const o = Number(r.getAttribute("key"));
        t.querySelector(`[key="${o}"]`).remove();
      }
    },
    swap: () => {
      const [i, r] = n;
      t.insertBefore(t.children[i - 1], t.children[r - 1]), t.insertBefore(t.children[r - 1], t.children[i - 1]);
    },
    update: function() {
      const i = [...h(t, e.join(""))], r = i[0].getAttribute("key");
      for (let o of i)
        t.childNodes[o.getAttribute("key") - r].replaceWith(
          o
        );
    }
  })[s]();
}
function w({ newVector: t, curMap: e, key: s }) {
  if (t.length === 0 && e.size > 1)
    return {
      action: "clear",
      curMap: /* @__PURE__ */ new Map(),
      diff: [],
      swap: []
    };
  {
    const c = e.size, n = /* @__PURE__ */ new Map(), l = new Map([...e]), i = [];
    for (let a of t)
      e.has(a) ? l.delete(a) : (e.set(a, a[s]), n.set(a, a[s]));
    if (l.size > 0)
      for (let a of l.keys())
        e.delete(a);
    if (n.size == 0) {
      let a = [...e.entries()].sort(
        ([d, g], [y, b]) => d[s] < y[s] && -1
      );
      for (let [d, g] of [...t.entries()])
        g[s] !== a[d][1] && (i.push(d + 1), e.set(a[d][0], g[s]));
      a = [];
    }
    let r, o;
    return l.size > 0 && n.size == 0 ? (r = "remove", o = [...l.keys()]) : i.length > 0 ? (r = "swap", o = [...n.keys()]) : l.size == 0 && n.size > 0 && c > 0 ? (r = "append", o = [...n.keys()]) : l.size == n.size && n.size < e.size ? (r = "update", o = [...n.keys()]) : (r = "assign", o = t), {
      action: r,
      diff: o,
      curMap: e,
      swap: i.sort()
    };
  }
}
const v = {
  state: A,
  Actions: k
};
export {
  v as default
};
