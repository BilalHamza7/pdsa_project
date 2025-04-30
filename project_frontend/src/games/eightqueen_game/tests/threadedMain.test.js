import { describe, expect, it, vi } from "vitest";
import findThreadedSolutions from "../components/threadedMain";

describe("findThreadedSolutions", () => {
    it("should resolve with combined solution result", async () => {
        const fakeSolutions = [
            [0, 4, 7, 5, 2, 6, 3, 1],
            [1, 3, 5, 7, 2, 4, 6, 0]
        ];

        // mock Worker behavior
        const mockWorkerInstances = [];

        global.Worker = vi.fn().mockImplementation(() => {
            const worker = {
                postMessage: vi.fn(),
                terminate: vi.fn(),
                onmessage: null,
            };
            mockWorkerInstances.push(worker);
            return worker;
        });

        const promise = findThreadedSolutions();

        // 8 worker responses (one per thread)
        for (let i = 0; i < 8; i++) {
            mockWorkerInstances[i].onmessage?.({ data: { solutions: fakeSolutions } });
        }

        const result = await promise;

        // Basic result expectations
        expect(result.type).toBe("threaded");
        expect(result.numberOfSolutions).toBe(8 * fakeSolutions.length);
        expect(result.solutions[0]).toEqual([0, 4, 7, 5, 2, 6, 3, 1]);
    });
});
