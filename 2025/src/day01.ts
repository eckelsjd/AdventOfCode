/**
 * AoC Day 1: Secret entrance
 * 
 * Count the number of times a circular dial loops back to 0.
 * 
 * Part 1) Just count number of times dial ends at 0
 *      2) Count all times 0 is passed (even in middle of a turn)
 * 
 * - File I/O
 * - String parsing
 * - Basic modulo math
 */
import * as fs from 'fs';
import { join } from 'path';

const dataPath = join(__dirname, '../data/day01.txt');
const lines: string[] = fs.readFileSync(dataPath, 'utf-8').split(/\r?\n/).map(line => line.trim());

let pos: number = 50;
let count_zero: number = 0;
let count_passes: number = 0;
const max_num: number = 100;

for (const line of lines) {
    if (!line) continue;
    let direction: string = line[0] ?? ''; // L or R
    let amount: number = parseInt(line.substring(1));

    if (direction === "L") {
        count_passes += Math.floor(amount / max_num);
        if ((pos > 0) && (pos - (amount % max_num)) <= 0) {
            count_passes++;
        }
        pos = (pos - (amount % max_num) + max_num) % max_num;
    } else if (direction === "R") {
        count_passes += Math.floor((pos + amount) / max_num);
        pos = (pos + amount) % max_num;
    }
    // console.log(`Direction ${direction}, Amount ${amount}, Pos ${pos}, Passes ${count_passes}`);

    if (pos === 0) {
        count_zero++;
        // console.log("Arrived at 0");
    }
}

console.log(`Total arrivals at 0: ${count_zero}`);
console.log(`Total passes by 0: ${count_passes}`);