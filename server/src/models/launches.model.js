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

launches.set(demoLaunch.flightNumber, demoLaunch);

function getAllLaunches() {
  return Array.from(launches.values());
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

module.exports = {
  getAllLaunches,
  addNewLaunch
};
