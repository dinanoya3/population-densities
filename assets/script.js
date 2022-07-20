const svg = d3.select("svg");

// viewbox for responsiveness
svg.attr("viewBox", "0 0 1000 600");

d3.json("data.json").then(function (data) {
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", (d, i) => {
      return i * 30;
    })
    .attr("width", (d, i) => {
      return d.density;
    })
    .attr("height", 24)
    .style("fill", "red");
});
