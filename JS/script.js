function createChart(){
  // Basic Set-up
  var width = 900;
  var height = 600;
  var gravity = 0.2;
  var charge = -120;
  var flagHeight = 12;
  var flagWidth = 18;
  var dataUrl = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";
  var flagImg = "../Images/flags.png";

  // Container and SVG Setup
  var container = d3.select('#chart');

  var svg = container.append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

  var tooltip = d3.select('#tooltip')
    .classed("tooltip", true)


  // Force Directed Chart
  var forceChart = d3.json(dataUrl, function(error, data) {
    if (error) throw error;
    var nodes = data.nodes;
    var links = data.links;

    var force = d3.layout.force()
      .nodes(nodes)
      .links(links)
      .gravity(gravity)
      .charge(charge)
      .size([width, height]);


    // Lines between the nodes - append to SVG
    var link = svg.selectAll('line')
        .data(links)
      .enter().append('line')
        .classed('link', true)

    // Create nodes for the flag images and tooltip code
    // Note: must append to container also holding the SVG, DO NOT append to the SVG element - sprite sheet CSS won't work in that case
    var node = container.select('.flagHTML').selectAll('img')
        .data(nodes)
      .enter().append('img')
        .attr('class', function(d){ return 'flag flag-'+ d.code;})
        .call(force.drag)
        .on("mouseover", function(d) {
          var country = d.country;
          var dataPoint = "<div class='text-center'>"+ country +"</div>";
          tooltip.transition()
            .style('opacity', .9)
          tooltip.html(dataPoint)
            .style("left", (d3.event.pageX + 5) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
        })
        .on("mouseout", function(d) {
          tooltip.transition()
            .style("opacity", 0);
        });

    force.on('tick', function(e) {
      node
        .style('left', function(d){return (d.x - flagWidth/2) + 'px';})
        .style('top', function(d) {return (d.y - flagHeight/2) + 'px';})

      link.attr('x1', function(d) {return d.source.x;})
        .attr('y1', function(d) {return d.source.y;})
        .attr('x2', function(d) {return d.target.x;})
        .attr('y2', function(d) {return d.target.y;})
    })

    force.start();
  });
}

createChart();
