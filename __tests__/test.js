const wdata = require("../index");

// 1) Read CSV
const data = wdata.readCsv("./__tests__/data.csv");

// 2) Filter results
const filtered = wdata.filter(data, { role: "Sister" });

// 3) Pivot data
const pivoted = wdata.pivot(filtered, "name", "role", "weight");

// 4) Write to JSON
wdata.writeJson("./__tests__/data.json", pivoted);
