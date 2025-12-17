/**
 * AoC Day 3: Lobby
 * 
 * Find the highest possible integer (battery joltage) of fixed length in a given sequence of numbers (battery bank).
 * 
 * Part 1) Find highest joltage for 2 batteries
 *      2) Find highest joltage for 12 batteries
 * 
 * - Basic max/extreme value search
 * - Nested for loop logic with variable start/end
 */
import * as fs from 'fs';
import { join } from 'path';

const dataPath = join(__dirname, '../data/day03.txt');
const lines: string[] = fs.readFileSync(dataPath, 'utf-8').split(/\r?\n/).map(line => line.trim());


let max_batteries = 12; // Part 1) 2, Part 2) 12
let batteries = new Array(max_batteries).fill(0);
let total_joltage = 0;

for (const bank of lines) {
    let start_idx = 0;

    // Fill each battery slot
    for (let battery_idx = 0; battery_idx < max_batteries; battery_idx++) {
        let max_jolt = 0;
        let max_idx = 0;

        // Look over valid range for next battery
        for (let i = start_idx; i < bank.length - (max_batteries - battery_idx - 1); i++) {
            let curr_jolt = parseInt(bank.charAt(i));

            if (curr_jolt > max_jolt) {
                max_idx = i;
                max_jolt = curr_jolt;
            }
        }

        batteries[battery_idx] = max_jolt;
        start_idx = max_idx + 1;
    }

    let battery_string = "";
    for (const jolt of batteries) {
        battery_string += `${jolt}`;
    }

    // console.log(`Max joltage bank: ${battery_string}`)
    total_joltage += parseInt(battery_string);
}

console.log(`Total joltage: ${total_joltage}`);
