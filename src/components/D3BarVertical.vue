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
      default: "label"
    }
  },
  data() {
    return {
      width: 960,
      height: 450,
      svg: {},
      margin: {
        top: 15,
        right: 15,
        bottom: 15,
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
  created() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      self = this;

      this.svg = d3.select(self.$refs.svg);

      let g = this.svg
        .append("g")
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        );

      var xScale = d3
        .scaleLinear()
        .range([0, this.realW])
        .domain([
          0,
          d3.max(this.value, function(d) {
            return d[self.keyValue];
          })
        ]);

      var yScale = d3
        .scaleOrdinal()
        .rangeRoundBands([this.realH, 0], 0.1)
        .domain(
          this.value.map(function(d) {
            return d[self.keyLabel];
          })
        );

      var yAxis = d3.svg
        .axis()
        .scale(yScale)
        .tickSize(0)
        .orient("left");
      var gy = g
        .append("g")
        .attr("class", "y-axis")
        .call(yAxis);

      var bars = g
        .selectAll(".bar")
        .data(this.value)
        .enter()
        .append(g);

      bars
        .append("rect")
        .attr("class", "bar")
        .attr("y", function(d) {
          return yScale(d[self.keyLabel]);
        })
        .attr("height", yScale.rangeBand())
        .attr("x", 0)
        .attr("width", function(d) {
          return xScale(d[self.keyValue]);
        });

      bars
        .append("text")
        .attr("class", "label")
        .attr("y", function(d) {
          return yScale(d[self.keyLabel]) + 3;
        });

      /*bars.append('rect').attr('class','bar').attr("y",function(d) {
        return yScale(d[self.keyLabel]) + yScale.rangeBand() / 2 + 4
      }).attr('x', function(d) {
        return xScale(d[self.keyValue]) + 3;
      }).text(function(d) {
        return d[this.keyValue]
      });*/
    },
    updateCharts() {}
  }
};
</script>
