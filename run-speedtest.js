/* eslint-disable no-console */
const config = require('config');
const { exec } = require('child_process');
const dbInit = require('./db');

// Get the command to execute
const cmd = config.get('speedtest.commandString');

// Timing related constants
const intervalMS = config.get('speedtest.intervalMins')*60*1000;

const isDaemon = process.argv[2] === 'daemon';

function insertData(result) {
  dbInit().then((dbs) => {
    const byteToMbit = 0.000008;
    const { timestamp } = result;
    const ping = result.ping.latency;
    const { jitter } = result.ping;
    const download = result.download.bandwidth * byteToMbit;
    const upload = result.upload.bandwidth * byteToMbit;
    const speedtestResult = {
      date: new Date(timestamp), ping, download, upload, jitter,
    };
    dbs.insertOne(speedtestResult, (err) => {
      if (err) {
        console.error(err);
      }
      if (!isDaemon) {
        process.exit();
      }
    });
  }).catch((err) => {
    console.error('Failed to connect to mongo');
    console.error(err);
    process.exit(1);
  });
}

function processOutput(error, stdout, stderr) {
  if (error) {
    console.error('Error executing Speedtest');
    console.error(error);
  }
  if (stderr) {
    console.error(stderr);
  }
  try {
    const data = JSON.parse(stdout);
    insertData(data);
  } catch (err) {
    console.error('Failed to connect to parse output');
    console.error(err);
  } finally {
    if (isDaemon) {
      // No matter if there is an error, re-schedule.
      // eslint-disable-next-line no-use-before-define
      const delay = intervalMS;
      console.log(`Sleeping for ${Math.floor((delay / 1000) / 60)} minutes before next run...`);
      // eslint-disable-next-line no-use-before-define
      setTimeout(executeSpeedtest, delay);
    }
  }
}

function executeSpeedtest() {
  exec(cmd, processOutput);
}

executeSpeedtest();
