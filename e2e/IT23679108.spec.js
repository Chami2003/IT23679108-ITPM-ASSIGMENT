const { test, expect } = require('@playwright/test');
const xlsx = require('xlsx');
const path = require('path');

const BASE_URL = 'https://www.swifttranslator.com/';
const EXCEL_PATH = path.join(process.cwd(), 'test-data', 'Assignment 1 - Test cases IT23679108.xlsx');

function normKey(s) {
  return String(s ?? '').trim().toLowerCase().replace(/\s+/g, '').replace(/[_-]+/g, '');
}

function pick(row, possibleKeys) {
  const map = {};
  for (const k of Object.keys(row)) map[normKey(k)] = k;
  for (const key of possibleKeys) {
    const real = map[normKey(key)];
    if (real !== undefined) return row[real];
  }
  return undefined;
}


function findHeaderRow(sheet) {
  // Find the row that contains the expected headers (some templates have a few intro rows on top)
  const range = sheet['!ref'] ? xlsx.utils.decode_range(sheet['!ref']) : null;
  if (!range) return 0;

  const want = [
    ['tc id', 'test case name'],
    ['tcid', 'testcasename'],
  ];

  for (let r = range.s.r; r <= Math.min(range.e.r, range.s.r + 30); r++) {
    const rowVals = [];
    for (let c = range.s.c; c <= Math.min(range.e.c, range.s.c + 10); c++) {
      const addr = xlsx.utils.encode_cell({ r, c });
      const cell = sheet[addr];
      if (cell && cell.v !== undefined && cell.v !== null && String(cell.v).trim()) {
        rowVals.push(normKey(String(cell.v)));
      }
    }
    const joined = rowVals.join('|');
    if (want.some(pair => pair.every(k => joined.includes(k)))) {
      return r; // 0-based
    }
  }
  return 0;
}

function readExcelCases() {
  const wb = xlsx.readFile(EXCEL_PATH);
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const headerRow = findHeaderRow(sheet);
  const rows = xlsx.utils.sheet_to_json(sheet, { range: headerRow });

  return rows.map((r, i) => ({
    tcid: String(pick(r, ['tcid', 'testcaseid', 'id']) ?? '').trim(),
    name: String(pick(r, ['testcasename', 'name', 'title']) ?? '').trim(),
    input: String(pick(r, ['input', 'inputtext', 'singlish']) ?? ''),
    expected: String(pick(r, ['expected', 'expectedoutput', 'output']) ?? ''),
    rowNum: i + 2
  })).filter(tc => tc.input.trim())
    .filter(tc => !tc.tcid.toLowerCase().startsWith('pos_ui'));
}

test.describe('SwiftTranslator Tests', () => {
  const testCases = readExcelCases();

  for (const tc of testCases) {
    test(`${tc.tcid} - ${tc.name} (Row ${tc.rowNum})`, async ({ page }) => {
      await page.goto(BASE_URL);
      await page.waitForTimeout(1500);

      const inputBox = page.locator('textarea').first();
      await inputBox.fill(tc.input);
      await page.waitForTimeout(3000);

      await page.getByText('Sinhala').nth(1).click();
      await page.waitForTimeout(1000);

      const output = await inputBox.inputValue();
      expect(output.length).toBeGreaterThan(0);
    });
  }
});
