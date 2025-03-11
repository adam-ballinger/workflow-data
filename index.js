/**
 * @file Minimal, dependency-free data tools for rapid development of small projects in node.js.
 *
 * @module workflow-data
 */
import fs from "fs";

/**
 * Reads a CSV file and returns an array of objects representing its rows.
 *
 * The first line of the CSV is assumed to be the header row. Numeric values are
 * automatically converted to numbers.
 *
 * @param {string} filePath - The path to the CSV file.
 * @returns {Array<Object>} An array of objects where keys are column headers.
 *
 * @example
 * const rows = readCsv('data.csv');
 * console.log(rows[0]); // { "Name": "Alice", "Age": 30 }
 *
 * @throws {Error} When reading the file fails or rows are malformed.
 */
function readCsv(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    const lines = data.trim().split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    return lines.slice(1).map((line, idx) => {
      const values = line.split(",").map((v) => v.trim());
      if (values.length !== headers.length) {
        throw new Error(
          `Row ${idx + 2} has ${values.length} columns; expected ${
            headers.length
          }.`
        );
      }
      return headers.reduce((obj, header, index) => {
        obj[header] = isNaN(values[index])
          ? values[index]
          : Number(values[index]);
        return obj;
      }, {});
    });
  } catch (error) {
    console.error(`Error reading CSV file at ${filePath}: ${error.message}`);
    throw error;
  }
}

/**
 * Reads a JSON file and returns its parsed content.
 *
 * @param {string} filePath - The path to the JSON file.
 * @returns {any} The parsed JSON content.
 *
 * @example
 * const config = readJson('config.json');
 * console.log(config.port);
 *
 * @throws {Error} When reading or parsing the file fails.
 */
function readJson(filePath) {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file at ${filePath}: ${error.message}`);
    throw error;
  }
}

/**
 * Filters an array of objects based on the provided criteria.
 *
 * @param {Array<Object>} data - The array of objects to filter.
 * @param {Object} filterCriteria - An object where keys are property names and values are the required value(s).
 * @returns {Array<Object>} The filtered array of objects.
 */
function filter(data, filterCriteria) {
  if (!Array.isArray(data)) {
    throw new TypeError("filter: data must be an array.");
  }
  if (typeof filterCriteria !== "object" || filterCriteria === null) {
    throw new TypeError("filter: filter parameter must be a non-null object.");
  }
  return data.filter((obj) => {
    return Object.keys(filterCriteria).every((key) => {
      const filterValue = filterCriteria[key];
      if (Array.isArray(filterValue)) {
        return filterValue.includes(obj[key]);
      }
      return obj[key] === filterValue;
    });
  });
}

/**
 * Updates objects in an array that match the provided filter criteria.
 *
 * @param {Array<Object>} data - The array of objects to update.
 * @param {Object} filterCriteria - An object with keys as property names and values as the required value(s).
 * @param {Object} updates - An object containing the properties and values to update.
 */
function update(data, filterCriteria, updates) {
  if (!Array.isArray(data)) {
    throw new TypeError("update: data must be an array.");
  }
  if (typeof filterCriteria !== "object" || filterCriteria === null) {
    throw new TypeError("update: filter parameter must be a non-null object.");
  }
  if (typeof updates !== "object" || updates === null) {
    throw new TypeError("update: updates parameter must be a non-null object.");
  }
  data.forEach((obj) => {
    const match = Object.keys(filterCriteria).every((key) => {
      const filterValue = filterCriteria[key];
      if (Array.isArray(filterValue)) {
        return filterValue.includes(obj[key]);
      }
      return obj[key] === filterValue;
    });
    if (match) {
      Object.entries(updates).forEach(([key, value]) => {
        obj[key] = value;
      });
    }
  });
}

/**
 * Removes objects from an array that match the provided filter criteria.
 *
 * @param {Array<Object>} data - The array of objects to modify.
 * @param {Object} filterCriteria - An object with keys as property names and values as the required value(s).
 */
function erase(data, filterCriteria) {
  if (!Array.isArray(data)) {
    throw new TypeError("erase: data must be an array.");
  }
  if (typeof filterCriteria !== "object" || filterCriteria === null) {
    throw new TypeError("erase: filter parameter must be a non-null object.");
  }
  for (let i = data.length - 1; i >= 0; i--) {
    const match = Object.keys(filterCriteria).every((key) => {
      const filterValue = filterCriteria[key];
      if (Array.isArray(filterValue)) {
        return filterValue.includes(data[i][key]);
      }
      return data[i][key] === filterValue;
    });
    if (match) {
      data.splice(i, 1);
    }
  }
}

/**
 * Pivots an array of objects into a summarized table-like structure.
 *
 * Each unique value of `rowKey` becomes a row, with columns corresponding to unique `colKey` values.
 * Values of `valueKey` are summed for items sharing the same row and column.
 *
 * @param {Array<Object>} data - The array of objects to pivot.
 * @param {string} rowKey - The key used to group rows.
 * @param {string} colKey - The key used to define columns.
 * @param {string} valueKey - The key whose numeric values will be aggregated.
 * @returns {Array<Object>} The pivoted dataset.
 */
function pivot(data, rowKey, colKey, valueKey) {
  if (!Array.isArray(data)) {
    throw new TypeError("pivot: data must be an array.");
  }
  if (
    typeof rowKey !== "string" ||
    typeof colKey !== "string" ||
    typeof valueKey !== "string"
  ) {
    throw new TypeError("pivot: rowKey, colKey, and valueKey must be strings.");
  }
  const result = [];
  const map = new Map();

  data.forEach((item, idx) => {
    if (typeof item !== "object" || item === null) {
      throw new TypeError(`pivot: item at index ${idx} is not a valid object.`);
    }
    const rowVal = item[rowKey];
    const colVal = item[colKey];
    const value = item[valueKey];
    if (typeof value !== "number") {
      throw new TypeError(
        `pivot: value for key "${valueKey}" in item at index ${idx} should be a number.`
      );
    }

    if (!map.has(rowVal)) {
      map.set(rowVal, { [rowKey]: rowVal });
    }
    const row = map.get(rowVal);
    row[colVal] = (row[colVal] || 0) + value;
  });

  result.push(...map.values());
  return result;
}

/**
 * Extracts values for a given property from an array of objects.
 *
 * @param {Array<Object>} data - The array of objects.
 * @param {string} key - The property key to extract.
 * @returns {Array<any>} An array of values from the specified key.
 *
 * @example
 * const data = [{ name: 'Alice' }, { name: 'Bob' }];
 * const names = pluck(data, 'name'); // ['Alice', 'Bob']
 */
function pluck(data, key) {
  return data.map((item) => item[key]);
}

/**
 * Extracts unique values for a given property from an array of objects.
 *
 * @param {Array<Object>} data - The array of objects.
 * @param {string} key - The property key to extract unique values from.
 * @returns {Array<any>} An array of unique values.
 *
 * @example
 * const data = [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Alice' }];
 * const uniqueNames = pluckUnique(data, 'name'); // ['Alice', 'Bob']
 */
function pluckUnique(data, key) {
  return [...new Set(data.map((item) => item[key]))];
}

/**
 * Writes an array of objects to a CSV file.
 *
 * The CSV file will include a header row based on object keys. Each value is JSON stringified
 * to handle special characters and ensure proper CSV formatting.
 *
 * @param {string} filePath - The path to the output CSV file.
 * @param {Array<Object>} data - An array of objects representing rows.
 *
 * @example
 * const data = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
 * writeCsv('output.csv', data);
 *
 * @throws {Error} If data is not a non-empty array of objects.
 */
function writeCsv(filePath, data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Invalid data: Expected a non-empty array of objects.");
  }
  try {
    const headers = Object.keys(data[0]);
    const csvRows = data.map((row) =>
      headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");

    fs.writeFileSync(filePath, csvContent, "utf8");
  } catch (error) {
    console.error(`Error writing CSV file at ${filePath}: ${error.message}`);
    throw error;
  }
}

/**
 * Writes a JSON object to a file.
 *
 * The JSON output is pretty-printed with a 2-space indentation.
 *
 * @param {string} filePath - The path to the output JSON file.
 * @param {any} json - The JSON data to write.
 *
 * @example
 * const config = { port: 3000, debug: true };
 * writeJson('config.json', config);
 *
 * @throws {Error} When writing the file fails.
 */
function writeJson(filePath, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonData, "utf8");
  } catch (error) {
    console.error(`Error writing JSON file at ${filePath}: ${error.message}`);
    throw error;
  }
}

/**
 * Writes an HTML string to a file.
 *
 * @param {string} filePath - The path to the output HTML file.
 * @param {string} html - The HTML content to write.
 *
 * @example
 * const htmlContent = '<html><body><h1>Hello World</h1></body></html>';
 * writeHtml('index.html', htmlContent);
 *
 * @throws {Error} When writing the file fails.
 */
function writeHtml(filePath, html) {
  try {
    fs.writeFileSync(filePath, html, "utf8");
  } catch (error) {
    console.error(`Error writing HTML file at ${filePath}: ${error.message}`);
    throw error;
  }
}

/**
 * Sums the numeric values of a specified property across an array of objects.
 *
 * Non-existent or non-numeric properties are treated as zero.
 *
 * @param {Array<Object>} data - The array of objects.
 * @param {string} key - The key whose numeric values will be summed.
 * @returns {number} The total sum of the property values.
 *
 * @example
 * const data = [{ value: 10 }, { value: 20 }];
 * const total = sumProperty(data, 'value'); // 30
 */
function sumProperty(data, key) {
  return data.reduce((sum, item) => {
    const num = Number(item[key]);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
}

/**
 * Sorts an array of objects by the specified key(s) and order.
 *
 * @param {Array<Object>} data - The array of objects to sort.
 * @param {string|string[]} keys - A key or an array of keys to sort by.
 * @param {string} [order="asc"] - The sort order: "asc" for ascending or "desc" for descending.
 * @returns {Array<Object>} A new array of objects sorted by the given key(s).
 *
 * @example
 * const sorted = sort(data, 'name', 'asc');
 *
 * @throws {TypeError} If data is not an array, or if keys is not a string or an array of strings,
 *                     or if order is not "asc" or "desc".
 */
function sort(data, keys, order = "asc") {
  if (!Array.isArray(data)) {
    throw new TypeError("sort: data must be an array.");
  }
  if (typeof keys === "string") {
    keys = [keys];
  } else if (!Array.isArray(keys)) {
    throw new TypeError("sort: keys must be a string or an array of strings.");
  }
  keys.forEach((key) => {
    if (typeof key !== "string") {
      throw new TypeError("sort: each key must be a string.");
    }
  });
  if (order !== "asc" && order !== "desc") {
    throw new TypeError("sort: order must be 'asc' or 'desc'.");
  }

  const compare = (a, b) => {
    for (const key of keys) {
      if (a[key] < b[key]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return order === "asc" ? 1 : -1;
      }
    }
    return 0;
  };

  // Return a new sorted array to avoid mutating the original.
  return data.slice().sort(compare);
}

export {
  readCsv,
  readJson,
  filter,
  update,
  erase,
  pivot,
  pluck,
  pluckUnique,
  writeCsv,
  writeHtml,
  writeJson,
  sumProperty,
  sort,
};
