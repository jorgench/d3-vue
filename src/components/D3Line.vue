<template>
  <div>
    <svg ref="svg" :viewBox="viewBox"></svg>
  </div>
</template>
<script>
import * as d3 from "d3";
import globalMixin from "../mixins/global";

export default {
  name: "D3Line",
  mixins: [globalMixin],
  props: {
    keyValue: {
      type: String,
      default: "value"
    },
    keyLabel: {
      type: String,
      default: "label"
    },
    dots: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    },
    rotateAxisX: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      g: {}
    };
  },
  methods: {
    drawChart() {
      let this2 = this;

      this.g = d3.select(this2.$refs.svg);

      this.x = d3
        .scaleBand()
        .rangeRound([0, this2.realW])
        .padding(0.1);

      this.y = d3.scaleLinear().range([this2.realH, 0]);

      this.g
        .append("g")
        .attr("class", "global")
        .attr(
          "transform",
          "translate(" + this2.margin.left + "," + this2.margin.top + ")"
        );

      this.g
        .append("g")
        .attr("class", "x axis")
        .attr(
          "transform",
          "translate(" +
            this.margin.left +
            "," +
            (this.height - this.margin.bottom) +
            ")"
        );

      this.g
        .append("g")
        .attr("class", "y axis")
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .style("font-size", 24);

      this.g
        .select("g.global")
        .append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5);

      if (this.dots) {
        this.g
          .append("g")
          .attr("class", "dots")
          .attr(
            "transform",
            "translate(" + this2.margin.left + "," + this2.margin.top + ")"
          );
      }
      if (this.text) {
        this.g
          .append("g")
          .attr("class", "leyeds")
          .attr(
            "transform",
            "translate(" + this2.margin.left + "," + this2.margin.top + ")"
          );
      }

      this.updateCharts();
    },
    updateCharts() {
      let this2 = this;

      this.x.domain(
        this.value.map(function(d) {
          return d[this2.keyLabel] ? d[this2.keyLabel] : !"";
        })
      );

      this.y.domain([
        0,
        d3.max(this.value, function(d) {
          return d[this2.keyValue];
        }) + 10
      ]);

      let xAxis = this.g
        .select(".x.axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(this.x))
        .selectAll("text")
        .attr("font-size", 20);

      if (this.rotateAxisX > 0) {
        xAxis
          .style("text-anchor", "end")
          .attr("dx", "-10")
          .attr("dy", "2")
          .attr("transform", "rotate(" + this.rotateAxisX * -1 + ")");
      }

      let yAxis = this.g
        .select(".y.axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(this.y))
        .selectAll("text")
        .attr("font-size", 15);

      let line = d3
        .line()
        .x(function(d, i) {
          let returnX = this2.x(d[this2.keyLabel]);
          return returnX + this2.x.bandwidth() / 2;
        })
        .y(function(d, i) {
          let returnY = this2.y(d[this2.keyValue]);
          return returnY;
        });

      this.g
        .select("path.line")
        .datum(this2.value)
        .transition()
        .duration(1000)
        .attr("d", line);

      if (this.dots) {
        let dots = this.g
          .select("g.dots")
          .selectAll(".dot")
          .data(this.value);

        dots.exit().remove();

        let d_enter = dots
          .enter()
          .append("circle")
          .attr("class", "dot");

        dots
          .merge(d_enter)
          .attr("r", function() {
            if (this.getAttribute("r")) {
              return this.getAttribute("r");
            } else {
              return 0;
            }
          })
          .attr("cx", function(d) {
            if (this.getAttribute("cx")) {
              return this.getAttribute("cx");
            } else {
              return this2.x(d[this2.keyLabel]) + this2.x.bandwidth() / 2;
            }
          })
          .attr("cy", function(d) {
            if (this.getAttribute("cy")) {
              return this.getAttribute("cy");
            } else {
              return this2.y(d[this2.keyValue]);
            }
          })
          .transition()
          .duration(1000)
          .attr("r", 5)
          .attr("cx", function(d, i) {
            return this2.x(d[this2.keyLabel]) + this2.x.bandwidth() / 2;
          })
          .attr("cy", function(d, i) {
            return this2.y(d[this2.keyValue]);
          });
      }

      if (this.text) {
        let texts = this.g
          .select("g.leyeds")
          .selectAll("text")
          .data(this.value);

        texts.exit().remove();

        let t_enter = texts.enter().append("text");

        texts
          .merge(t_enter)
          .style("opacity", "0")
          .attr("font-size", 30)
          .attr("x", function(d) {
            if (this.getAttribute("x")) {
              return this.getAttribute("x");
            } else {
              return this2.x(d[this2.keyLabel]) + this2.x.bandwidth() / 2;
            }
          })
          .attr("y", function(d) {
            if (this.getAttribute("y")) {
              return this.getAttribute("y");
            } else {
              return this2.y(d[this2.keyValue]) - 10;
            }
          })
          .transition()
          .duration(1000)
          .style("opacity", "1")
          .text(function(d) {
            return d[this2.keyValue];
          })
          .attr("x", function(d) {
            return this2.x(d[this2.keyLabel]) + this2.x.bandwidth() / 2;
          })
          .attr("y", function(d) {
            return this2.y(d[this2.keyValue]) - 10;
          });
      }
    }
  }
};
</script>
