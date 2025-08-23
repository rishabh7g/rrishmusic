/** @type {import("prettier").Config} */
export default {
  semi: false, // No semicolons at end of lines
  singleQuote: true, // Use single quotes instead of double
  tabWidth: 2, // 2 spaces for indentation
  trailingComma: "es5", // Trailing commas where valid in ES5
  printWidth: 80, // Line length before wrapping
  bracketSpacing: true, // Spaces inside object brackets { foo: bar }
  arrowParens: "avoid", // No parentheses around single arrow function parameters
  endOfLine: "lf", // Unix-style line endings
};
