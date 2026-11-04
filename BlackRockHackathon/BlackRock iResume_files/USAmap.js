/*  This visualization was made possible by modifying code provided by:

Scott Murray, Choropleth example from "Interactive Data Visualization for the Web"
https://github.com/alignedleft/d3-book/blob/master/chapter_12/05_choropleth.html

Malcolm Maclean, tooltips example tutorial
http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html

Mike Bostock, Pie Chart Legend
http://bl.ocks.org/mbostock/3888852  */


//Width and height of map
var margin = {top: 20, right: 20, bottom: 40, left: 20},
    width = window.innerWidth - margin.left - margin.right,
    height = window.innerHeight;

// D3 Projection
var projection = d3.geo.albersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US

// Define path generator
var path = d3.geo.path()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection


// Define linear scale for output
var color = d3.scale.linear()
			  .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

var populationScale = d3.scale.linear().domain([-5, 0, 5]).range(["#d8b365", "#f5f5f5", "#5ab4ac"]);

var digitScale = d3.scale.category10()


var lowColor = '#faf0f0';
var highColor = '#bc2a66';
var minFreq = 0;
var maxFreq = 0;
var freq = [];
var totalFreq = 0;

var legendText = ["Cities Lived", "States Lived", "States Visited", "Nada"];

//Create SVG element and append map to the SVG
var svg = d3.select(".col-1-3")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

// Append Div for tooltip to SVG
var div = d3.select("body")
		    .append("div")
    		.attr("class", "tooltip")
    		.style("opacity", 0);

// Load in my states data!
d3.csv("locs_freq.csv", function(data) {
color.domain([0,1,2,3]); // setting the range of the input data

// Load GeoJSON data and merge with states data
d3.json("data/us-states2.json", function(error, json) {

// var states = topojson.feature(shapes, shapes.objects.states).features;

// Loop through each state data value in the .csv file
for (var i = 0; i < data.length; i++) {

	// Grab State Name
	var dataState = data[i].state;

	// Grab data value
	var dataValue = data[i].frequency;
  freq.push(parseInt(dataValue));
  totalFreq += parseInt(dataValue);

	// Find the corresponding state inside the GeoJSON
	for (var j = 0; j < json.features.length; j++)  {
		var jsonState = json.features[j].properties.NAME;

		if (dataState == jsonState) {

		// Copy the data value into the JSON
		json.features[j].properties.frequency = dataValue;

		// Stop looking through the JSON
		break;
		}
	}
}

function add(a, b) {
    return a + b;
}

maxFreq = d3.max(freq);
  var ramp = d3.scale.linear().domain([minFreq,maxFreq]).range([lowColor,highColor]);

// Bind the data to the SVG and create one path per GeoJSON feature
svg.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
  .on("mouseover", function(d) {
    	div.transition()
      	   .duration(200)
           .style("opacity", .9);
           div.text(Math.ceil((d.properties.frequency/100)*100)/100 + "%")
           .style("left", (d3.event.pageX) + "px")
           .style("top", (d3.event.pageY - 28) + "px");
	})
	.style("stroke", "#fff")
	.style("stroke-width", "1")
  .style("fill", function(d) {
    return ramp(d.properties.frequency)
  });

  // var w = 140, h = 300;
  //
	// 	var key = d3.select(".col-1-3")
  //     .append("svg")
	// 		.attr("width", w)
	// 		.attr("height", h)
	// 		.attr("class", "legend");
  //
	// 	var legend = key.append("defs")
	// 		.append("key:linearGradient")
	// 		.attr("id", "gradient")
	// 		.attr("x1", "100%")
	// 		.attr("y1", "0%")
	// 		.attr("x2", "100%")
	// 		.attr("y2", "100%")
	// 		.attr("spreadMethod", "pad");
  //
	// 	legend.append("stop")
	// 		.attr("offset", "0%")
	// 		.attr("stop-color", highColor)
	// 		.attr("stop-opacity", 1);
  //
	// 	legend.append("stop")
	// 		.attr("offset", "100%")
	// 		.attr("stop-color", lowColor)
	// 		.attr("stop-opacity", 1);
  //
	// 	key.append("rect")
	// 		.attr("width", w - 100)
	// 		.attr("height", h)
	// 		.style("fill", "url(#gradient)")
	// 		.attr("transform", "translate(0,10)");
  //
	// 	var y = d3.scale.linear()
	// 		.range([h, 0])
	// 		.domain([minFreq, maxFreq]);
  //
	// 	var yAxis = d3.axis.orient("right");
  //
	// 	key.append("g")
	// 		.attr("class", "y axis")
	// 		.attr("transform", "translate(41,10)")
	// 		.call(yAxis)
  // });


// 	.style("fill", function(d) {
// 	// Get data value
// 	var value = d.properties.frequency;
//   // console.log(value);
//   console.log(maxFreq);
//
// 	if (value) {
// 	//If value exists…
//   // console.log(populationScale(0.1 * d.properties.frequency));
// 	return populationScale(0.1 * d.properties.frequency);
// 	} else {
// 	//If value is undefined…
// 	return "rgb(213,222,217)";
// 	}
// });


// Map the cities I have lived in!
// d3.csv("data/cities-lived.csv", function(data) {
//
// svg.selectAll("circle")
// 	.data(data)
// 	.enter()
// 	.append("circle")
// 	.attr("cx", function(d) {
// 		return projection([d.lon, d.lat])[0];
// 	})
// 	.attr("cy", function(d) {
// 		return projection([d.lon, d.lat])[1];
// 	})
// 	.attr("r", function(d) {
// 		return Math.sqrt(d.years) * 4;
// 	})
// 		.style("fill", "rgb(217,91,67)")
// 		.style("opacity", 0.85)
//
// 	// Modification of custom tooltip code provided by Malcolm Maclean, "D3 Tips and Tricks"
// 	// http://www.d3noob.org/2013/01/adding-tooltips-to-d3js-graph.html
// 	.on("mouseover", function(d) {
//     	div.transition()
//       	   .duration(200)
//            .style("opacity", .9);
//            div.text(d.place)
//            .style("left", (d3.event.pageX) + "px")
//            .style("top", (d3.event.pageY - 28) + "px");
// 	})
//
//     // fade out tooltip on mouse out
//     .on("mouseout", function(d) {
//         div.transition()
//            .duration(500)
//            .style("opacity", 0);
//     });
// });

// Modified Legend Code from Mike Bostock: http://bl.ocks.org/mbostock/3888852
// var legend = d3.select(".col-1-3").append("svg")
//       			.attr("class", "legend")
//      			.attr("width", 140)
//     			.attr("height", 200)
//    				.selectAll("g")
//    				.data(color.domain().slice().reverse())
//    				.enter()
//    				.append("g")
//      			.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  	// legend.append("rect")
   // 		  .attr("width", 18)
   // 		  .attr("height", 18)
   // 		  .style("fill", color);
    //
  	// legend.append("text")
  	// 	  .data(legendText)
    //   	  .attr("x", 24)
    //   	  .attr("y", 9)
    //   	  .attr("dy", ".35em")
    //   	  .text(function(d) { return d; });
	});

});
