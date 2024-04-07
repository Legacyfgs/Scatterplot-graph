fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(response => response.json())
    .then(data => {
        const svg = d3.select("#scatterplot");
        const margin = {top: 20, right: 20, bottom: 30, left: 50};
        const width = +svg.attr("width") - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;

        const x = d3.scaleTime().range([0, width]);
        const y = d3.scaleTime().range([height, 0]);

        const g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, d => new Date(d.Year, 0)));
        y.domain(d3.extent(data, d => new Date(0, 0, 0, 0, d.Time.split(':')[0], d.Time.split(':')[1])));

        g.append("g")
            .attr("id", "x-axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

        g.append("g")
            .attr("id", "y-axis")
            .call(d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S")));

        g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", 6)
            .attr("cx", d => x(new Date(d.Year, 0)))
            .attr("cy", d => y(new Date(0, 0, 0, 0, d.Time.split(':')[0], d.Time.split(':')[1])))
            .attr("data-xvalue", d => d.Year)
            .attr("data-yvalue", d => new Date(0, 0, 0, 0, d.Time.split(':')[0], d.Time.split(':')[1]))
            .on("mouseover", function(event, d) {
                d3.select("#tooltip")
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px")
                    .style("display", "block")
                    .attr("data-year", d.Year)
                    .html("Year: " + d.Year + "<br>Time: " + d.Time);
            })
            .on("mouseout", function() {
                d3.select("#tooltip").style("display", "none");
            });
    });