const svg = d3.select("svg");

// viewbox for responsiveness
svg.attr("viewBox", "0 0 1000 600");

// add a group
const worldGroup = svg.append("g");

// mapping the earth
const projection = d3.geoNaturalEarth1().translate([500, 300]).scale(190);

// geoPath
const mapGenerator = d3.geoPath().projection(projection);

// color scale
const colorScale = d3
  .scaleSequentialPow(d3.interpolateInferno)
  .domain([2500, 0])
  .exponent(0.25);

// scroll scale
const scrollScale = d3
  .scaleLinear()
  .domain([0, 5000, 10000, 15000, 20000])
  .range([0, 20, 100, 300, 2500])
  .clamp(true);

// load population data file
d3.json("data.json").then(function (populationData) {
  // load map data file
  d3.json("world-110m2.json").then(function (mapData) {
    worldGroup
      .selectAll("path")
      .data(mapData.features)
      .enter()
      .append("path")
      // add each country using mapGenerator
      .attr("d", mapGenerator)
      .style("fill", (d, i) => {
        const country = populationData.find((country) => {
          // console.log(country.name === d.properties.name);
          return country.name === d.properties.name;
        });

        // console.log(country);
        // d is from mapData
        if (country) {
          return colorScale(country.density);
        } else {
          return "#111111";
        }
      });

    // listen to scroll event
    window.addEventListener("scroll", function () {
      // how far down the page scrolled
      const pixelsDown = window.scrollY;
      // slows down scroll by x times
      // const threshold = pixelsDown / 50;
      const threshold = scrollScale(pixelsDown);
      const format = d3.format(".1f");

      // select .counter then change text to # pixels down
      d3.select("span.counter").text(format(threshold));

      worldGroup.selectAll("path").style("fill", (d, i) => {
        const country = populationData.find((country) => {
          return country.name === d.properties.name;
        });

        // if country truthy AND country density is > # pixels down
        if (country && country.density > threshold) {
          return colorScale(country.density);
        } else {
          return "#111111";
        }
      });
    });
  });

  // svg
  //   .selectAll("rect")
  //   .data(data)
  //   .enter()
  //   .append("rect")
  //   .attr("x", 0)
  //   .attr("y", (d, i) => {
  //     return i * 30;
  //   })
  //   .attr("width", (d, i) => {
  //     return d.density;
  //   })
  //   .attr("height", 24)
  //   .style("fill", "red");
});
