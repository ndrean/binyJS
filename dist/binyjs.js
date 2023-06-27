const y = (t) => Object.assign(Object.create(A), t), A = {
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
    const e = this, i = e.key ?? "id";
    if (e._val = t, Array.isArray(t) && (!e.oldVal && (e.oldVal = /* @__PURE__ */ new Map()), e.target)) {
      const { diff: l, action: a, curM: s, swap: o } = z({
        v: t,
        curM: new Map([...e.oldVal]),
        key: i
      });
      e.swap = o, e.oldVal = s, e._val = l, e.renderAction = a;
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
}, f = {
  get actions() {
    return this._actions;
  },
  set actions(t) {
    this._actions = t;
  }
}, _ = (t) => f.actions = t;
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
function w(t, e) {
  const i = t.tagName;
  return i === "TBODY" ? new DOMParser().parseFromString(`<table><tbody>${e}</tbody></table>`, "text/html").querySelector("tbody").childNodes : new DOMParser().parseFromString(`<${i}>${e}</${i}>`, "text/html").querySelector(i).childNodes;
}
function h({ target: t, response: e, renderAction: i, key: l, swap: a }) {
  ({
    assign: () => t.innerHTML = e.join(""),
    append: () => t.insertAdjacentHTML("beforeEnd", e.join("")),
    clear: () => (t.innerHTML = "", g(document)),
    remove: () => t.parentElement.removeChild(t),
    swap: () => {
      const [o, n] = a;
      t.insertBefore(t.children[o - 1], t.children[n - 1]), t.insertBefore(t.children[n - 1], t.children[o - 1]);
    },
    update: function() {
      const o = [...w(t, e)], n = o[0].getAttribute("key");
      for (let c of o)
        t.childNodes[c.getAttribute("key") - n].replaceWith(
          c
        );
    }
  })[i]();
}
function z({ v: t, curM: e, key: i }) {
  if (t.length === 0 && e.size > 1)
    return {
      action: "clear",
      curM: /* @__PURE__ */ new Map(),
      diff: void 0,
      swap: void 0
    };
  {
    const l = e.size, a = /* @__PURE__ */ new Map(), s = new Map([...e]), o = [];
    for (let r of t)
      e.has(r) ? s.delete(r) : (e.set(r, r[i]), a.set(r, r[i]));
    if (s.size > 0)
      for (let r of s.keys())
        e.delete(r);
    if (a.size == 0) {
      let r = [...e.entries()].sort(
        ([d, p], [u, b]) => d[i] < u[i] && -1
      );
      for (let [d, p] of [...t.entries()])
        p[i] !== r[d][1] && (o.push(d + 1), e.set(r[d][0], p[i]));
      r = [];
    }
    let n;
    s.size == 1 && a.size == 0 ? n = "remove" : o.length > 0 ? n = "swap" : s.size == 0 && l > 0 ? n = "append" : s.size == 0 && l == 0 ? n = "assign" : s.size == a.size && a.size < e.size ? n = "update" : n = "assign";
    let c;
    return s.size > 0 && a.size == 0 ? c = [...s.keys()] : c = [...a.keys()], {
      action: n,
      diff: c,
      curM: e,
      swap: o.sort()
    };
  }
}
const k = {
  state: y,
  Actions: _
};
export {
  k as default
};
