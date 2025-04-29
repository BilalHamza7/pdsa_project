const THREAD_COUNT = 8;

export default function findThreadedSolutions() {
    const start = performance.now();  // start timer
    let completed = 0;
    const allSolutions = [];
    const workers = [];

    return new Promise((resolve, reject) => {
        for (let col = 0; col < THREAD_COUNT; col++) {
            const worker = new Worker('/threadedWorker.js', { type: "module" });  // create a worker thread
            workers.push(worker);

            worker.postMessage({ startCol: col });  // start thread with starting queen position of row 1

            // eslint-disable-next-line no-loop-func
            worker.onmessage = (event) => {  // on thread result received
                allSolutions.push(...event.data.solutions);  // save solutions in an array
                completed++;  // increment thread result count

                if (completed === THREAD_COUNT) {
                    const end = performance.now();  // end timer
                    workers.forEach(w => w.terminate());  // kill all workers

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
