const educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

d3.queue()
  .defer(d3.json, educationURL)
  .defer(d3.json, countyURL)
  .await(collectedData)

function collectedData(error, education, county) {
    if (error) { return error};
    console.log(education, county)
    const main = d3.select('body')
                   .append('div')
                   .attr('id', 'main')
    const title = main.append('h1')
                      .attr('id', 'title')
                      .text('United States Educational Attainment')
    const description = main.append('div')
                            .attr('id', 'description')
                            .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)")

    const w = 960;
    const h = 600;
    const p = 30;
    const svg = main.append('svg')
                    .attr('width', w)
                    .attr('height', h)
                    .style('background', 'whitesmoke')
        
    const counties = svg.append('g')
                        .selectAll('path')
                        .data(topojson.feature(county, county.objects.counties).features)
                        .enter()
                        .append('path')
                        .attr('class', 'county')
                        .attr('d', d3.geoPath())

    const minMax = d3.extent(education.map(e=>e.bachelorsOrHigher/100));
    const xScaleL = d3.scaleLinear()
                      .domain(minMax)
                      .range([600, 800])

    function increment(scale) {
      let arr = [];
      console.log(scale)
      for (let i = scale[0]; i <= scale[1]+0.091; i+=0.091) {
        arr.push(i)
      }
      return arr;
    }

    const xAxisL = d3.axisBottom(xScaleL)
                     .tickValues(increment(minMax))
                     .tickFormat(d3.format(".0%"))
    svg.append('g')
       .attr('id', 'x-axis')
       .attr('transform', 'translate(0,50)')
       .call(xAxisL)

    const legend = svg.append('g')
                      .attr('id', 'legend')

}