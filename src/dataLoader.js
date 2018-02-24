import * as d3 from 'd3';

var areasArray = [["V", "Visualise"], ["W", "Limit WIP"], ["F", "Manage Flow"], ["P", "Explicit Policies"], ["L", "Feedback loops"], ["I", "Improve"], ["E", "Effects"]];
var reverseAreasArray = areasArray.map(function(f) { return [f[1], f[0]];});
export var areas =        new Map(areasArray);
export var reverseAreas = new Map(reverseAreasArray);

export default function loadData(config, range) {
  /*
    A: Area::   {V: Visualize, W: Limit WIP, F: Manage Flow, P: Explicit Policies, L: Feedback Loops, I: Improve, E: Effects}
    L: Level::  {B: Basic, I: Intermediate, A: Advanced}
    00: Order:: {01, 02, ...}
  */
  if (config === undefined) config = {};

  var teamsPerQuestions = {};
  var pattern = /\((.)(.)(..)/;
  var previousTeam;
  for (var i = 1; i < range.values.length; i++) {
    var row = range.values[i];
    var theDate = row[0];
    var theTeam = row[1];
    teamsPerQuestions[theTeam] = teamsPerQuestions[theTeam] || {};
    var dateParse = d3.timeParse("%d/%m/%Y %H:%M:%S");
    if (theTeam != previousTeam) {
      teamsPerQuestions[theTeam]['Date'] = dateParse(theDate);
    } else {
      teamsPerQuestions[theTeam]['DatePrevious'] = dateParse(theDate);
    }
    for (var j = 2; j < row.length; j++) {
      var patternExec = pattern.exec(range.values[0][j]);
      if (patternExec) {
        var theArea = areas.get(patternExec[1]);
        var theQuestionNumber = parseInt(patternExec[3]);
        var teamsAreaGroup = teamsPerQuestions[theTeam]['Areas'] = teamsPerQuestions[theTeam]['Areas'] || {};
        var teamsResponses = teamsPerQuestions[theTeam]['Responses'] = teamsPerQuestions[theTeam]['Responses'] || [];
        var teamsArea = teamsAreaGroup[theArea] = teamsAreaGroup[theArea] || {};
        var theResponseLevel = row[j];
        if (theTeam != previousTeam) {
          if (theResponseLevel) { // Avoid get nulls from partially done answers
            teamsArea[theQuestionNumber] = {"level": theResponseLevel, "trend": ""};
          }
          teamsResponses[j-2] = theResponseLevel ? theResponseLevel : '';
        } else {
          if (theResponseLevel && teamsArea[theQuestionNumber]) { // Avoid get nulls from partially done answers
            if (theResponseLevel > teamsArea[theQuestionNumber].level) {
              teamsArea[theQuestionNumber].trend = "D";
            } else {
              if (theResponseLevel < teamsArea[theQuestionNumber].level) {
                teamsArea[theQuestionNumber].trend = "U";
              }
            }
          }
        }
      }
    }
    previousTeam = theTeam;
  }
  var teams = teamsPerQuestionToTeamsPerLevel(teamsPerQuestions);

  radar.drawChart();
  radar.paintPoints(config, teams);
}

function teamsPerQuestionToTeamsPerLevel(teamsPerQuestions) {
  var teams = {};
  Object.keys(teamsPerQuestions).forEach(
    function(t) {
      teams[t] = {};
      teams[t]['Date'] = teamsPerQuestions[t]['Date'];
      teams[t]['DatePrevious'] = teamsPerQuestions[t]['DatePrevious'];
      teams[t]['Areas'] = {};
      teams[t]['Responses'] = teamsPerQuestions[t]['Responses'];
      Object.keys(teamsPerQuestions[t]['Areas']).forEach(
        function(a) {
          teams[t]['Areas'][a] = { "0": [], "1": [], "2": [] };
          Object.keys(teamsPerQuestions[t]['Areas'][a]).forEach(
            function(q) {
              var question = teamsPerQuestions[t]['Areas'][a][q];
              teams[t]['Areas'][a][question.level].push( { "value": q, "trend": question.trend } );
            }
          );
        }
      );
    }
  );
  return teams;
}
