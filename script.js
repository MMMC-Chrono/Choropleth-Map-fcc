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
                            .text("Percentage of adults age 25 and older with a bachelor's degree or higher                         (2010-2014)")

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

}