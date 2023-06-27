import B from "binyjs";

const selected = B.state({ val: "" }),
  listed = B.state({ val: "" }),
  actions = B.Actions({
    setSelected: (e) => {
      selected.val = e.target.value.toString();
    },
    showSelected: () =>
      (selected.resp = `<p key="${selected.val}">${selected.val} ${
        countries[selected.val]
      }</p>`),
    setListed: (e) => (listed.val = e.target.value),
    showListed: () => {
      form.reset();
      listed.resp = `<p key="${listed.val}">${listed.val} ${
        countries[listed.val]
      }</p>`;
    },
  });

const countries = {
  Estonia: "🇪🇪",
  "European Union": "🇪🇺",
  France: "🇫🇷",
  Finlande: "🇫🇮",
  Georgia: "🇬🇪",
  Germany: "🇩🇪",
  "United Kingdom": "🇬🇧",
  "United States": "🇺🇸",
};

const Option = (country) =>
  `<option value="${country}">${country} ${countries[country]}</option>`;

const displayOptions = (countries) =>
  Object.keys(countries).map((country) => Option(country));

const Select = () =>
  `<label for="selectElt">Select a country:</label><select id="selectElt" name="countries" data-action="setSelected" value=${
    selected.val
  }><option id="options" selected="disabled" value="">Which one?</option>${displayOptions(
    countries
  )}</select><div id="fromselect" data-change="showSelected"></div>
  `;

const Datalist = () =>
  `<form id="form" data-action="showListed"><label for="dt-input">Choose a country:</label><input data-action="setListed" list="dataList" id="dtInput" value=${
    listed.val
  }><datalist id="dataList">${displayOptions(
    countries
  )}</datalist><button id="btn" type="submit">Add</button></form><div id="fromlist"></div>`;

const App = () => `<div>${Select()}</div><hr/><br/><div>${Datalist()}</div>`;

window.addEventListener("load", () => {
  document.addEventListener("input", (e) => {
    if (e.target === selectElt) {
      selected.target = fromselect;
      actions.setSelected(e);
    } else if (e.target === dtInput) {
      listed.target = fromlist;
      return actions.setListed(e);
    }
    selected.val = "";
  });
  document.addEventListener("submit", (e) => {
    e.preventDefault();
    return actions[e.target.dataset.action]();
  });
});

app.innerHTML = App();
