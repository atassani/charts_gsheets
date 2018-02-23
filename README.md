# Charts GSheets

## Initialisation

Configure node package, following [these instructions](https://stackoverflow.com/questions/34700610/npm-install-wont-install-devdependencies "Stackoverflow link").
* Using node.js v9.5.0 (`node --version`), installed with `brew install node` in Mac.
* `npm init --yes` # Initialises the project and creates `package.json`
* `npm install browser-sync --save-dev` # Installs dependencies in node.js
* Modify `package.json` to adapt license, repository, author, etc. And add ans script to start the server.

### Accessing Google Sheets
* Copy the code directly from the [JavaScript Google Sheets Quickstart](https://developers.google.com/sheets/api/quickstart/js) and adapt ClientId and API Key with the ones created in [Google Developer Console](https://console.developers.google.com).
* Start local web server with `npm start`
