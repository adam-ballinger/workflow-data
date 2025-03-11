import { filter, update, erase } from "./index.js";

const data = [
  {
    _id: "a437",
    customer: "b297",
    item: "83b4",
    total: 100,
  },
  {
    _id: "564f",
    customer: "81de",
    item: "f56a",
    total: 200,
  },
  {
    _id: "46ab",
    customer: "81de",
    item: "83b4",
    total: 300,
  },
  {
    _id: "d43a",
    customer: "81de",
    item: "83b4",
    total: 10000,
  },
];

update(data, {}, { org: "Oklahoma City" });

erase(data, { total: 10000 });

const filtered_data = filter(data, { item: "83b4" });

console.log(filtered_data);

console.log();
