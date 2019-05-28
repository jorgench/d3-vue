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
      self = this;

      this.g = d3.select(self.$refs.svg);

      this.x = d3
        .scaleBand()
        .rangeRound([0, self.realW])
        .padding(0.1);

      this.y = d3.scaleLinear().range([self.realH, 0]);

      this.g
        .append("g")
        .attr("class", "global")
        .attr(
          "transform",
          "translate(" + self.margin.left + "," + self.margin.top + ")"
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
        )
        .style("font-size", 24);

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

      this.updateCharts();
    },
    updateCharts() {
      self = this;

      this.x.domain(
        this.value.map(function(d) {
          return d[self.keyLabel] ? d[self.keyLabel] : !"";
        })
      );

      this.y.domain([
        0,
        d3.max(this.value, function(d) {
          return d[self.keyValue];
        })
      ]);

      let xAxis = this.g
        .select(".x.axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(this.x));
      let yAxis = this.g
        .select(".y.axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(this.y));

      let line = d3
        .line()
        .x(function(d, i) {
          let returnX = self.x(d[self.keyLabel]);
          return returnX + self.x.bandwidth() / 2;
        })
        .y(function(d, i) {
          let returnY = self.y(d[self.keyValue]);
          return returnY;
        });

      this.g
        .select("path.line")
        .datum(self.value)
        .transition()
        .duration(1000)
        .attr("d", line);
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
