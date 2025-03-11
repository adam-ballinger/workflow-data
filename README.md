Here's a revised README optimized for npm, updated clearly for ES Modules:

---

# workflow-data

> Minimal, dependency-free data utilities for rapid Node.js workflows. CSV, JSON, filtering, pivot tables, and more.

## Installation

```bash
npm install workflow-data
```

## Quick Start

```js
import { readCsv, filter, pivot, writeJson } from "workflow-data";

// Read CSV data
const records = readCsv("data.csv");

// Filter active records
const active = filter(records, { status: "active" });

// Pivot data by department and month, summing hours
const summary = pivot(active, "department", "month", "hours");

// Write to JSON file
writeJson("summary.json", summary);
```

## Features

- 📂 **Read & Write:** CSV, JSON, HTML
- 🔎 **Filter & Update:** Powerful, intuitive filtering and in-place updates
- 📊 **Pivot & Sum:** Quickly summarize and aggregate datasets
- 🌳 **Tree Shaking:** ES Modules for optimized builds and minimal bundle size

[Full API Documentation →](https://github.com/adam-ballinger/workflow-data/wiki)

## Author

Adam Ballinger

## License

ISC
