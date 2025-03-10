# workflow-data

Small, simple data tools for rapid development of small projects in node.js.

## Installation

```bash
npm install workflow-data
```

## Features

- **Read & Write**: Read and write CSV, JSON, and HTML
- **Filter & Update**: Filter data based on exact or array-based criteria and update in place
- **Erase**: Remove objects matching specified conditions
- **Pivot**: Easily pivot datasets by row, column, and value keys
- **Sum**: Sum numeric properties across arrays of objects

## Quick Example

```js
const dt = require("datatools");

// 1) Read CSV
const data = dt.readCsv("./input.csv");

// 2) Filter results
const filtered = dt.filter(data, { status: "active" });

// 3) Pivot data
const pivoted = dt.pivot(filtered, "department", "month", "hours");

// 4) Write to JSON
dt.writeJson("./output.json", pivoted);

## API Overview

- **`readCsv(filePath)`:** Returns an array of objects from a CSV file.
- **`readJson(filePath)`:** Parses and returns JSON data from a file.
- **`filter(data, filterObject)`:** Filters an array of objects by exact or array-based criteria.
- **`update(data, filterObject, updates)`:** Updates objects in place based on filter criteria.
- **`erase(data, filterObject)`:** Removes objects matching given filter criteria.
- **`pivot(data, rowKey, colKey, valueKey)`:** Pivots an array of objects for summarized data.
- **`writeCsv(filePath, data)`:** Writes an array of objects to CSV.
- **`writeJson(filePath, json)`:** Writes a JSON object to file.
- **`writeHtml(filePath, html)`:** Writes raw HTML to file.
- **`sumProperty(data, key)`:** Sums numeric values in an array of objects by key.

## License

ISC License
```
