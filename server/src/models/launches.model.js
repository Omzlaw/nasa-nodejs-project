const launchesDatabase = require("./launches.mongo");
const launches = new Map();

let latestFlightNumber = 100;

const demoLaunch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Falcon Heavy",
  launchDate: new Date("Decemeber 17, 2030"),
  target: "Kepler-442 b",
  customer: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

saveLaunch(demoLaunch);

// launches.set(demoLaunch.flightNumber, demoLaunch);

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

async function saveLaunch(launch) {
  await launchesDatabase.updateOne({
    flightNumber: launch.flightNumber,
  }, launch, { upsert: true });
}

async function getAllLaunches() {
  // return Array.from(launches.values());
  return await launchesDatabase
    .find({}, { '_id': 0, '__v': 0 });
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      upcoming: true,
      success: true,
      customers: ["ZTM", "NASA"],
      flightNumber: latestFlightNumber,
    })
  );
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  addNewLaunch,
  abortLaunchById
};
