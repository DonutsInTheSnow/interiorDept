const projectName = 'bar-fun';

var width = 800,
  height = 400,
  barWidth = width / 11;

var tooltip = d3
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var overlay = d3
  .select('.visHolder')
  .append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);

var svgContainer = d3
  .select('.visHolder')
  .append('svg')
  .attr('width', width + 100)
  .attr('height', height + 60);

d3.json(
  'https://gist.githubusercontent.com/DonutsInTheSnow/20a4d9c97459b576b6d238ae1aa7ff9c/raw/7302de9802cab951bb65e26b544956741844921d/doi.json'
)
  .then(data => {
    svgContainer
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -200)
      .attr('y', 80)
      .text('Employees');

    svgContainer
      .append('text')
      .attr('x', width / 2)
      .attr('y', height + 50)
      .text('Cabinet level agencies')
      .attr('class', 'info');

    var agencies = data.agencies.agency;

    let empNums = [];
    agencies.forEach(function(agency) {
        agency.employment = parseInt(agency.employment);
        empNums.push(agency.employment);
    });


    let abbr = agencies.map(function(agency) {
      return agency.abbr;
    });


    // Create xScale using scaleBand for agency subelements
    var xScale = d3.scaleBand()
      .domain(data.agencies.agency.map(function(agency) { return agency.abbr; }))
      .range([0, width]);

    // Create yScale using scaleLinear for employment
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(data.agencies.agency, function(agency) { return agency.employment; })])
      .range([height, 0]);

    // Append x-axis
    svgContainer.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale))
      .attr('id', 'x-axis')
      .attr('transform', 'translate(60, 400)');

    // Append y-axis
    svgContainer.append('g')
      .call(d3.axisLeft(yScale))
      .attr('id', 'y-axis')
      .attr('transform', 'translate(60, 0)');

    // Draw bars
    svgContainer.selectAll('.bar')
      .data(data.agencies.agency)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', function(agency) { return xScale(agency.abbr); })
      .attr('y', function(agency) { return yScale(agency.employment); })
      .attr('width', barWidth)
      .attr('height', function(agency) { return height - yScale(agency.employment); })
      .attr('index', (d, i) => i)
      .style('fill', '#546733')
      .attr('transform', 'translate(60, 0)')
      .on('mouseover', function (event, d) {
        var i = this.getAttribute('index');
        overlay
          .transition()
          .duration(0)
          .style('height', d + 'px')
          .style('width', barWidth + 'px')
          .style('opacity', 0.9)
          .style('left', i * barWidth + 0 + 'px')
          .style('top', height - d + 'px')
          .style('transform', 'translateX(60px)');
        tooltip.transition().duration(200).style('opacity', 0.9);
        tooltip
          .html(
            abbr[i] +
              '<br>' +
              empNums[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          )
          .attr('abbr', abbr[i])
          .style('left', i * barWidth + 30 + 'px')
          .style('top', height - 100 + 'px')
          .style('transform', 'translateX(60px)');
      })
      .on('mouseout', function () {
        tooltip.transition().duration(200).style('opacity', 0);
        overlay.transition().duration(200).style('opacity', 0);
      });
  })
  .catch(e => console.log(e));


    
   
