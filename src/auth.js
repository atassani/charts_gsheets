export function handleClientLoad() {
  gapi.load('client:auth2', radar.initClient);
}

export function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    gapi.auth2.getAuthInstance().isSignedIn.listen(radar.updateSigninStatus);
    radar.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = radar.handleAuthClick;
    signoutButton.onclick = radar.handleSignoutClick;
  });
}

export function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    radar.proceedWithApp();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

export function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

export function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

export function proceedWithApp() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  }).then(function(response) {
    var config = {
      questionsjson: "data/questions.json",
      params: {
        teamName: radar.getParameterByName("teamName")
      }
    };
    var range = response.result;
    radar.loadData(config, range);
  }, function(response) {
    console.log('Error: ' + response.result.error.message);
  });
}
