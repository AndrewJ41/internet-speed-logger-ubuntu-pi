# Internet Speed Logger - Ubuntu - Raspberry Pi 4 Edition

_An application to track your internet download and upload speeds with an elegant web interface which authenticates a user with basic auth._

![Preview of Internet Speed Logger](https://i.imgur.com/LhtHxpZ.gif)

This is a time series based application which continuously monitors your internet connection and plots the results within a responsive web view along with providing basic aggregation of the current visible timeframe (mean). This leverages the [official Speedtest.net CLI binary](https://www.speedtest.net/apps/cli) from Ookla to provide the best performance possible.

## Components

The requirements for Internet Speed Logger are:
- NodeJS 12-LTS or newer
- MongoDB

There are three core components to running Internet Speed Logger:
- Webserver (`/index.js`) - Webserver which delivers static assets and provides API, also provides Basic Auth for serving over the web. 
- Speedrunner (`/run-speedtest.js`) - Daemon or One Shot process which performs the internet speed test.
- MongoDB - "Web Scale" persistence layer. 😜

The Webserver and MongoDB must always be running, however the Speedrunner can be either run as a daemon `/run-speedtest.js daemon` or invoked via cron or SystemD timer as a oneshot process `/run-speedtest.js`. Both the Webserver and Speedrunner share the common config within `/config/default.js`.

In this configuration they are run using Forever which in trn calls the app.json config in the root of this project.

## Configuration

With the excpetion of `db/db-setup.js` & `db/init-mongo.sh` - all configuration is held within the `/config/default.js` directory. The following options are available:

| Leaf | Default | Description |
| -- | -- | -- |
| `webserver.listenPort`      | `3000`       | Port which the webserver will listen on   |
| `webserver.listenHost`      | `0.0.0.0`       | Host which the webserver will listen on   |
| `db.ip` 	 | IP to use to connect to MongoDB.         | Forms part of the connection string the connection for the backend MongoDB compliant database. See: [Connection String URI Format](https://docs.mongodb.com/manual/reference/connection-string/)      |
| `db.port`      | `speedtest`       | Port to use to connect to MongoDB.   |
| `db.name`      | `speedtest`       | DB Name to use within MongoDB compliant database.   |
| `db.user`      | `speedtest`       | User to use with a MongoDB compliant DB Collection.   |
| `db.password`      | `speedtest`       | Password to use for the specified User within MongoDB compliant database.   |
| `db.collection`      | `speedtest`       | Collection to use within MongoDB compliant database.   |
| `speedtest.commandString`      | `bin/speedtest -f json --accept-license`       | Raw command to execute to perform speed test. Change this if you want it on a different path or specify a specific server.   |
| `speedtest.intervalMins`      | `5`       | Interval for which the speedtest will be run.   |
| `authentication.user`      | `admin`       | Username used for Web Interace  Basic Auth check.   |
| `authentication.password`      | `password`       | Password used for Web Interface Basic Auth check.   |

## Running Internet Speed Logger
### Forever
Install the following:
- NodeJS: https://nodejs.org/en/download/package-manager/ 
- MongoDB: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
- Forever: https://www.npmjs.com/package/forever 

```
git clone https://github.com/andrewj041/internet-speed-logger-ubuntu-pi.git
cd internet-speed-logger
npm ci
sh db/init-mongo.sh
npm run app
```
