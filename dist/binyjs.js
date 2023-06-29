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
    const e = this, n = e.key ?? "id";
    if (e._val = t, Array.isArray(t) && (!e.oldVal && (e.oldVal = /* @__PURE__ */ new Map()), e.target)) {
      const { diff: l, action: i, curM: c, swap: s } = k({
        v: t,
        curM: new Map([...e.oldVal]),
        key: n
      });
      e.swap = s, e.oldVal = c, e._val = l, e.renderAction = i;
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
}, p = {
  get actions() {
    return this._actions;
  },
  set actions(t) {
    this._actions = t;
  }
}, w = (t) => p.actions = t;
function f(t) {
  for (let e of [...t.querySelectorAll("[data-change]")])
    e.onchange = p.actions[e.dataset.change];
  for (let e of [...t.querySelectorAll("[data-input]")])
    e.oninput = p.actions[e.dataset.input];
  for (let e of [...t.querySelectorAll("[data-submit]")])
    e.onsubmit = p.actions[e.dataset.submit];
  for (let e of [...t.querySelectorAll("[data-click]")])
    e.onclick = p.actions[e.dataset.click];
}
window.addEventListener("load", () => f(app));
function h(t, e) {
  const n = t.tagName;
  let l;
  return n === "TBODY" ? l = new DOMParser().parseFromString(`<table><tbody>${e}</tbody></table>`, "text/html").querySelector("tbody") : l = new DOMParser().parseFromString(`<${n}>${e}</${n}>`, "text/html").querySelector(n), f(l), l.childNodes;
}
function u({ target: t, response: e, renderAction: n, key: l, swap: i }) {
  ({
    assign: () => (t.innerHTML = e.join(""), f(t)),
    append: () => {
      const s = h(t, e.join(""));
      t.append(...s);
    },
    clear: () => (t.innerHTML = "", f(document)),
    remove: () => {
      const s = h(t, e.join(""));
      for (let r of [...s]) {
        const o = Number(r.getAttribute("key"));
        t.querySelector(`[key="${o}"]`).remove();
      }
    },
    swap: () => {
      const [s, r] = i;
      t.insertBefore(t.children[s - 1], t.children[r - 1]), t.insertBefore(t.children[r - 1], t.children[s - 1]);
    },
    update: function() {
      const s = [...h(t, e.join(""))], r = s[0].getAttribute("key");
      for (let o of s)
        t.childNodes[o.getAttribute("key") - r].replaceWith(
          o
        );
    }
  })[n]();
}
function k({ v: t, curM: e, key: n }) {
  if (t.length === 0 && e.size > 1)
    return {
      action: "clear",
      curM: /* @__PURE__ */ new Map(),
      diff: [],
      swap: []
    };
  {
    const l = e.size, i = /* @__PURE__ */ new Map(), c = new Map([...e]), s = [];
    for (let a of t)
      e.has(a) ? c.delete(a) : (e.set(a, a[n]), i.set(a, a[n]));
    if (c.size > 0)
      for (let a of c.keys())
        e.delete(a);
    if (i.size == 0) {
      let a = [...e.entries()].sort(
        ([d, g], [y, b]) => d[n] < y[n] && -1
      );
      for (let [d, g] of [...t.entries()])
        g[n] !== a[d][1] && (s.push(d + 1), e.set(a[d][0], g[n]));
      a = [];
    }
    let r, o;
    return c.size > 0 && i.size == 0 ? (r = "remove", o = [...c.keys()]) : s.length > 0 ? (r = "swap", o = [...i.keys()]) : c.size == 0 && i.size > 0 && l > 0 ? (r = "append", o = [...i.keys()]) : c.size == i.size && i.size < e.size ? (r = "update", o = [...i.keys()]) : (r = "assign", o = t), {
      action: r,
      diff: o,
      curM: e,
      swap: s.sort()
    };
  }
}
const z = {
  state: A,
  Actions: w
};
export {
  z as default
};
