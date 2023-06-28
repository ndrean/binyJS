// import B from "../src/biny.js";
import B from "binyjs";

const selected = B.state({ val: "" }),
  listed = B.state({ val: "" }),
  actions = B.Actions({
    setSelected: (e) => {
      selected.target = fromselect;
      selected.val = e.target.value;
    },
    showSelected: () =>
      (selected.resp = `<p key="${selected.val}">${selected.val} ${
        countries[selected.val]
      }</p>`),
    setListed: (e) => {
      listed.target = fromlist;
      listed.val = e.target.value;
    },
    showListed: (e) => {
      e.preventDefault();
      form.reset();
      return (listed.resp = `<p key="${listed.val}">${listed.val} ${
        countries[listed.val]
      }</p>`);
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
  `<option value="${country}" >${country} ${countries[country]}</option>`;

const displayOptions = (countries) =>
  Object.keys(countries).map((country) => Option(country));

const Select = () =>
  `<label for="selectElt">Select a country:</label>
  <select id="selectElt" name="countries" data-change="setSelected" value=${
    selected.val
  }>
  <option id="options" selected="disabled" value="">Which one?</option>
  ${displayOptions(countries)}
  </select>
  <div id="fromselect" data-change="showSelected">
  </div>
  `;
// variant with a submit to display the selected value
const Datalist = () =>
  `<form id="form" data-submit="showListed">
  <label for="dt-input">Choose a country:</label>
  <input list="dataList" id="dtInput" data-input="setListed" value="${
    listed.val
  }"><datalist id="dataList">${displayOptions(countries)}</datalist>
  <button id="btn" type="submit">Add</button>
  </form>
  <div id="fromlist"></div>`;

const App = () => `<div>${Select()}</div><hr/><br/><div>${Datalist()}</div>`;

app.innerHTML = App();
