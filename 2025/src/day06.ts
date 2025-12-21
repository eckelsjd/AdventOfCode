/**
 * AoC: Day 6 - Trash Compactor
 * 
 * Read a list of numbers and binary operations and sum the result.
 * 
 * Part 1) Use columns of numbers as is with a single binary operation.
 *      2) Rearrange numbers by column and then sum.
 */
import * as fs from 'fs';
import { join } from 'path';

type Op = "+" | "*";

const ops: Record<Op, (a: number, b: number) => number> = {
  "+": (a, b) => a + b,
  "*": (a, b) => a * b,
};

const dataPath = join(__dirname, '../data/day06.txt');
const data: string[][] = fs.readFileSync(dataPath, 'utf-8')
    .split(/\r?\n/)
    .filter(line => line.trim().length > 0)
    .map(line => line.trim().split(/\s+/));

/**
 * Reduces an array of rows, where each row is either a string array (data) or an array of operators,
 * by applying the specified operators column-wise across all data rows.
 *
 * The last row in the input is expected to be an array of operators (`Op[]`), which are used to combine
 * the values in each column of the preceding data rows (`string[][]`). The reduction starts by converting
 * the first data row to numbers, then for each subsequent row, applies the corresponding operator to each
 * column, accumulating the result.
 *
 * @param rows - An array where each element is either a string array representing a row of data,
 *               or an array of operators (`Op[]`). The last element must be the operator row.
 * @returns An array of numbers representing the reduced result after applying the operators column-wise.
 */
function reduceRows(rows: (string[] | Op[])[]): number[] {
    const opRow = rows[rows.length - 1] as Op[];
    const dataRows = rows.slice(0, -1) as string[][];

    return dataRows.reduce((acc, row, i) => {
        if (i === 0) return row.map(Number);

        // Applies operator for each column (accumulates over rows)
        return acc.map((val, col) =>
            ops[opRow[col]!](val, parseInt(row[col]!))
        );
    }, [] as number[]);
}

let sum = reduceRows(data).reduce((acc, val) => acc + val, 0);
console.log(`Part 1) total sum of math problems: ${sum}`);

// For part 2, reorder numbers by column, right-to-left

// Get number of digits for each column
const lines: string[] = fs.readFileSync(dataPath, 'utf-8').split(/\r?\n/);
const operator_line = lines[lines.length - 1]!;
let col_widths: number[] = new Array(data[0]?.length);

let prev_idx = 0;
let col_idx = 0;
for (let i = prev_idx+1; i < operator_line.length; i++) {
    // Operators always occur at beginning of column
    if (operator_line[i] !== ' ') {
        col_widths[col_idx] = i - prev_idx - 1; // columns separated by 1 space
        prev_idx = i;
        col_idx++;
    }
}
col_widths[col_widths.length - 1] = operator_line.length - prev_idx;

// Gather data in proper cephelapod format
let new_data: string[][] = Array.from({ length: lines.length }, () => Array(col_widths.length).fill(''))

let char_idx = 0;
for (let j = 0; j < col_widths.length; j++) {
    let nums: string[] = [];
    for (let k = 0; k < col_widths[j]!; k++) {  // Read left-to-right columns
        let curr_num: string = '';
        for (let i = 0; i < lines.length-1; i++) {
            curr_num = `${curr_num}${lines[i]![char_idx + k]}` // Read top-to-bottom
        }
        nums.push(curr_num.trim());
    }

    let op = operator_line[char_idx];
    for (let i = 0; i < lines.length-1; i++) {
        if (i >= nums.length) {
            // Fill with the identity (0 for +, or 1 for *)
            if (op === "*") {
                new_data[i]![j] = "1";
            } else if (op === "+") {
                new_data[i]![j] = "0";
            }
        } else {
            // Fill with cephelapod numbers
            new_data[i]![j] = nums[i]!;
        }
    }

    new_data[lines.length-1]![j] = op!;
    char_idx = char_idx + col_widths[j]! + 1; // extra space between columns
}

// console.log(new_data);
sum = reduceRows(new_data).reduce((acc, val) => acc + val, 0);
console.log(`Part 2) total sum of math problems: ${sum}`);