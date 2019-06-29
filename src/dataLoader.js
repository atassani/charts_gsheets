import * as d3 from 'd3';

var areasArray = [["V", "Visualise"], ["W", "Limit WIP"], ["F", "Manage Flow"], ["P", "Explicit Policies"], ["L", "Feedback loops"], ["I", "Improve"], ["E", "Effects"]];
var reverseAreasArray = areasArray.map(function(f) { return [f[1], f[0]];});
export var areas =        new Map(areasArray);
export var reverseAreas = new Map(reverseAreasArray);

export default function loadData(config, range) {
  d3.json('data/teams.json', function(error, data) {
    console.log(teams);
    var teams = data;
    radar.drawChart();
    radar.paintPoints(config, teams);
  });
}
