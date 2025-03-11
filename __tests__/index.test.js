// index.test.js
const fs = require("fs");
const path = require("path");
const os = require("os");
const dataTools = require("../index");

const getTempPath = (ext) =>
  path.join(os.tmpdir(), `test-${Date.now()}.${ext}`);

describe("readCsv", () => {
  let tempFile;
  beforeEach(() => {
    tempFile = getTempPath("csv");
  });
  afterEach(() => {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  });

  test("reads CSV file correctly", () => {
    const csv = "Name,Age\nAlice,30\nBob,25";
    fs.writeFileSync(tempFile, csv, "utf8");
    const result = dataTools.readCsv(tempFile);
    expect(result).toEqual([
      { Name: "Alice", Age: 30 },
      { Name: "Bob", Age: 25 },
    ]);
  });

  test("throws error for malformed CSV", () => {
    const csv = "Name,Age\nAlice\nBob,25";
    fs.writeFileSync(tempFile, csv, "utf8");
    expect(() => dataTools.readCsv(tempFile)).toThrow();
  });

  test("throws error for non-existent file", () => {
    expect(() => dataTools.readCsv("nonexistent.csv")).toThrow();
  });
});

describe("readJson", () => {
  let tempFile;
  beforeEach(() => {
    tempFile = getTempPath("json");
  });
  afterEach(() => {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  });

  test("reads JSON file correctly", () => {
    const jsonObj = { port: 3000, debug: true };
    fs.writeFileSync(tempFile, JSON.stringify(jsonObj), "utf8");
    const result = dataTools.readJson(tempFile);
    expect(result).toEqual(jsonObj);
  });

  test("throws error for invalid JSON", () => {
    fs.writeFileSync(tempFile, "{ invalid json", "utf8");
    expect(() => dataTools.readJson(tempFile)).toThrow();
  });

  test("throws error for non-existent file", () => {
    expect(() => dataTools.readJson("nonexistent.json")).toThrow();
  });
});

describe("filter", () => {
  const data = [
    { id: 1, type: "A" },
    { id: 2, type: "B" },
    { id: 3, type: "A" },
  ];
  test("filters based on single value", () => {
    const result = dataTools.filter(data, { type: "A" });
    expect(result).toEqual([
      { id: 1, type: "A" },
      { id: 3, type: "A" },
    ]);
  });
  test("filters with array of values", () => {
    const result = dataTools.filter(data, { type: ["A", "B"] });
    expect(result).toEqual(data);
  });
  test("throws TypeError for invalid data", () => {
    expect(() => dataTools.filter({}, { type: "A" })).toThrow(TypeError);
  });
  test("throws TypeError for invalid filter criteria", () => {
    expect(() => dataTools.filter(data, null)).toThrow(TypeError);
  });
});

describe("update", () => {
  test("updates matching objects", () => {
    const data = [
      { id: 1, status: "pending" },
      { id: 2, status: "pending" },
    ];
    dataTools.update(data, { id: 1 }, { status: "complete" });
    expect(data).toEqual([
      { id: 1, status: "complete" },
      { id: 2, status: "pending" },
    ]);
  });
  test("throws TypeError for invalid data", () => {
    expect(() =>
      dataTools.update({}, { id: 1 }, { status: "complete" })
    ).toThrow(TypeError);
  });
});

describe("erase", () => {
  test("removes matching objects", () => {
    const data = [
      { id: 1, status: "pending" },
      { id: 2, status: "complete" },
      { id: 3, status: "pending" },
    ];
    dataTools.erase(data, { status: "pending" });
    expect(data).toEqual([{ id: 2, status: "complete" }]);
  });
  test("throws TypeError for invalid data", () => {
    expect(() => dataTools.erase({}, { status: "pending" })).toThrow(TypeError);
  });
});

describe("pivot", () => {
  test("pivots data correctly", () => {
    const data = [
      { category: "Fruit", item: "Apple", quantity: 10 },
      { category: "Fruit", item: "Banana", quantity: 5 },
      { category: "Vegetable", item: "Carrot", quantity: 7 },
      { category: "Fruit", item: "Apple", quantity: 3 },
    ];
    const result = dataTools.pivot(data, "category", "item", "quantity");
    expect(result).toContainEqual({ category: "Fruit", Apple: 13, Banana: 5 });
    expect(result).toContainEqual({ category: "Vegetable", Carrot: 7 });
  });
  test("throws error for non-numeric value", () => {
    const data = [{ category: "Fruit", item: "Apple", quantity: "ten" }];
    expect(() => dataTools.pivot(data, "category", "item", "quantity")).toThrow(
      TypeError
    );
  });
});

describe("pluck", () => {
  test("extracts values for given key", () => {
    const data = [{ name: "Alice" }, { name: "Bob" }];
    const result = dataTools.pluck(data, "name");
    expect(result).toEqual(["Alice", "Bob"]);
  });
});

describe("pluckUnique", () => {
  test("extracts unique values", () => {
    const data = [{ name: "Alice" }, { name: "Bob" }, { name: "Alice" }];
    const result = dataTools.pluckUnique(data, "name");
    expect(result.sort()).toEqual(["Alice", "Bob"].sort());
  });
});

describe("writeCsv", () => {
  let tempFile;
  beforeEach(() => {
    tempFile = getTempPath("csv");
  });
  afterEach(() => {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  });

  test("writes CSV file correctly", () => {
    const data = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ];
    dataTools.writeCsv(tempFile, data);
    const content = fs.readFileSync(tempFile, "utf8");
    const lines = content.split("\n");
    expect(lines[0]).toBe("id,name");
    expect(content).toContain('"Alice"');
    expect(content).toContain('"Bob"');
  });

  test("throws error for empty array", () => {
    expect(() => dataTools.writeCsv(tempFile, [])).toThrow();
  });
});

describe("writeJson", () => {
  let tempFile;
  beforeEach(() => {
    tempFile = getTempPath("json");
  });
  afterEach(() => {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  });

  test("writes JSON file correctly", () => {
    const jsonObj = { test: true };
    dataTools.writeJson(tempFile, jsonObj);
    const content = fs.readFileSync(tempFile, "utf8");
    expect(JSON.parse(content)).toEqual(jsonObj);
  });
});

describe("writeHtml", () => {
  let tempFile;
  beforeEach(() => {
    tempFile = getTempPath("html");
  });
  afterEach(() => {
    if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  });

  test("writes HTML file correctly", () => {
    const html = "<html><body><h1>Test</h1></body></html>";
    dataTools.writeHtml(tempFile, html);
    const content = fs.readFileSync(tempFile, "utf8");
    expect(content).toBe(html);
  });
});

describe("sumProperty", () => {
  test("sums numeric property values", () => {
    const data = [{ value: 10 }, { value: 20 }, { value: "non-numeric" }];
    const result = dataTools.sumProperty(data, "value");
    expect(result).toBe(30);
  });

  test("returns 0 if property does not exist", () => {
    const data = [{}, {}];
    const result = dataTools.sumProperty(data, "value");
    expect(result).toBe(0);
  });
});

describe("sort", () => {
  const data = [
    { id: 3, name: "Charlie", age: 25 },
    { id: 1, name: "Alice", age: 30 },
    { id: 2, name: "Bob", age: 20 },
  ];

  test("sorts array by single key ascending", () => {
    const sorted = dataTools.sort(data, "id", "asc");
    expect(sorted).toEqual([
      { id: 1, name: "Alice", age: 30 },
      { id: 2, name: "Bob", age: 20 },
      { id: 3, name: "Charlie", age: 25 },
    ]);
  });

  test("sorts array by single key descending", () => {
    const sorted = dataTools.sort(data, "id", "desc");
    expect(sorted).toEqual([
      { id: 3, name: "Charlie", age: 25 },
      { id: 2, name: "Bob", age: 20 },
      { id: 1, name: "Alice", age: 30 },
    ]);
  });

  test("sorts array by multiple keys ascending", () => {
    const multiData = [
      { name: "Alice", age: 30 },
      { name: "Bob", age: 20 },
      { name: "Alice", age: 25 },
    ];
    const sorted = dataTools.sort(multiData, ["name", "age"], "asc");
    expect(sorted).toEqual([
      { name: "Alice", age: 25 },
      { name: "Alice", age: 30 },
      { name: "Bob", age: 20 },
    ]);
  });

  test("does not mutate the original array", () => {
    const original = [...data];
    dataTools.sort(data, "id");
    expect(data).toEqual(original);
  });

  test("throws TypeError if data is not an array", () => {
    expect(() => dataTools.sort({}, "id")).toThrow(TypeError);
  });

  test("throws TypeError if keys is not a string or array of strings", () => {
    expect(() => dataTools.sort(data, 123)).toThrow(TypeError);
    expect(() => dataTools.sort(data, ["id", 456])).toThrow(TypeError);
  });

  test("throws TypeError if order is not 'asc' or 'desc'", () => {
    expect(() => dataTools.sort(data, "id", "invalid")).toThrow(TypeError);
  });
});
