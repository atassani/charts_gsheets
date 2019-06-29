# Charts GSheets

## Initialisation

Configure node package, following [these instructions](https://stackoverflow.com/questions/34700610/npm-install-wont-install-devdependencies "Stackoverflow link").
* Using node.js v9.5.0 (`node --version`), installed with `brew install node` in Mac.
* `npm init --yes` # Initialises the project and creates `package.json`
* `npm install browser-sync --save-dev` # Installs dependencies in node.js
* `npm install uglify-js` # Don't know what is not installed with dependencies...
* Modify `package.json` to adapt license, repository, author, etc. And add and script to start the server.

### Accessing Google Sheets
* Copy the code directly from the [JavaScript Google Sheets Quickstart](https://developers.google.com/sheets/api/quickstart/js) and adapt ClientId and API Key with the ones created in [Google Developer Console](https://console.developers.google.com).
* Start local web server with `npm start`

### Docker
Built with:
* `docker build  -t kansas-radar .`
* `docker run --name kansas-radar -d -p 8080:80 kansas-radar`
* `docker exec -it kansas-radar /bin/sh`
Check:
* `docker ps -a`
* `docker images -a`
Deleted with:
* `docker stop kansas-radar`
* `docker rm kansas-radar`
* `docker rmi -f kansas-radar`
