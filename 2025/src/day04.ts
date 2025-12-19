/**
 * AoC Day 4: Printing department
 * 
 * Search over a grid for paper rolls to remove by forklift.
 * 
 * Part 1) Count the number of paper rolls that are eligible for removal (at most 3 neighbors)
 *      2) Keep removing rolls until it is no longer possible, and count total removals
 * 
 * - Grid search
 * - 2D array stencils
 */
import * as fs from 'fs';
import { join } from 'path';

const dataPath = join(__dirname, '../data/day04.txt');
let lines: string[][] = fs.readFileSync(dataPath, 'utf-8').split(/\r?\n/).map(line => line.trim().split(''));

const num_rows = lines.length;
const num_cols = lines[0]!.length;
const roll_char = "@";
const max_rolls = 3;
let num_valid_rolls = 0;
let remove_rolls = true; // Only for part 2)

let searching_for_rolls = true;

while (searching_for_rolls) {
    searching_for_rolls = false;  // reset each time
    
    // Search all characters in the grid
    for (let i =  0; i < num_rows; i++) {
        for (let j = 0; j < num_cols; j++) {
            let curr_char = lines[i]![j];

            if (curr_char === roll_char) {
                // Look at adjacent characters and count number of rolls
                let num_rolls = 0;
                let valid_roll = true;
                loop1: for (let i_b = Math.max(0, i - 1); i_b <= Math.min(num_rows-1, i + 1); i_b++) {
                    for (let j_b = Math.max(0, j - 1); j_b <= Math.min(num_cols-1, j+1); j_b++) {
                        if (i_b === i && j_b === j) {
                            continue;
                        }
                        if (lines[i_b]![j_b] === roll_char) {
                            num_rolls++;

                            if (num_rolls > max_rolls) {
                                valid_roll = false;
                                break loop1;
                            }
                        }
                    }
                }

                if (valid_roll) {
                    num_valid_rolls++;

                    if (remove_rolls) {              // Part 2 only
                        lines[i]![j] = ".";          // Remove the roll
                        searching_for_rolls = true;  // keep looking now
                    }
                }
            }
        }
    }
}

if (!remove_rolls) {
    console.log(`Part 1) Number of valid rolls for forklift: ${num_valid_rolls}`);
} else {
    console.log(`Part 2) Total number of rolls removed: ${num_valid_rolls}`);
}
