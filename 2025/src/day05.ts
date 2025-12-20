/**
 * AoC Day 5: Cafeteria
 * 
 * Parse a database of fresh ingredients and available ingredients.
 * 
 * Part 1) Count number of available fresh ingredients
 *      2) Count total number of ingredients considered to be fresh
 * 
 * - Range/intersection math
 * - Handling tons of edge cases
 */

import * as fs from 'fs';
import { join } from 'path';

const dataPath = join(__dirname, '../data/day05.txt');
const lines: string[] = fs.readFileSync(dataPath, 'utf-8').split(/\r?\n/).map(line => line.trim());

let fresh_ranges: [number, number][] = [];
let first_half = true;
let count_total_fresh = 0;

for (const line of lines) {
    if (line.length === 0) {
        first_half = false;
        continue;
    }

    // Store ranges in first part of database
    if (first_half) {
        let id_range = line.split("-");
        fresh_ranges.push([parseInt(id_range[0]!), parseInt(id_range[1]!)]);
    } 
    
    // Look at available ingredients in second part of database (part 1 only)
    else {
        let available_id = parseInt(line);
        for (let range of fresh_ranges) {
            if ((range[0] <= available_id) && (available_id <= range[1])) {
                count_total_fresh++;
                break;
            }
        }
    }
}

console.log(`Part 1) Total number of available fresh ingredients: ${count_total_fresh}`);

// For part 2) reduce to non-overlapping ranges
let unique_ranges: [number, number][] = [];
for (let range of fresh_ranges) {
    let ranges_to_add: [number, number][] = [range];

    for (let existing_range of unique_ranges) {
        let lb_e = existing_range[0];
        let ub_e = existing_range[1];

        let temp_ranges: [number, number][] = []; // when intervals get split
        let del_idx: Set<number> = new Set();     // for completely overlapping intervals

        // Remove intersections case by case
        for (let i = 0; i < ranges_to_add.length; i++) {
            let a_range = ranges_to_add[i]!;
            let lb = a_range[0];
            let ub = a_range[1];

            // Complete overlap
            if ((lb_e <= lb) && (ub_e >= ub)) {
                del_idx.add(i);
            }

            // Single item (on a boundary or inside existing range)
            else if ((lb === ub) && ((lb === lb_e) || (lb === ub_e) || ((lb >= lb_e) && (lb <= ub_e)))) {
                del_idx.add(i);
            }

            // Complete interior - split into two ranges
            else if ((lb_e > lb) && (lb_e < ub) && (ub_e < ub) && (ub_e > lb)) {
                ranges_to_add[i] = [lb, lb_e-1];
                temp_ranges.push([ub_e+1, ub]);
            }

            // Left partial overlap
            else if ((lb_e <= lb) && (lb_e < ub) && (ub_e >= lb) && (ub_e < ub)) {
                ranges_to_add[i] = [ub_e+1, ub];
            }

            // Right partial overlap
            else if ((lb_e <= ub) && (lb_e > lb) && (ub_e >= ub) && (ub_e > lb)) {
                ranges_to_add[i] = [lb, lb_e-1];
            }
        }

        // Update intervals to add
        for (let i = 0; i < ranges_to_add.length; i++) {
            if (del_idx.has(i)) {
                continue;
            }
            temp_ranges.push(ranges_to_add[i]!);
        }

        ranges_to_add = Array.from(temp_ranges);
    }

    for (let range of ranges_to_add) {
        unique_ranges.push(range);
    }
}

let total_unique = 0;
for (let range of unique_ranges) {
    let to_add = (range[1] - range[0] + 1);
    total_unique += to_add;
    // console.log(`For unique range ${range}, adding ${to_add} unique items`);
}

console.log(`Part 2) Total unique fresh ingredients: ${total_unique}`);

