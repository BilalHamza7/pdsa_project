import { describe, expect, it } from "vitest";
import findSequentialSolutions from "../components/sequential";

describe('find puzzle solutions using sequential algorithm', () => { 
    it('should return 92 valid solutions', async () => {
        const result = await findSequentialSolutions();

        expect(result.type).toBe('sequential');
        expect(result.numberOfSolutions).toBe(92);
        expect(Array.isArray(result.solutions)).toBe(true);
        expect(result.solutions.length).toBe(92);

        const firstSolution = result.solutions[0];
        expect(firstSolution.length).toBe(8);
        expect(firstSolution.every(col => col >= 0 && col < 8)).toBe(true);
    });
});
