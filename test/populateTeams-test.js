var test = require("tape"),

    kansas = require("../build/radar.js");

  var data1 = {
    getNumberOfColumns: function() { return  61; },
    getNumberOfRows: function() { return  5; },
    getValue: function(i,j) {
      return [
        [new Date("Wed May 24 2017 13:02:18 GMT+0200 (CEST)"), "Collecting People",  "1", "1", "1", "2", "1", "0", "2", "0", "2", "1", "1", "0", "2", "2", "1", "0", "1", "1", "1", "0", "0", "1", "0", "0", "0", "0", "1", "1", "0", "0", "0", "0", "0", "1", "1", "2", "1", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "1", "2", "1", "1", "1", "0", "1", "1", "1", "0", "0", "0"],
        [new Date("Wed May 24 2017 13:22:36 GMT+0200 (CEST)"), "SUMO",               "2", "2", "2", "2", "2", "2", "2", "2", "2", "1", "1", "1", "2", "2", "2", "1", "2", "2", "2", "0", "0", "2", "2", "1", "0", "0", "2", "1", "1", "1", "0", "2", "0", "0", "0", "1", "1", "0", "2", "2", "0", "1", "1", "0", "1", "1", "0", "1", "0", "1", "1", "1", "0", "2", "1", "1", "1", "1", "0"],
        [new Date("Thu May 18 2017 17:59:02 GMT+0200 (CEST)"), "mOneygeO",           "2", "2", "2", "2", "2", "1", "2", "2", "2", "1", "1", "0", "2", "2", "1", "0", "1", "1", "1", "2", "1", "1", "1", "2", "1", "1", "2", "2", "0", "0", "0", "1", "1", "1", "1", "2", "0", "0", "0", "1", "1", "1", "1", "1", "1", "0", "0", "1", "1", "1", "2", "1", "0", "1", "1", "1", "1", "0", "1"],
        [new Date("Wed May 24 2017 08:36:16 GMT+0200 (CEST)"),	"OF2.0",              "1", "2", "2", "2", "2", "2", "2", "0", "2", "2", "2", "0", "2", "2", "2", "2", "2", "1", "2", "0", "0", "1", "1", "1", "0", "0", "2", "2", "2", "2", "2", "2", "0", "0", "0", "2", "0", "0", "0", "0", "0", "1", "1", "0", "0", "0", "0", "0", "1", "1", "1", "1", "1", "1", "1", "0", "0", "2", "1"],
        [new Date("Wed May 24 2017 13:22:36 GMT+0200 (CEST)"),	"Partial",            "2", "1", "0", "2", "2", "2", "1", "0", "1", "1", "2", "1", "0", "2"]
      ][i][j]; },
    getColumnLabel: function(i) {
      return [ "Date", "Team", "VB01", "VB02", "VB03", "VB04", "VB05", "VB06", "VI07", "VI08", "VI09", "VA10", "VA11", "VE12", "WB01", "WI02", "WA03", "WE04", "FB01", "FB02", "FI03", "FI04", "FI05", "FA06", "FA07", "FA08", "FA09", "FE10", "PB01", "PB02", "PB03",
               "PB04", "PI05", "PI06", "PA07", "PE08", "PE09", "LB01", "LB02", "LI03", "LA04", "LE05", "IB01", "IB02", "II03", "IA04", "IE05", "IE06", "IE07", "EB01", "EB02", "EB03", "EB04", "EI05", "EI06", "EI07", "EI08", "EA09", "EA10", "EE11", "EE12"
             ][i]; }
  };

test('Returns elements ', (assert) => {
  var teams = kansas.populateTeams(data1);
  //assert.comment(JSON.stringify(teams));
  assert.equal(5, Object.keys(teams).length, 'All teams loaded');
  assert.equal(7, Object.keys(teams['Collecting People']['Areas']).length, 'All areas in a team');
  assert.equal(7, Object.keys(teams['Partial']['Areas']).length, 'All areas in a partially loaded team');
  assert.deepEqual([], teams['Partial']['Areas']['Effects'][2]||[], 'All levels in a partially loaded team');
  assert.equal(12, [].concat(teams['Partial']['Areas']['Visualise'][0]||[], teams['Partial']['Areas']['Visualise'][1]||[], teams['Partial']['Areas']['Visualise'][2]||[]).length, 'All items in area of a partially loaded team');
  var itemsLimitWip = [].concat(teams['Partial']['Areas']['Limit WIP'][0]||[], teams['Partial']['Areas']['Limit WIP'][1]||[], teams['Partial']['Areas']['Limit WIP'][2]||[]).length;
  assert.equal(2, itemsLimitWip, 'Some items in area of a partially loaded team' );
  assert.deepEqual(new Date('2017-05-24T11:02:18'), teams['Collecting People']['Date'], 'Date is stored');
  // Contains value for each level
  assert.equal(3, teams['Collecting People']['Areas']['Visualise'][0].length, 'Level 0 loaded. 3 elements. [6,8,12]');
  assert.equal(6, teams['Collecting People']['Areas']['Visualise'][1].length, 'Level 1 loaded. 6 elements. [1,2,3,5,10,11]');
  assert.equal(3, teams['Collecting People']['Areas']['Visualise'][2].length, 'Level 2 loaded. 3 elements. [4,7,9]');
  assert.end();
});

test('Trend is properly calculated', (assert) => {
  var data = {
    getNumberOfColumns: function() { return  61; },
    getNumberOfRows: function() { return  3; },
    getValue: function(i,j) {
      return [
        [new Date("Wed May 24 2017 13:02:18 GMT+0200 (CEST)"), "Collecting People",  "1", "1", "1", "2", "1", "0", "2", "0", "2", "1", "1", "0", "2", "2", "1", "0", "1", "1", "1", "0", "0", "1", "0", "0", "0", "0", "1", "1", "0", "0", "0", "0", "0", "1", "1", "2", "1", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "1", "2", "1", "1", "1", "0", "1", "1", "1", "0", "0", "0"],
        [new Date("Mon Feb 10 2017 13:02:18 GMT+0200 (CEST)"), "Collecting People",  "2", "1", "0", "1", "1", "0", "2", "0", "2", "1", "1", "0", "2", "2", "1", "0", "1", "1", "1", "0", "0", "1", "0", "0", "0", "0", "1", "1", "0", "0", "0", "0", "0", "1", "1", "2", "1", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "1", "2", "1", "1", "1", "0", "1", "1", "1", "0", "0", "0"],
        [new Date("Wed May 24 2017 13:22:36 GMT+0200 (CEST)"), "SUMO",               "2", "2", "2", "2", "2", "2", "2", "2", "2", "1", "1", "1", "2", "2", "2", "1", "2", "2", "2", "0", "0", "2", "2", "1", "0", "0", "2", "1", "1", "1", "0", "2", "0", "0", "0", "1", "1", "0", "2", "2", "0", "1", "1", "0", "1", "1", "0", "1", "0", "1", "1", "1", "0", "2", "1", "1", "1", "1", "0"]
      ][i][j]; },
    getColumnLabel: function(i) {
      return [ "Date", "Team", "VB01", "VB02", "VB03", "VB04", "VB05", "VB06", "VI07", "VI08", "VI09", "VA10", "VA11", "VE12", "WB01", "WI02", "WA03", "WE04", "FB01", "FB02", "FI03", "FI04", "FI05", "FA06", "FA07", "FA08", "FA09", "FE10", "PB01", "PB02", "PB03",
               "PB04", "PI05", "PI06", "PA07", "PE08", "PE09", "LB01", "LB02", "LI03", "LA04", "LE05", "IB01", "IB02", "II03", "IA04", "IE05", "IE06", "IE07", "EB01", "EB02", "EB03", "EB04", "EI05", "EI06", "EI07", "EI08", "EA09", "EA10", "EE11", "EE12"
             ][i]; }
  };

  var teams = kansas.populateTeams(data);
  assert.equal("1", teams['Collecting People']['Areas']['Visualise'][1][0].value, 'Element contains value');
  assert.equal("D", teams['Collecting People']['Areas']['Visualise'][1][0].trend, 'Trend identified as Down');
  assert.equal("",  teams['Collecting People']['Areas']['Visualise'][1][1].trend, 'Trend identified as -');
  assert.equal("U", teams['Collecting People']['Areas']['Visualise'][1][2].trend, 'Trend identified as Up');
  assert.end();
});

test('Teams contain responses', (assert) => {
  var teams = kansas.populateTeams(data1);
  assert.equal(59, Object.keys(teams['Collecting People']['Responses']).length, '59 Responses recorded in an array');
  assert.equal("1", teams['Collecting People']['Responses'][0], 'Answer 0 is OK')
  assert.end();
});
