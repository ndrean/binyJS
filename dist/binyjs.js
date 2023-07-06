const A = (t) => Object.assign(Object.create(_), t), _ = {
  get resp() {
    return this._resp;
  },
  set resp(t) {
    this._resp = t, Array.isArray(t) || (this.renderAction = "assign", this._resp = [t]), this.renderAction || (this.renderAction = "assign"), this._resp && this._target && y({
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
  get target() {
    return this._target;
  },
  set target(t) {
    this._target = t;
  },
  get val() {
    return this._val;
  },
  set val(t) {
    const e = this, n = e.key ?? "id";
    if (e._val = t, Array.isArray(t) && (!e.oldVal && (e.oldVal = /* @__PURE__ */ new Map()), e.target)) {
      const { diff: c, action: i, curMap: l, swap: s } = w({
        newVector: t,
        curMap: new Map([...e.oldVal]),
        key: n
      });
      e.swap = s, e.oldVal = l, e._val = c, e.renderAction = i;
    }
    if (e.renderAction === "clear")
      return y({
        target: e.target,
        renderAction: e.renderAction
      });
    (e._val !== null || e._val !== void 0) && (e.renderAction === "swap" ? y({
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
function g(t) {
  for (let e of [...t.querySelectorAll("[data-change]")])
    e.onchange = f.actions[e.dataset.change];
  for (let e of [...t.querySelectorAll("[data-input]")])
    e.oninput = f.actions[e.dataset.input];
  for (let e of [...t.querySelectorAll("[data-submit]")])
    e.onsubmit = f.actions[e.dataset.submit];
  for (let e of [...t.querySelectorAll("[data-click]")])
    e.onclick = f.actions[e.dataset.click];
}
window.addEventListener("load", () => g(app));
function h(t, e) {
  const n = t.tagName;
  let c;
  return n === "TBODY" ? c = new DOMParser().parseFromString(`<table><tbody>${e}</tbody></table>`, "text/html").querySelector("tbody") : c = new DOMParser().parseFromString(`<${n}>${e}</${n}>`, "text/html").querySelector(n), g(c), c.childNodes;
}
function y({ target: t, response: e, renderAction: n, key: c, swap: i }) {
  ({
    assign: () => (t.innerHTML = e.join(""), g(t)),
    append: () => {
      const s = h(t, e.join(""));
      t.append(...s);
    },
    clear: () => (t.innerHTML = "", g(document)),
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
function w({ newVector: t, curMap: e, key: n }) {
  if (t.length === 0 && e.size > 1)
    return {
      action: "clear",
      curMap: /* @__PURE__ */ new Map(),
      diff: [],
      swap: []
    };
  {
    const c = e.size, i = /* @__PURE__ */ new Map(), l = new Map([...e]), s = [];
    for (let a of t)
      e.has(a) ? l.delete(a) : (e.set(a, a[n]), i.set(a, a[n]));
    if (l.size > 0)
      for (let a of l.keys())
        e.delete(a);
    if (i.size == 0) {
      let a = [...e.entries()].sort(
        ([d, p], [u, b]) => d[n] < u[n] && -1
      );
      for (let [d, p] of [...t.entries()])
        p[n] !== a[d][1] && (s.push(d + 1), e.set(a[d][0], p[n]));
      a = [];
    }
    let r, o;
    return l.size > 0 && i.size == 0 ? (r = "remove", o = [...l.keys()]) : s.length > 0 ? (r = "swap", o = [...i.keys()]) : l.size == 0 && i.size > 0 && c > 0 ? (r = "append", o = [...i.keys()]) : l.size == i.size && i.size < e.size ? (r = "update", o = [...i.keys()]) : (r = "assign", o = t), {
      action: r,
      diff: o,
      curMap: e,
      swap: s.sort()
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
