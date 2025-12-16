/**
 * AoC Day 2: Gift Shop
 * 
 * Find all invalid product IDs in a list where the ID is a set of repeating integer groups.
 * 
 * Part 1) Count sequences of integers with only 2 repeating groups
 *      2) Count sequences with any length of repeating integers 
 * 
 * - File I/O
 * - String parsing
 * - Basic nested loop logic (find/search)
 */
import * as fs from 'fs';
import { join } from 'path';

const dataPath = join(__dirname, '../data/day02.txt');
const items: string[] = fs.readFileSync(dataPath, 'utf-8').trim().split(',');

let total_sum_part_one: number = 0;
let total_sum_part_two: number = 0;

for (const item of items) {
    const ids: string[] = item.split('-');
    let first_str = ids[0] ?? '0';
    let second_str = ids[1] ?? '0';
    let first_id: number = parseInt(first_str);
    let second_id: number = parseInt(second_str);

    for (let i = first_id; i <= second_id; i++) {
        let i_str = `${i}`;

        // Part 1) Only check evenly divisible numbers
        if (i_str.length % 2 === 0) {
            let mid = i_str.length/2;
            if (i_str.substring(0, mid) === i_str.substring(mid)) {
                total_sum_part_one += parseInt(i_str);
            }
        }

        // Part 2) Check any sequence of repeating numbers of at least length 2
        let mid = Math.floor(i_str.length / 2);
        let is_invalid: boolean = false;
        for (let len = 1; len <= mid; len++) {
            if (i_str.length % len === 0) {
                let sequence = i_str.substring(0, len);
                let num_groups = i_str.length / len;
                let found_invalid = true;
                for (let k = 1; k < num_groups; k++) {
                    let seq_check = i_str.substring(k*len, (k+1)*len);
                    if (seq_check !== sequence) {
                        found_invalid = false; // only invalid if it is a repeating sequence
                        break;
                    }
                }

                if (found_invalid) {
                    is_invalid = true;
                    break;
                }
            }
        }

        if (is_invalid) {
            total_sum_part_two += parseInt(i_str);
        }
    }
}

console.log(`Total sum of invalid IDs part 1: ${total_sum_part_one}`);
console.log(`Tota sum of invalid IDs part 2: ${total_sum_part_two}`);