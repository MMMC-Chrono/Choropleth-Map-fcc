const educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

d3.queue()
  .defer(d3.json, educationURL)
  .defer(d3.json, countyURL)
  .await(collectedData)

function collectedData(error, education, county) {
    if (error) { return error};
    const main = d3.select('body')
                   .append('div')
                   .attr('id', 'main')
    const title = main.append('h1')
                      .attr('id', 'title')
                      .text('United States Educational Attainment')
    const description = main.append('div')
                            .attr('id', 'description')
                            .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)")

    const tooltip = d3.select('body')
                      .append('div')
                      .attr('id', 'tooltip')
                      .style('top', 0)
                      .style('left', 0)
                      .style('opacity', 0)

    const w = 960;
    const h = 600;
    const p = 30;
    const svg = main.append('svg')
                    .attr('width', w)
                    .attr('height', h)
                    .style('background', 'whitesmoke')
    const colorLtoH = ['#ffe6e6', '#ffb3b3', '#ff8080', '#ff4d4d', '#ff1a1a', '#e60000', '#b30000', '#800000'];
    const counties = svg.append('g')
                        .selectAll('path')
                        .data(topojson.feature(county, county.objects.counties).features)
                        .enter()
                        .append('path')
                        .attr('class', 'county')
                        .attr('d', d3.geoPath())
                        .data(education)
                        .attr('fill', (education)=> {
                          const e = education.bachelorsOrHigher
                          return e > 2 && e <= 12 ? colorLtoH[0] :
                          e > 12 && e <= 21 ? colorLtoH[1] :
                          e > 21 && e <= 30 ? colorLtoH[2] :
                          e > 30 && e <= 39 ? colorLtoH[3] : 
                          e > 39 && e <= 48 ? colorLtoH[4] : 
                          e > 48 && e <= 57 ? colorLtoH[5] : 
                          e > 57 && e <= 66 ? colorLtoH[6] : colorLtoH[7]
                        })
                        .attr('data-fips', (education) => education.fips)
                        .attr('data-education', (education) => education.bachelorsOrHigher)
                        .on('mouseover', (education) => {
                          tooltip.style('opacity', 1)
                                 .style('top', (d3.event.pageY + 20) +'px')
                                 .style('left', (d3.event.pageX + 20) + 'px')
                                 .html(education.area_name + ', ' + education.state + '<br/>' + education.bachelorsOrHigher + '%')
                          document.querySelector('#tooltip').setAttribute('data-education', education.bachelorsOrHigher)
                        })
                        .on('mouseout', (education) => {
                          tooltip.style('opacity', 0)
                        })

    const minMax = d3.extent(education.map(e=>e.bachelorsOrHigher/100));
    const xScaleL = d3.scaleLinear()
                      .domain(minMax)
                      .range([600, 850])

    function increment(scale) {
      let arr = [];
      for (let i = scale[0]; i <= scale[1] + 0.091; i += 0.091) {
        arr.push(i)
      }
      return arr;
    }

    const xAxisL = d3.axisBottom(xScaleL)
                     .tickValues(increment(minMax))
                     .tickFormat(d3.format(".0%"))
    svg.append('g')
       .attr('transform', 'translate(0,50)')
       .call(xAxisL)
    
    const minMaxL = increment(minMax)
    minMaxL.shift()

    const legend = svg.append('g')
                      .attr('id', 'legend')
                      .selectAll('rect')
                      .data(minMaxL)
                      .enter()
                      .append('rect')
                      .attr('x', (minMaxL) => xScaleL(minMaxL)-31.5)
                      .attr('y', 35)
                      .attr('width', 32)
                      .attr('height', 15)
                      .attr('fill', (minMaxL, i) => colorLtoH[i])
                      

}