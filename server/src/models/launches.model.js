const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require('axios');

const DEFAULT_FLIGHT_NUMBER = 100;

const launches = new Map();

let latestFlightNumber = 100;

const demoLaunch = {
  flightNumber: 100, // flight_number
  mission: "Kepler Exploration X", // name
  rocket: "Falcon Heavy", //rocket.name
  launchDate: new Date("Decemeber 17, 2030"), // date_local
  target: "Kepler-442 b", //not applicable
  customer: ["ZTM", "NASA"], // payload.customers for each payload
  upcoming: true, // upcoming
  success: true, // success
};

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

// saveLaunch(demoLaunch);

async function populateLaunches() {
  console.log('Loading Launches Data');
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            customers: 1
          }
        },
      ]
    }
  });

  if (response.status !== 200) {
    console.log('Problem downloading launch data');
    throw new Error('Launch data download failed');
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {

    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
      return payload['customers'];
    });

    const flightData = {
      flightNumber: launchDoc['flight_number'],
      mission: launchDoc['name'],
      rocket: launchDoc['rocket']['name'],
      launchDate: launchDoc['date_local'],
      upcoming: launchDoc['upcoming'],
      success: launchDoc['success'],
      customers,
    };

    console.log(`${flightData['flightNumber']} ${flightData['mission']}`);

    await saveLaunch(flightData);
  }
}

async function loadLaunchesData() {

  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: 'Falcon 1',
    mission: 'FalconSat'
  });

  if (firstLaunch) {
    console.log('Luanch data already loaded');
  } else {
    await populateLaunches();
  }

}

// launches.set(demoLaunch.flightNumber, demoLaunch);

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  // return launches.has(launchId);
  return await findLaunch({ flightNumber: launchId });
}

async function saveLaunch(launch) {

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

  const planet = await planets.findOne({ keplerName: launch.target });
  if (!planet) {
    throw new Error(`Planet ${launch.target} not found`);
  }

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
  loadLaunchesData,
  existsLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById
};
