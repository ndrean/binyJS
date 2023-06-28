const A = (t) => Object.assign(Object.create(w), t), w = {
  get resp() {
    return this._resp;
  },
  set resp(t) {
    this._resp = t, Array.isArray(t) || (this.renderAction = "assign", this._resp = [t]), this._resp && this._target && h({
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
      const { diff: l, action: o, curM: i, swap: n } = z({
        v: t,
        curM: new Map([...e.oldVal]),
        key: s
      });
      e.swap = n, e.oldVal = i, e._val = l, e.renderAction = o;
    }
    if (e.renderAction === "clear")
      return h({
        target: e.target,
        renderAction: e.renderAction
      });
    e._val && (["remove", "swap"].includes(e.renderAction) ? h({
      target: e.target,
      renderAction: e.renderAction,
      key: e.key,
      swap: e.swap
    }) : e.target && e.target.dispatchEvent(new Event("change"))), !Array.isArray(t) && (e.oldVal = t), e._val = t;
  }
}, d = {
  get actions() {
    return this._actions;
  },
  set actions(t) {
    this._actions = t;
  }
}, _ = (t) => d.actions = t;
function f(t) {
  console.log(t);
  for (let e of [...t.querySelectorAll("[data-change]")])
    e.onchange = d.actions[e.dataset.change];
  for (let e of [...t.querySelectorAll("[data-input]")])
    e.oninput = d.actions[e.dataset.input];
  for (let e of [...t.querySelectorAll("[data-submit]")])
    e.onsubmit = d.actions[e.dataset.submit];
  for (let e of [...t.querySelectorAll("[data-click]")])
    e.onclick = d.actions[e.dataset.click];
}
window.addEventListener("load", () => f(app));
function u(t, e) {
  const s = t.tagName;
  let l;
  return s === "TBODY" ? l = new DOMParser().parseFromString(`<table><tbody>${e}</tbody></table>`, "text/html").querySelector("tbody") : l = new DOMParser().parseFromString(`<${s}>${e}</${s}>`, "text/html").querySelector(s), f(l), l.childNodes;
}
function h({ target: t, response: e, renderAction: s, key: l, swap: o }) {
  ({
    assign: () => (t.innerHTML = e.join(""), f(t)),
    append: () => {
      const n = u(t, e);
      t.append(...n);
    },
    clear: () => (t.innerHTML = "", f(document)),
    remove: () => t.parentElement.removeChild(t),
    swap: () => {
      const [n, r] = o;
      t.insertBefore(t.children[n - 1], t.children[r - 1]), t.insertBefore(t.children[r - 1], t.children[n - 1]);
    },
    update: function() {
      const n = [...u(t, e)], r = n[0].getAttribute("key");
      for (let c of n)
        t.childNodes[c.getAttribute("key") - r].replaceWith(
          c
        );
    }
  })[s]();
}
function z({ v: t, curM: e, key: s }) {
  if (t.length === 0 && e.size > 1)
    return {
      action: "clear",
      curM: /* @__PURE__ */ new Map(),
      diff: [],
      swap: []
    };
  {
    const l = e.size, o = /* @__PURE__ */ new Map(), i = new Map([...e]), n = [];
    for (let a of t)
      e.has(a) ? i.delete(a) : (e.set(a, a[s]), o.set(a, a[s]));
    if (i.size > 0)
      for (let a of i.keys())
        e.delete(a);
    if (o.size == 0) {
      let a = [...e.entries()].sort(
        ([p, g], [y, k]) => p[s] < y[s] && -1
      );
      for (let [p, g] of [...t.entries()])
        g[s] !== a[p][1] && (n.push(p + 1), e.set(a[p][0], g[s]));
      a = [];
    }
    let r;
    i.size == 1 && o.size == 0 ? r = "remove" : n.length > 0 ? r = "swap" : i.size == 0 && l > 0 ? r = "append" : i.size == 0 && l == 0 ? r = "assign" : i.size == o.size && o.size < e.size ? r = "update" : r = "assign";
    let c;
    return i.size > 0 && o.size == 0 ? c = [...i.keys()] : c = [...o.keys()], {
      action: r,
      diff: c,
      curM: e,
      swap: n.sort()
    };
  }
}
const b = {
  state: A,
  Actions: _
};
export {
  b as default
};
