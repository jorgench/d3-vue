<template>
  <div>
    <svg ref="svg" :viewBox="viewBox" perserveAspectRatio="xMidYMid meet"></svg>
    <div class="d3container"></div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "D3BarHorizontalStack",
  props: {
    value: Array,
    default() {
      return [];
    },
    keysValue: {
      type: Array,
      default() {
        return [];
      }
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
    },
    fill: {
      type: String,
      default: "#0E73CA"
    },
    barsBackground: {
      type: Boolean,
      default: true
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
      var self = this;

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
        )
        .selectAll("rect.bar");

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
    }
  }
};
</script>
