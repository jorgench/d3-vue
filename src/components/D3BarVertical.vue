<template>
  <div>
    <svg ref="svg" :viewBox="viewBox"></svg>
  </div>
</template>
<script>
import * as d3 from "d3";

export default {
  name: "D3BarVertical",
  props: {
    value: Array,
    default() {
      return [];
    },
    keyValue: {
      type: String,
      default: "value"
    },
    keyLabel: {
      type: String,
      default: "name"
    }
  },
  data() {
    return {
      width: 960,
      height: 450,
      g: {},
      margin: {
        top: 30,
        right: 15,
        bottom: 30,
        left: 60
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

      this.y = d3
        .scaleBand()
        .rangeRound([self.realH, 0])
        .padding(0.1);

      this.x = d3.scaleLinear().range([0, self.realW]);

      this.g
        .append("g")
        .attr("class", "global")
        .attr(
          "transform",
          "translate(" + self.margin.left + "," + self.margin.top + ")"
        )
        .selectAll("rect.bar");

      this.g
        .append("g")
        .attr("class", "x axis")
        .attr(
          "transform",
          "translate(" +
            this.margin.left +
            ", " +
            (this.height - this.margin.bottom) +
            ")"
        );

      this.g
        .append("g")
        .attr("class", "y axis")
        .attr(
          "transform",
          "translate(" + this.margin.left + ", " + this.margin.top + ")"
        );

      this.updateCharts();
    },
    updateCharts() {
      self = this;

      this.x.domain([
        0,
        d3.max(this.value, function(d) {
          return d[self.keyValue];
        })
      ]);

      this.y.domain(
        this.value.map(function(d) {
          return d[self.keyLabel] ? d[self.keyLabel] : "";
        })
      );

      let xAxis = this.g.select(".x.axis").call(d3.axisBottom(this.x));
      let yAxis = this.g
        .select(".y.axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(this.y));

      /* barras */
      let bars = d3
        .select("g.global")
        .selectAll("rect.bar")
        .data(self.value);

      //remove
      bars.exit().remove();

      //enter
      let r_enter = bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("height", self.y.bandwidth())
        .attr("width", 0)
        .attr("y", function(d) {
          return self.y(d[self.keyLabel]);
        });

      //enter + update
      bars
        .merge(r_enter)
        .transition()
        .duration(1000)
        .attr("width", function(d) {
          return self.x(d[self.keyValue]);
        })
        .attr("class", "bar")
        .attr("y", function(d) {
          return self.y(d[self.keyLabel]);
        })
        .attr("height", self.y.bandwidth())
        .attr("fill", "steelblue");
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
