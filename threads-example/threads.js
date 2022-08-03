const {
    isMainThread,
    workerData,
    Worker
} = require('worker_threads');

if (isMainThread) {
    new Worker(__filename, {
        workerData: [7, 6, 2, 3]
    });
    new Worker(__filename, {
        workerData: [1, 2, 3, 4]
    });
    console.log(`Main thread started ${process.pid}`);
} else {
    console.log(`Worker process started ${process.pid}`);
    console.log(`${workerData} sorted is ${workerData.sort((a, b) => a - b)}`);
}