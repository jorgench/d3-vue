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
    }
  },
  data() {
    return {
      height: 450,
      width: 960,
      padding: 5
    };
  },
  computed: {
    viewBox() {
      return "0 0 " + this.width + " " + this.height;
    },
    countValue() {
      return this.value.length;
    }
  },
  created() {},
  mounted() {
    var xScale = d3
      .scaleLinear()
      .domain([0, this.countValue - 1])
      .range([0, this.width - this.padding * 2]);

    var yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([0, this.height - this.padding * 2]);

    var line = d3
      .line()
      .x(function(d, i) {
        return xScale(i);
      })
      .y(function(d, i) {
        return yScale(d.y);
      })
      .curve(d3.curveMonotoneX);

    let svg = d3.select(this.$refs.svg);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr(
        "transform",
        "translate(0," + (this.height - this.padding * 5) + ")"
      )
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", "translate(" + this.padding * 5 + ",0)")
      .call(d3.axisLeft(yScale));

    svg
      .append("path")
      .datum(this.value)
      .attr("class", "line")
      .attr("d", line);

    svg
      .selectAll(".dot")
      .data(this.value)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", function(d, i) {
        return xScale(i);
      })
      .attr("cy", function(d) {
        return yScale(d.y);
      })
      .attr("r", 5);
  }
};
</script>
