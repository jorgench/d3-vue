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
    value: {
      type: Array,
      default() {
        return [];
      }
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
      let self = this;

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

      this.updateCharts();
    },
    updateCharts() {
      let self = this;

      self.maxValue = d3.max(this.value, function(d) {
        let a = 0;
        a += d3.sum(self.keysValue, k => +d[k]);
        return a;
      });

      this.y.domain([0, self.maxValue]);

      let xDominios = this.value.map(function(d, i) {
        let temp = d[self.keyLabel] ? d[self.keyLabel] : i;
        return temp;
      });

      this.x.domain(xDominios);

      this.g
        .select(".x.axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(this.x));

      this.g
        .select(".y.axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(this.y));

      if (this.barsBackground) {
        let backgroundBars = d3
          .select(this.$refs.svg)
          .select("g.global")
          .selectAll("rect.bar-background")
          .data(self.value);

        backgroundBars.exit().remove();

        let background_bars = backgroundBars
          .enter()
          .append("g")
          .append("rect")
          .attr("class", "bar-background")
          .attr("height", 0)
          .attr("width", self.x.bandwidth(), 40)
          .attr("x", function(d) {
            return self.x(d[self.keyLabel]);
          });

        backgroundBars
          .merge(background_bars)
          .attr("y", function() {
            if (this.getAttribute("y")) {
              return this.getAttribute("y");
            } else {
              return self.realH - self.y(self.maxValue);
            }
          })
          .attr("height", function() {
            if (this.getAttribute("height")) {
              return this.getAttribute("height");
            }
            return self.realH - self.y(self.maxValue);
          })
          .attr("x", function(d) {
            if (this.getAttribute("x")) {
              return this.getAttribute("x");
            }
            return self.x(d[self.keyLabel]);
          })
          .transition()
          .duration(1000)
          .ease(d3.easePolyOut)
          .attr("height", function() {
            return self.realH - self.y(self.maxValue);
          })
          .attr("width", function() {
            return self.x(self.maxValue);
          })
          .attr("class", "bar-background")
          .attr("x", function(d) {
            return self.x(d[self.keyLabel]);
          })
          .attr("y", function() {
            return self.y(self.maxValue);
          })
          .attr("width", self.x.bandwidth())
          .attr("fill", self.fill)
          .style("opacity", "0.2");
      }

      let staked = d3.stack().keys(self.keysValue)(self.value);

      /* group */
      let groups = this.g.selectAll("g.layer").data(staked, function(d, i) {
        return d.key;
      });

      groups.exit().remove();

      let colors = ["#e71d36", "#eac435", "#2ab7ca", "#e4572e", "#042a2b"];

      groups
        .enter()
        .append("g")
        .classed("layer", true)
        .attr("fill", function(d) {
          return colors[arguments[1]];
        })
        .attr(
          "transform",
          "translate(" + self.margin.left + "," + self.margin.top + ")"
        );

      /* barras */
      let bars = this.g
        .selectAll("g.layer")
        .selectAll("rect")
        .data(
          function(d, i, j) {
            return d;
          },
          function(e) {
            return e.data[self.keyLabel];
          }
        );

      bars.exit().remove();

      bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars)
        .attr("height", function() {
          if (this.getAttribute("height")) {
            return this.getAttribute("height");
          }
          return 0;
        })
        .attr("width", self.x.bandwidth())
        .attr("x", function(d, i) {
          if (this.getAttribute("x")) {
            return this.getAttribute("x");
          }
          return self.x(xDominios[i]);
        })
        .attr("y", function(d, i) {
          if (this.getAttribute("y")) {
            return this.getAttribute("y");
          } else {
            return self.realH - self.y(self.maxValue);
          }
        })
        .transition()
        .duration(1000)
        .attr("x", function(d, i) {
          return self.x(xDominios[i]);
        })
        .attr("y", function(d) {
          return self.y(d[1]);
          //return 0;
        })
        .attr("width", self.x.bandwidth())
        .attr("height", function(d) {
          return self.y(d[0]) - self.y(d[1]);
        });

      this.g.selectAll("rect.bar").on("click", function(d, i) {
        self.$emit("select", d, i);
      });
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
