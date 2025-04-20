const THREAD_COUNT = 8;

export default function findThreadedSolutions() {
    const start = performance.now();
    let completed = 0;
    const allSolutions = [];
    const workers = [];

    return new Promise((resolve, reject) => {
        for (let col = 0; col < THREAD_COUNT; col++) {
            const worker = new Worker('/threadedWorker.js', { type: "module" });
            workers.push(worker);

            worker.postMessage({ startCol: col });

            worker.onmessage = (event) => {
                allSolutions.push(...event.data.solutions);
                completed++;

                if (completed === THREAD_COUNT) {
                    const end = performance.now();
                    workers.forEach(w => w.terminate());

                    resolve({
                        type: "threaded",
                        timeTaken: +(end - start).toFixed(2),
                        numberOfSolutions: allSolutions.length,
                        solutions: allSolutions
                    });
                }
            };

            worker.onerror = (error) => {
                reject(error);
            };
        }
    });
}
