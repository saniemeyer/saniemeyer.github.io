
var margin = {top: 10, right: 70, bottom: 75, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
	
var font = 'Georgia'

var svg = d3.select('.chart')
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		  
var axesCreated = 0;
	
var Tooltip = d3.select(".chart").select(".tooltip")
	  .style("opacity", 0)
	  .style("background-color", "white")
	  .style("border", "solid")
	  .style("border-width", "2px")
	  .style("border-radius", "5px")
	  .style("width", width + 100 + "px")
	  .style("padding", "5px");

var raw = null;
function loadData(){
	d3.csv("https://raw.githubusercontent.com/saniemeyer/Data-Visualization/main/russia_losses_with_sqkm.csv", function(d) {
		return { date : d3.timeParse("%m/%d/%Y")(d.date), sqkm : d.sqkm, personnel : d.personnel }
	})
	.then(function(d) {
		raw = d;
		init();
		analyze(d);

	})
}

function clear() {
	
	svg.selectAll(".axis")
		.style("opacity", 0)
		.remove();
	
	svg.selectAll("g")
		.transition()
		.duration(500)
		.style("opacity", 0)
		.remove();
		
	axesCreated = 0;
	
	svg.selectAll("path")
		.transition()
		.duration(500)
		.style("opacity", 0)
		.remove();
		
	svg.selectAll(".annotation").remove();
}

function loadAnnotations(stepData){
	
	svg.selectAll(".annotation").remove();
	
	var annotations = [];
	
	if (stepData == 1) {
		annotations = [
			{
				note: {
					label: "But had already lost 5,300 men",
					//title: "Annotation title"
				},
				x: margin.left - 70,
				y: margin.top + height - 25 ,
				dy: -45,
				dx: 30
			},
			{
				note: {
					label: "Russia gained 77,000 sq km since the start of the invasion",
					//title: "Annotation title"
				},
				x: margin.left - 70,
				y: margin.top + height - 130 ,
				dy: -45,
				dx: 30
			}

		]
	}
	
	if (stepData == 2) {
		annotations = [
			{
				note: {
					label: "During this period losses nearly tripled, rising from 5,300 to 15,300",
					//title: "Annotation title"
				},
				x: margin.left - 65,
				y: margin.top + height - 25 ,
				dy: -45,
				dx: 30
			},
			{
				note: {
					label: "Peak of Russian territorial conquest",
					//title: "Annotation title"
				},
				x: margin.left - 65,
				y: margin.top + height - 300 ,
				dy: 45,
				dx: 30
			}

		]
	}
	
	if (stepData == 3) {
		annotations = [
			{
				note: {
					label: "The retreat from northern Ukraine resulted in relatively few casualties, but a massive loss of territory",
					//title: "Annotation title"
				},
				x: margin.left - 20,
				y: margin.top + height - 40 ,
				dy: -1,
				dx: 0
			}

		]
	}
	
	if (stepData == 4) {
		annotations = [
			{
				note: {
					label: "Russia's pivot to the east traded 28,900 men for just 11,000 sq km in new territory",
					//title: "Annotation title"
				},
				x: margin.left + 60,
				y: margin.top + height - 80 ,
				dy: -1,
				dx: 0
			}

		]
	}
	
	if (stepData == 5) {
		annotations = [
			{
				note: {
					label: "The counter-offensive negated nearly all Russian gains over the last 5 months",
					//title: "Annotation title"
				},
				x: margin.left + 40,
				y: margin.top + height - 120 ,
				dy: -60,
				dx: 30
			},
			{
				note: {
					label: "Few casualties, as Russians chose to run rather than fight",
					//title: "Annotation title"
				},
				x: margin.left + 40,
				y: margin.top + height - 90 ,
				dy: 0,
				dx: 30
			}

		]
	}
	
	if (stepData == 6) {
		annotations = [
			{
				note: {
					label: "The winter offensive decimated Russian forces, for a net loss of territory",
					//title: "Annotation title"
				},
				x: margin.left + 125,
				y: margin.top + height - 215,
				dy: -1,
				dx: -1
			}

		]
	}
	
	if (stepData == 7) {
		annotations = [
			{
				note: {
					label: "Russian casualties continue to skyrocket, while Ukraine attempts to break through",
				},
				x: margin.left - 20,
				y: margin.top + height - 330 ,
				dy: 0,
				dx: 0
			}

		]
	}
	

	const makeAnnotations = d3.annotation()
		.annotations(annotations)

	svg
		.append("g")
		.style("opacity", 0)
		.attr("class", "annotation")
		.call(makeAnnotations)
		.transition().duration(1000).style("opacity", 1);
}

function analyze(data, stepData){
	
	if(stepData < prevStep){
		clear();
	}
	
	loadAnnotations(stepData);
	
	if (stepData > 6) {
		d3.select("#downarrow").style("opacity", 0);
	}
	else {
		d3.select("#downarrow").style("opacity", 1);
	}
	
	if(stepData > 0) {
		
		filteredData = data.filter(function(d,i){ return i < stepData});
		
		var x = d3.scaleTime()
				.domain(d3.extent(data, function(d) { return d.date; }))
				.range([ 15, width - 15 ]);
				
		// Add left Y axis
		var yLeft = d3.scaleLinear()
			.domain( [90000, 170000])
			.range([ height, 0 ]);
			
		// Add right Y axis
		var yRight = d3.scaleLinear()
			.domain( [0, 220000])
			.range([ height, 0 ]);

		if(axesCreated == 0) {
			
			svg.append("g")
				.attr("class", "axis")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %Y")))
				.selectAll("text")  
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-65)");

			svg.append("g")
				.attr("class", "axis")
				.call(d3.axisLeft(yLeft));
			  
			svg.append("g")
				.attr("class", "axis")
				.style("stroke", "red")
				.attr("transform", "translate(" + width + ",0)")
				.call(d3.axisRight(yRight));
			
			// Left Y Axis Label
			svg.append("text")
			.attr("class", "axis")
			.attr("text-anchor", "end")
			.attr("y", -70)
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
			.style("font-size", "0.75em")
			.text("Russian Controlled Territory (Sq Km)");
			
			// Left Y Axis Label
			svg.append("text")
			.attr("class", "axis")
			.attr("text-anchor", "end")
			.attr("y", width+55)
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
			.style("font-size", "0.75em")
			.text("Cumulative Russian Casualties (Killed and Wounded)");
			
			svg.append("text")
			.attr("class", "axis")
			.attr("text-anchor", "end")
			.attr("x", width)
			.attr("y", height + 70)
			.text("** Mouse over points to view details **");
				
			axesCreated = 1;
		}	
		
		// Three function that change the tooltip when user hover / move / leave a cell
		var mouseover = function(d) {
			Tooltip.style("opacity", 1);
		}

		var mousemoveSqKm = function(d) {
			Tooltip
			.style("border-color", "black")
			.html("Date: " + d.date.toISOString().split('T')[0] + "<br />Russian Controlled Territory in Sq Km: " + Number(d.sqkm).toLocaleString("en-US"));
		}

		var mousemoveLosses = function(d) {
			Tooltip
			.style("border-color", "red")
			.html("Date: " + d.date.toISOString().split('T')[0] + "<br />Cumulative Russian Casualties: " + Number(d.personnel).toLocaleString("en-US"));
		}

		var mouseleave = function(d) {
			Tooltip.style("opacity", 0)
		}

		// Add the sqkm line
		newSqKmLine = svg.append("path")
		.datum(filteredData)
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("stroke-width", 1.5)
		.style("opacity", 0)
		.attr("d", d3.line()
		.x(function(d) { return x(d.date) })
		.y(function(d) { return yLeft(d.sqkm) })
		);
			
		// Add the personnel line
		newLossesLine = svg.append("path")
		  .datum(filteredData)
		  .attr("fill", "none")
		  .attr("stroke", "red")
		  .attr("stroke-width", 1.5)
		  .style("opacity", 0)
		  .attr("d", d3.line()
			.x(function(d) { return x(d.date) })
			.y(function(d) { return yRight(d.personnel) })
			);
			
		// Add the sqkm points
		newSqKmPoint = svg
		  .append("g")
		  .selectAll("dot")
		  .data(filteredData)
		  .enter()
		  .append("circle")
			.attr("class", "sqKmCircle")
			.attr("cx", function(d) { return x(d.date) } )
			.attr("cy", function(d) { return yLeft(d.sqkm) } )
			.attr("r", 8)
			.attr("stroke", "black")
			.attr("stroke-width", 3)
			.attr("fill", "white")
			.style("opacity", 0)
			.on("mouseover", mouseover)
			.on("mousemove", mousemoveSqKm)
			.on("mouseleave", mouseleave);
			
		// Add the personnel points
		newLossesPoint = svg
		  .append("g")
		  .selectAll("dot")
		  .data(filteredData)
		  .enter()
		  .append("circle")
			.attr("class", "lossesCircle")
			.attr("cx", function(d) { return x(d.date) } )
			.attr("cy", function(d) { return yRight(d.personnel) } )
			.attr("r", 8)
			.attr("stroke", "red")
			.attr("stroke-width", 3)
			.attr("fill", "white")
			.style("opacity", 0)
			.on("mouseover", mouseover)
			.on("mousemove", mousemoveLosses)
			.on("mouseleave", mouseleave);
				
		newLossesLine.transition().duration(1000).style("opacity", 1);
		newSqKmLine.transition().duration(1000).style("opacity", 1);
		newSqKmPoint.transition().duration(1000).style("opacity", 1);
		newLossesPoint.transition().duration(1000).style("opacity", 1);
	}
}


loadData();



//scrollama stuff

//// using d3 for convenience, and storing a selected elements
var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');

// initialize the scrollama
var scroller = scrollama();
var prevStep = 1;

// resize function to set dimensions on load and on page resize
function handleResize() { 

	// 1. update height of step elements for breathing room between steps
	var stepHeight = Math.floor(window.innerHeight * 0.75);
	step.style('height', stepHeight + 'px');

	// 2. update height of graphic element

	graphic.style('height', window.innerHeight + 'px');

	// make the height 1/2 of viewport
	var chartHeight = Math.floor(window.innerHeight / 2);

	chart.style('height', chartHeight + 'px');

	// 4. tell scrollama to update new element dimensions
	scroller.resize();
}

// scrollama event handlers

function handleStepEnter(response) {
	// response = { element, direction, index }
	// fade in current step
	step.classed('is-active', function (d, i) {
		return i === response.index;
	})

	// update graphic based on step here
	var stepData = parseFloat(response.element.getAttribute('data-step'));

	step.classed("is-active", function(d, i) {
          return i === response.index;
    });
	
	analyze(raw, stepData);
	prevStep = stepData;

}

// kick-off code to run once on load
function init() {
	// 1. call a resize on load to update width/height/position of elements
	handleResize();

	// 2. setup the scrollama instance
	// 3. bind scrollama event handlers (this can be chained like below)
	scroller
		.setup({
			step: '.scroll__text .step', // the step elements
			offset: 0.30, // set the trigger to be 1/2 way down screen
			debug: false, // display the trigger offset for testing
		})
		.onStepEnter(handleStepEnter)

	// setup resize event
	window.addEventListener('resize', handleResize);
}

$(document).ready(function() {
  
  $(window).scroll(function() {
    var scroll = $(window).scrollTop();
    if (scroll >= 1) {
      $('.arrow').addClass('fade');
    } else{
      $('.arrow').removeClass('fade');
    }
  })
});
