const A = (e) => Object.assign(Object.create(u), e), u = {
  // _val: stateObj?.val,
  // _key: stateObj?.key,
  get resp() {
    return this._resp;
  },
  set resp(e) {
    this._resp = e, Array.isArray(e) || (this.renderAction = "assign", this._resp = [e]), this._resp && this._target && f({
      target: this._target,
      renderAction: this.renderAction,
      response: this._resp,
      key: this.key
    }), this._resp = "";
  },
  get key() {
    return this._key;
  },
  set key(e) {
    this._key = e;
  },
  get deps() {
    return this._deps;
  },
  set deps(e) {
    this._deps = e;
  },
  get target() {
    return this._target;
  },
  set target(e) {
    this._target = e;
  },
  get action() {
    return this._action;
  },
  set action(e) {
    this._action = e;
  },
  get val() {
    return this._val;
  },
  set val(e) {
    const t = this, s = t.key;
    if (Array.isArray(e) && (!t.oldVal && (t.oldVal = /* @__PURE__ */ new Map()), t.target)) {
      const { diff: l, action: a, curM: i, swap: o } = z({
        v: e,
        curM: new Map([...t.oldVal]),
        key: s
      });
      t.swap = o, t.oldVal = i, t._val = l, t.renderAction = a;
    }
    if (t.renderAction === "clear")
      return f({
        target: t.target,
        renderAction: t.renderAction
      });
    t._val && (["remove", "swap"].includes(t.renderAction) ? f({
      target: t.target,
      renderAction: t.renderAction,
      key: t.key,
      swap: t.swap
    }) : t.target && t.target.dispatchEvent(new Event("change"))), !Array.isArray(e) && (t.oldVal = e), t._val = e;
  }
}, h = {
  get actions() {
    return this._actions;
  },
  set actions(e) {
    this._actions = e;
  }
}, w = (e) => h.actions = e;
function g(e) {
  for (let t of [...e.querySelectorAll("[data-change]")])
    t.onchange = h.actions[t.dataset.change];
}
window.addEventListener("load", () => g(app));
function _(e, t) {
  const s = e.tagName;
  return s === "TBODY" ? new DOMParser().parseFromString(`<table><tbody>${t}</tbody></table>`, "text/html").querySelector("tbody").childNodes : new DOMParser().parseFromString(`<${s}>${t}</${s}>`, "text/html").querySelector(s).childNodes;
}
function f({ target: e, response: t, renderAction: s, key: l, swap: a }) {
  ({
    assign: () => e.innerHTML = t.join(""),
    append: () => e.insertAdjacentHTML("beforeEnd", t.join("")),
    clear: () => (e.innerHTML = "", g(document)),
    remove: () => e.parentElement.removeChild(e),
    swap: () => {
      const [o, n] = a;
      e.insertBefore(e.children[o - 1], e.children[n - 1]), e.insertBefore(e.children[n - 1], e.children[o - 1]);
    },
    update: function() {
      const o = [..._(e, t)], n = o[0].getAttribute("key");
      for (let c of o)
        e.childNodes[c.getAttribute("key") - n].replaceWith(
          c
        );
    }
  })[s]();
}
function z({ v: e, curM: t, key: s }) {
  if (e.length === 0 && t.size > 1)
    return {
      action: "clear",
      curM: /* @__PURE__ */ new Map(),
      diff: void 0,
      swap: void 0
    };
  {
    const l = t.size, a = /* @__PURE__ */ new Map(), i = new Map([...t]), o = [];
    for (let r of e)
      t.has(r) ? i.delete(r) : (t.set(r, r[s]), a.set(r, r[s]));
    if (i.size > 0)
      for (let r of i.keys())
        t.delete(r);
    if (a.size == 0) {
      let r = [...t.entries()].sort(
        ([d, p], [y, b]) => d[s] < y[s] && -1
      );
      for (let [d, p] of [...e.entries()])
        p[s] !== r[d][1] && (o.push(d + 1), t.set(r[d][0], p[s]));
      r = [];
    }
    let n;
    i.size == 1 && a.size == 0 ? n = "remove" : o.length > 0 ? n = "swap" : i.size == 0 && l > 0 ? n = "append" : i.size == 0 && l == 0 ? n = "assign" : i.size == a.size && a.size < t.size ? n = "update" : n = "assign";
    let c;
    return i.size > 0 && a.size == 0 ? c = [...i.keys()] : c = [...a.keys()], {
      action: n,
      diff: c,
      curM: t,
      swap: o.sort()
    };
  }
}
const k = {
  state: A,
  Actions: w
};
export {
  k as default
};
