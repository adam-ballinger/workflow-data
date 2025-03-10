/**
 * @file Minimal, dependency-free data tools for rapid development of small projects in node.js.
 *
 * @module workflow-data
 */
const fs = require("fs");

/**
 * Reads a CSV file and returns an array of objects representing its rows.
 * Converts numeric values where possible.
 * @param {string} filePath - The path to the CSV file.
 * @returns {Array<Object>} - An array of objects, where keys are column headers and values are row values.
 */
function readCsv(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  const lines = data.trim().split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return headers.reduce((obj, header, index) => {
      obj[header] = isNaN(values[index])
        ? values[index]
        : Number(values[index]);
      return obj;
    }, {});
  });
}

/**
 * Reads a JSON file and returns its parsed content.
 * @param {string} filePath - The path to the JSON file.
 * @returns {any} - The parsed JSON object.
 */
function readJson(filePath) {
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

/**
 * Filters an array of objects based on a filter object.
 * Supports exact matches and array-based filtering.
 * @param {Array<Object>} data - The array of objects to filter.
 * @param {Object} filter - The filter criteria, where keys are object properties and values are required values or arrays of values.
 * @returns {Array<Object>} - The filtered array of objects.
 */
function filter(data, filter) {
  return data.filter((obj) => {
    return Object.keys(filter).every((key) => {
      const filterValue = filter[key];
      if (Array.isArray(filterValue)) {
        return filterValue.includes(obj[key]);
      }
      return obj[key] === filterValue;
    });
  });
}

/**
 * Updates filtered objects in an array of objects.
 * Supports exact matches and array-based filtering.
 * @param {Array<Object>} data - The array of objects to filter.
 * @param {Object} filter - The filter criteria, where keys are object properties and values are required values or arrays of values.
 * @param {Object} updates - The updates to be applied to the filtered objects
 */
function update(data, filter, updates) {
  data.forEach((obj) => {
    const match = Object.keys(filter).every((key) => {
      const filterValue = filter[key];
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
 * Finds data objects that match filter criteria and erases the objects
 * @param {Array<object>} data
 * @param {Object} filter
 */
function erase(data, filter) {
  for (let i = data.length - 1; i >= 0; i--) {
    const match = Object.keys(filter).every((key) => {
      const filterValue = filter[key];
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
 * Pivots an array of objects into a summarized format based on row, column, and value keys.
 * @param {Array<Object>} data - The array of objects to pivot.
 * @param {string} rowKey - The key to use as row identifiers.
 * @param {string} colKey - The key to use as column identifiers.
 * @param {string} valueKey - The key whose values will be aggregated in the pivoted structure.
 * @returns {Array<Object>} - The pivoted dataset.
 */
function pivot(data, rowKey, colKey, valueKey) {
  const result = [];
  const map = new Map();

  data.forEach((item) => {
    const rowVal = item[rowKey];
    const colVal = item[colKey];
    const value = item[valueKey];

    // Ensure the row exists in the map
    if (!map.has(rowVal)) {
      map.set(rowVal, { [rowKey]: rowVal });
    }

    // Get the existing row and update its column sum
    const row = map.get(rowVal);
    row[colVal] = (row[colVal] || 0) + value;
  });

  // Convert map values to array
  result.push(...map.values());

  return result;
}

/**
 * Writes an array of objects to a CSV file.
 * @param {string} filePath - The path to the output CSV file.
 * @param {Array<Object>} data - An array of objects representing rows of the CSV.
 * @throws {Error} - Throws an error if the data is not a non-empty array of objects.
 */
function writeCsv(filePath, data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Invalid data: Expected a non-empty array of objects.");
  }

  const headers = Object.keys(data[0]);
  const csvRows = data.map((row) =>
    headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")
  );

  const csvContent = [headers.join(","), ...csvRows].join("\n");

  fs.writeFileSync(filePath, csvContent, "utf8");
}

/**
 * Writes a JSON object to a file.
 * @param {string} filePath - The path to the output JSON file.
 * @param {any} json - The JSON data to write.
 */
function writeJson(filePath, json) {
  const data = JSON.stringify(json, null, 2);
  fs.writeFileSync(filePath, data, "utf8");
}

/**
 * Writes an HTML string to a file.
 * @param {string} filePath - The path to the output HTML file.
 * @param {string} html - The HTML content to write.
 */
function writeHtml(filePath, html) {
  fs.writeFileSync(filePath, html, "utf8");
}

/**
 * Sums the values of a given property in an array of objects.
 * @param {Array<Object>} data - The array of objects.
 * @param {string} key - The property key to sum.
 * @returns {number} - The sum of the values of the given key.
 */
function sumProperty(data, key) {
  return data.reduce((sum, item) => sum + (item[key] || 0), 0);
}

module.exports = {
  readCsv,
  readJson,
  filter,
  update,
  erase,
  pivot,
  writeCsv,
  writeHtml,
  writeJson,
  sumProperty,
};
