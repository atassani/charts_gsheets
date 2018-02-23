import * as d3 from 'd3';

var width = 960,
    height = 600,
    radius = Math.min(width, height) / 2 - 10;

var data = [1, 1, 1, 1, 1, 1, 1];

var theExternalPie,
    externalArc,
    internalPie;

export var areas = new Map([["V", "Visualise"], ["W", "Limit WIP"], ["F", "Manage Flow"], ["P", "Explicit Policies"], ["L", "Feedback loops"], ["I", "Improve"], ["E", "Effects"]]);
export var reverseAreas = new Map([["Visualise", "V"], ["Limit WIP", "W"], ["Manage Flow", "F"], ["Explicit Policies", "P"], ["Feedback loops", "L"], ["Improve", "I"], ["Effects", "E"]]);

var seed = 1;
function random() {
  var x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}
export default function drawChart(config) {
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
