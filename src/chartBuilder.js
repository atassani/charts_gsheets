import * as d3 from 'd3';

var width = 960,
    height = 600,
    radius = Math.min(width, height) / 2 - 10;

var data = [1, 1, 1, 1, 1, 1, 1];

var theExternalPie,
    externalArc,
    internalPie;

export default function drawChart() {
  drawPies();
  drawAreaTitles();
  drawLevelNumbers();
}

function drawPies() {
  d3.select("#chart").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")rotate(-90)")
      .attr("id", "radar");

  // Tooltip
  d3.select("body")
    .append("div")
      .attr("id", "questions")
      .attr("class", "floatingQuestion")
      .style("opacity", 0);

  // Internal Arc
  var theInternalPie = d3.pie()
    .padAngle(0.05);
  var internalArc = d3.arc()
    .outerRadius(radius / 3 - 10 )
    .innerRadius(8);

  var radar = d3.select("#radar")
          .append("g")
            .attr("id", "pie");

  internalPie = theInternalPie(data);
  var g = radar.selectAll(".internalArc")
        .data(theInternalPie(data))
      .enter().append("g")
        .attr("class", "internalArc");

  g.append("path")
      .attr("d", internalArc)
      .style("fill", "#9c9c9c")
      .attr("class", "internalArc");

  // Medium Arc
  var mediumPie = d3.pie()
    .padAngle(0.02)
  var mediumArc = d3.arc()
    .outerRadius((radius / 3) * 2 - 10 )
    .innerRadius(radius / 3 - 10);

  g = radar.selectAll(".mediumArc")
        .data(mediumPie(data))
      .enter().append("g")
        .attr("class", "mediumArc");

  g.append("path")
      .attr("d", mediumArc)
      .style("fill", "#afafaf")
      .attr("class", "mediumArc");

  // External Arc
  theExternalPie = d3.pie()
    .padAngle(0.013)
  externalArc = d3.arc()
    .outerRadius((radius / 3) * 3 - 10 )
    .innerRadius((radius / 3) * 2 - 10);

  radar.selectAll(".externalArc")
        .data(theExternalPie(data))
      .enter().append("g")
        .attr("class", "externalArc");
}

function drawAreaTitles() {
  var svg = d3.select("#radar")
          .append("g")
            .attr("id", "externalTitles");
  // Place titles around circle
  // https://www.visualcinnamon.com/2015/09/placing-text-on-arcs.html
  d3.selectAll('.externalArc')
    .append("path")
      .attr("d", externalArc)
      .style("fill", "#ccc")
      .attr("class", "externalArc")
      //.attr("id", function(d, i) { return "externalArc_" + i });
      .each(function(d,i) {
        //A regular expression that captures all in between the start of a string (denoted by ^)
        //and the first capital letter L
        var firstArcSection = /(^.+?)L/;

        //The [1] gives back the expression between the () (thus not the L as well)
        //which is exactly the arc statement
        var newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];
        //Replace all the comma's so that IE can handle it -_-
        //The g after the / is a modifier that "find all matches rather than stopping after the first match"
        newArc = newArc.replace(/,/g , " ");

        //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2)
        	//flip the end and start position
        	if (d.endAngle > 180 * Math.PI/180) {
        		var startLoc 	= /M(.*?)A/,		//Everything between the capital M and first capital A
        			middleLoc 	= /A(.*?)0 0 1/,	//Everything between the capital A and 0 0 1
        			endLoc 		= /0 0 1 (.*?)$/;	//Everything between the 0 0 1 and the end of the string (denoted by $)
        		//Flip the direction of the arc by switching the start and end point (and sweep flag)
        		var newStart = endLoc.exec( newArc )[1];
        		var newEnd = startLoc.exec( newArc )[1];
        		var middleSec = middleLoc.exec( newArc )[1];

        		//Build up the new arc notation, set the sweep-flag to 0
        		newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
        	}//if

        //Create a new invisible arc that the text can flow along
        svg.append("path")
          .attr("class", "hiddenArcs")
          .attr("id", "hiddenArc"+i)
          .attr("d", newArc)
          .style("fill", "none");
      });

  svg.selectAll(".externalText")
     .data(theExternalPie(Array.from(radar.areas.values())))
    .enter().append("text")
      .attr("class", "externalText")
      .attr("dy", function(d) { return (d.endAngle > 2.5 * Math.PI/180 ? 15 : -8); })
    .append("textPath")
      .attr("startOffset", "50%")
      .style("text-anchor","middle")
      .attr("xlink:href", function(d,i) {return "#hiddenArc" + i})
      .text(function(d) { return d.data });
}

function drawLevelNumbers() {
  var x2 = ((width / 2) - radius/3 / 2)
     ,y2 = ((height / 2) + 4);
  var g = d3.select("#radar")
    .append("g")
      .attr("id", "levels")
      .attr("transform", "translate(" + height / 2 + ",-" + width / 2 + ")rotate(-270)");
  g.append("circle")
      .attr("cx", x2)
      .attr("cy", y2 - 4)
      .attr("r", "12px")
      .attr("fill", "#fff");
  g.append("text")
      .attr("id", "level2")
      .attr("class", "levels")
      .attr("width", radius)
      .attr("text-anchor", "middle")
      .attr("x", x2)
      .attr("y", y2)
      .text("2");
  var x1 = ((width / 2) - radius/2 + 8)
     ,y1 = ((height / 2) + 4);
  g.append("circle")
      .attr("cx", x1)
      .attr("cy", y1 - 4)
      .attr("r", "12px")
      .attr("fill", "#fff");
  g.append("text")
      .attr("id", "level1")
      .attr("class", "levels")
      .attr("width", radius)
      .attr("text-anchor", "middle")
      .attr("x", x1)
      .attr("y", y1)
      .text("1");
  var x0 = ((width / 2) - radius/6 * 5 + 8)
     ,y0 = ((height / 2) + 4);
  g.append("circle")
      .attr("cx", x0)
      .attr("cy", y0 - 4)
      .attr("r", "12px")
      .attr("fill", "#fff");
  g.append("text")
      .attr("id", "level0")
      .attr("class", "levels")
      .attr("width", radius)
      .attr("text-anchor", "middle")
      .attr("x", x0)
      .attr("y", y0)
      .text("0");
}

// ------------------------------------------------------------------------

var colorFunction = d3.scaleOrdinal(d3.schemeCategory10);

// https://github.com/d3/d3-time-format/blob/master/README.md#timeFormat
var dateFormat = d3.timeFormat("%a %b %e %Y %H:%M");

var theTeams;
var theQuestions;


function generatePointsPerArea(area, level, questions) {
  var internalInnerRadius = 40,
      internalOuterRadius = (radius / 3) - 10 - 10,
      mediumInnerRadius =   (radius / 3) - 10 + 28,
      mediumOuterRadius =   (radius / 3) * 2 - 10 - 28,
      externalInnerRadius = (radius / 3) * 2 - 10 + 28,
      externalOuterRadius = (radius / 3) * 3 - 10 - 28;
  var index = Array.from(radar.areas.values()).indexOf(area);
  var configArea = {
    angleScale: d3.scaleLinear()
                  .domain([0, 1])
                  .range([internalPie[index].startAngle, internalPie[index].endAngle]),
    radiusScale: new Map([
      ["2", d3.scaleLinear().domain([0, 1]).range([internalInnerRadius, internalOuterRadius])],
      ["1", d3.scaleLinear().domain([0, 1]).range([mediumInnerRadius,   mediumOuterRadius])],
      ["0", d3.scaleLinear().domain([0, 1]).range([externalInnerRadius, externalOuterRadius])]
    ])
  };
  var points = [];

  if (questions) {
    questions.forEach( function(question) {
      var randomAngle = radar.random();
      var randomRadius = radar.random();
      var theColor = colorFunction(index);
      if (level == 0) theColor = d3.color(theColor).brighter(1);
      if (level == 2) theColor = d3.color(theColor).darker(1);
      var point = new Point(
        radar.reverseAreas.get(area),
        question.value,
        theColor,
        question.trend,
        Math.sin(configArea.angleScale(randomAngle))
          * configArea.radiusScale.get(level+'')(randomRadius)
          + (randomAngle > 0.5 ? -1 : 1)*Math.cos(configArea.angleScale(randomAngle))*10,
        -Math.cos(configArea.angleScale(randomAngle))
          * configArea.radiusScale.get(level+'')(randomRadius)
          + (randomAngle > 0.5 ? -1 : 1)*Math.sin(configArea.angleScale(randomAngle))*10
      );

      points.push( point );
    });
  }
  return points;
}

function Point(area, number, theColor, trend, x, y) {
  this.area = area;
  this.number = number;
  this.color = theColor;
  this.trend = trend;
  this.x = x;
  this.y = y;
}

function generatePoints(teamName, teams) {
  var teamData = teams[teamName];
  var teamAreasArray = Object.keys(teamData.Areas);
  var points = [];
  for (var i = 0; i < teamAreasArray.length; i++) {
    var area = teamAreasArray[i];
    for (var level = 0; level <= 2; level++) {
      points = points.concat(generatePointsPerArea(area, level, teamData.Areas[area][level]));
    }
  }
  return points;
}

export function paintPoints(config, teams) {
  theTeams = teams;
  // Team Name passed as parameter, or first team
  var teamName = config.params.teamName ? config.params.teamName : Object.keys(teams)[0];
  drawTeamNameAndDate(teamName, theTeams);
  drawTeamsSelect(teamName, theTeams);
  d3.queue()
    .defer(d3.json, config.questionsjson)
    .defer(function(callback) { callback(null, teamName); })
    .await(loadQuestionsAndDrawTeam);
}


function loadQuestionsAndDrawTeam(error, questions, teamName) {
  theQuestions = questions;
  drawTeamPoints(teamName);
  // TODO
  //radar.writeFormLink(teamName, theTeams, theQuestions);
}

function drawTeamPoints(teamName) {
  var points = generatePoints(teamName, theTeams);
  drawPoints(points);
}

function drawTeamNameAndDate(teamName, teams) {
  document.getElementById("teamName").innerText=teamName;
  document.getElementById("date").innerText=dateFormat(new Date(teams[teamName].Date));
  if (teams[teamName].DatePrevious) {
    document.getElementById("date").innerText += ' (previous ' + dateFormat(new Date(teams[teamName].DatePrevious)) + ')'
  }
}

function drawTeamsSelect(teamName, teams) {
  var dropDown = d3.select('#selectTeams')
    .append("select")
    .attr("id",    "dropDownTeams")
    .attr("class", "dropDownTeams")
    .on('change', onChange);
  dropDown.selectAll("option")
    .data(Object.keys(teams))
    .enter()
    .append("option")
      .property("selected", function(d) { return d === teamName; } )
      .text(function(d) { return d; });
}

function removeCircles() {
  d3.selectAll("#dataPoints").remove();
}

function onChange() {
  var selectedTeam = d3.select('select').property('value');
  removeCircles();
  radar.randomSeed = 1;
  drawTeamNameAndDate(selectedTeam, theTeams);
  drawTeamPoints(selectedTeam);
  //TODO
  //radar.writeFormLink(selectedTeam, theTeams, theQuestions);
}

function drawPoints(points) {
  d3.select("svg>g")
    .append("g")
    .attr("id", "dataPoints");

  drawTrendUpDataPoints(points);
  drawTrendDownDataPoints(points);
  drawTrendEqualDataPoints(points);
}

function drawTrendEqualDataPoints(points) {
  var enterData = drawDataPointsGroup(points, "");
  drawCircle(enterData);
  drawDataPointsText(enterData);
}

function drawTrendUpDataPoints(points) {
  var enterData = drawDataPointsGroup(points, "U");
  drawTriangle(enterData, "90");
  drawDataPointsText(enterData);
}

function drawTrendDownDataPoints(points) {
  var enterData = drawDataPointsGroup(points, "D");
  drawTriangle(enterData, "-90");
  drawDataPointsText(enterData);
}

function drawDataPointsGroup(points, trend) {
  return d3.select("#dataPoints")
    .selectAll("g")
    .data(
        points.filter(function(d) { return d.trend == trend }),
        function(d) { return "dataPoint" + d.area + d.number } // Key function
    )
    .enter()
    .append("g")
    .attr("id", function(d, key) { return key })
    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")" })
    .on('mouseover', function(d) { questionShow(d.area, d.number); })
    .on('mouseout', questionHide);
}

function drawTriangle(enterData, rotation) {
  var triangle = d3.symbol().type(d3.symbolTriangle).size(200);
  enterData
    .append('path')
    .attr('d', triangle)
    .attr("transform", "rotate(" + rotation + ")")
    .attr('fill', function(d) { return d.color })
    .attr("stroke", function(d) { return d3.color(d.color).darker(0.5) })
    .attr('stroke-width', 3);
}

function drawCircle(enterData) {
  enterData
    .append("circle")
    .attr("r", "8px")
    .attr("fill", function(d) { return d.color })
    .attr("stroke", function(d) { return d3.color(d.color).darker(0.5) })
    .attr('stroke-width', 3);
}

function drawDataPointsText(enterData) {
  enterData
    .append("text")
    .attr("dx", function(d) { return d.number >= 10 ? "-0.66em" : "-0.33em"})
    .attr("dy", "0.33em")
    .attr("class", "numbers")
    .attr("transform", "rotate(90)")
    .text(function(d, i) { return d.number });
}

function questionShow(area, number) {
  var questionDiv = d3.select("#questions");
  var question = theQuestions[area+number];
  questionDiv
    .transition()
    .duration(200)
    .style("opacity", .9);

  questionDiv.html(
        "<strong>" + question.question + "</strong><br/>" +
        question.answer0 + "<br/>" +
        question.answer1 + "<br/>" +
        question.answer2
      )
      .style("left", (d3.event.pageX + 14) + "px")
      .style("top", (d3.event.pageY - 25) + "px");
}

function questionHide() {
  d3.select("#questions")
    .transition()
    .duration(500)
    .style("opacity", 0);
}
