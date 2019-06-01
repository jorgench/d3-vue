<template>
  <div>
    <svg ref="svg" :viewBox="viewBox"></svg>
  </div>
</template>
<script>
import * as d3 from "d3";

export default {
  name: "D3Line",
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    keyValue: {
      type: String,
      default: "value"
    },
    keyLabel: {
      type: String,
      default: "label"
    },
    width: {
      type: Number,
      default: 960
    },
    height: {
      type: Number,
      default: 450
    }
  },
  data() {
    return {
      g: {},
      margin: {
        top: 30,
        right: 15,
        bottom: 30,
        left: 130
      }
    };
  },
  computed: {
    viewBox() {
      return "0 0 " + this.width + " " + this.height;
    },
    realW() {
      return this.width - this.margin.left - this.margin.right;
    },
    realH() {
      return this.height - this.margin.top - this.margin.bottom;
    }
  },
  mounted() {
    this.drawChart();
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

      this.g
        .select("g.dots")
        .attr("class", "dots")
        .attr(
          "transform",
          "translate(" + this.margin.left + ", " + this.margin.top + ")"
        );

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
        })
      ]);

      let xAxis = this.g
        .select(".x.axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(this.x))
        .selectAll("text")
        .attr("font-size", 20);
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

      this.g
        .select("g.dots")
        .selectAll(".dot")
        .data(this.value)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", function(d, i) {
          return this2.x(i);
        })
        .attr("cy", function(d) {
          return this2.x(d.y);
        })
        .attr("r", 5);
    }
  },
  watch: {
    value(oldValue, newValue) {
      if (oldValue != newValue) {
        this.updateCharts();
      }
    }
  }
};
</script>
