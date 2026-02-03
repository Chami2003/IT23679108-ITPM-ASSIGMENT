# IT23679108-ITPM-ASSIGMENT
# IT23679108 – Playwright Test Automation

## About

This project tests the SwiftTranslator website (https://www.swifttranslator.com/) using test cases from an Excel file.

## What You Need

- Node.js 16 or higher
- Internet connection

## Setup

1. **Clone the project**
```bash
(https://github.com/Chami2003/IT23679108-ITPM-ASSIGMENT.git)
cd IT23679108
```

2. **Install dependencies**
```bash
npm install
```

3. **Install browsers**
```bash
npx playwright install
```

## Run Tests

```bash
npx playwright test
```

## View Results

```bash
npx playwright test --reporter=html
```

## Test Data

Tests are in `test-data/Assignment 1 - Test cases IT23679108.xlsx` with these columns:
- TCID
- Test Case Name
- Input
- Expected
- Type

## Project Files

```
IT23679108/
├── e2e/
│   └── swifttranslator.excel.spec.js
├── test-data/
│   └── testcases.xlsx
├── playwright.config.js
├── package.json
└── README.md
```

