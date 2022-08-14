const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;

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

async function existsLaunchWithId(launchId) {
  // return launches.has(launchId);
  return await launchesDatabase.findOne({ flightNumber: launchId });
}

async function saveLaunch(launch) {

  const planet = await planets.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error(`Planet ${launch.target} not found`);
  }

  await launchesDatabase.findOneAndUpdate({
    flightNumber: launch.flightNumber,
  }, launch, { upsert: true });
}

async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase
    .findOne()
    .sort({ flightNumber: -1 });

  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestLaunch.flightNumber;
}

async function getAllLaunches() {
  // return Array.from(launches.values());
  return await launchesDatabase
    .find({}, { '_id': 0, '__v': 0 });
}

async function scheduleNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["ZTM", "NASA", "OMZ"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

// function addNewLaunch(launch) {
//   latestFlightNumber++;
//   launches.set(
//     latestFlightNumber,
//     Object.assign(launch, {
//       upcoming: true,
//       success: true,
//       customers: ["ZTM", "NASA"],
//       flightNumber: latestFlightNumber,
//     })
//   );
// }

async function abortLaunchById(launchId) {
  // const aborted = launches.get(launchId);
  // aborted.upcoming = false;
  // aborted.success = false;
  // return aborted;

  const aborted = await launchesDatabase.findOneAndUpdate({
    flightNumber: launchId,
  }, {
    upcoming: false,
    success: false,
  });

  return aborted.ok === 1 && aborted.nModified === 1;
}

module.exports = {
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById
};
