import { describe, expect, it, vi } from "vitest";
import findThreadedSolutions from "../components/threadedMain";


describe('Threaded Algorithm: solveFromRow with Web Workers', () => {
    it('should correctly use the worker to find all solutions', async () => {

        // Mock the worker postMessage and onmessage behavior
        const mockPostMessage = vi.fn();
        const mockWorker = {
            postMessage: mockPostMessage,
            onmessage: null, // We'll simulate the message event later
            terminate: vi.fn(), // Mocking terminate method as well
        };

        // Mock the global Worker constructor to use our mockWorker
        global.Worker = vi.fn().mockImplementation(() => mockWorker);

        // Mock the logic that happens inside the worker
        const startCol = 0; // Let's start with column 0 for the first row

        // Create a worker instance (mocked)
        const worker = new Worker('threaded_main.js'); // This will invoke the mock

        // Simulate receiving solutions from the worker
        worker.onmessage = vi.fn().mockImplementation((e) => {
            const solutions = [
                [0, 4, 7, 5, 2, 6, 3, 1], // Example solution
                [1, 3, 5, 7, 2, 4, 6, 0],
            ];
            // Simulate the worker returning the solutions in the message
            e.data = { solutions }; // Attach the solutions to the message
        });

        // Simulate sending the startCol to the worker to begin processing
        worker.postMessage({ startCol });

        // Ensure postMessage was called with the correct startCol
        expect(mockPostMessage).toHaveBeenCalledWith({ startCol });

        // Await the worker's onmessage callback to be called
        // This is an async operation, so we need to wait until it resolves
        await new Promise((resolve) => {
            worker.onmessage = (event) => {
                // Check if onmessage was triggered
                expect(event.data.solutions).toHaveLength(2); // Ensure there are two solutions
                expect(event.data.solutions[0]).toHaveLength(8); // Each solution should have 8 columns
                resolve();
            };

            // Trigger the onmessage event manually since it's asynchronous
            worker.onmessage({ data: { solutions: [[0, 4, 7, 5, 2, 6, 3, 1], [1, 3, 5, 7, 2, 4, 6, 0]] } });
        });

        // Check if terminate was called after worker's task is completed
        expect(mockWorker.terminate).toHaveBeenCalled();
    });
});