<template>
  <div>
    <svg ref="svg" :viewBox="viewBox" perserveAspectRatio="xMidYMid meet"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import globalMixin from "@/mixins/global";

export default {
  name: "D3BarVerticalStack",
  mixins: [globalMixin],
  props: {
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
    fill: {
      type: String,
      default: "#0E73CA"
    },
    colors: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      g: {}
    };
  },
  methods: {
    drawChart() {
      let self = this;

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
        )
        .style("font-size", 24);

      this.g
        .append("g")
        .attr("class", "y axis")
        .attr(
          "transform",
          "translate(" + this.margin.left + ", " + this.margin.top + ")"
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

      this.x.domain([0, self.maxValue]);

      let yDominios = this.value.map(function(d, i) {
        let temp = d[self.keyLabel] ? d[self.keyLabel] : i;
        return temp;
      });

      this.y.domain(yDominios);

      let ticks = self.maxValue < 12 ? self.maxValue : 10;

      this.g.select(".x.axis").call(
        d3
          .axisBottom(this.x)
          .ticks(ticks)
          .tickFormat(function(d, i) {
            return d3.format(",.0f")(d, i);
          })
      );

      this.g
        .select(".y.axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(this.y))
        .selectAll("text")
        .attr("font-size", 20);

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
          if (self.colors.length > 0) {
            return self.colors[arguments[1]];
          }

          return colors[arguments[1]];
        })
        .attr(
          "transform",
          "translate(" + self.margin.left + "," + this.margin.right + ")"
        );

      /* Bars */
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
        .attr("width", function() {
          if (this.getAttribute("width")) {
            return this.getAttribute("width");
          }
          return 0;
        })
        .transition()
        .duration(1000)
        .attr("y", function(d, i) {
          return self.y(yDominios[i]);
        })
        .attr("x", function(d) {
          return self.x(d[0]);
        })
        .attr("height", self.y.bandwidth())
        .attr("width", function(d) {
          return (self.x(d[0]) - self.x(d[1])) * -1;
        });
      /*-------*/

      /* Text */
      let texts = this.g
        .selectAll("g.layer")
        .selectAll("text.field-text")
        .data(
          function(d, i, j) {
            return d;
          },
          function(e) {
            console.log("E: ", e);
            return e.data[self.keyLabel];
          }
        );

      texts.exit().remove();
      let serie = 0;
      let key = 0;

      texts
        .enter()
        .append("text")
        .attr("class", "field-text")
        .merge(texts)
        .transition()
        .duration(1000)
        .attr("y", function(d, i) {
          return self.y(yDominios[i]);
        })
        .attr("x", function(d) {
          return self.x(d[0]);
        })
        .attr(
          "transform",
          "translate(" +
            this.margin.right +
            "," +
            (self.y.bandwidth() / 2 + 10) +
            ")"
        )
        .attr("fill", "#000")
        .text(function(d, i) {
          if (serie < self.value.length) {
            serie += 1;
            return self.value[serie - 1][self.keysValue[key]];
          } else {
            serie = 1;
            key += 1;
            let temp = self.value[serie - 1][self.keysValue[key]];
            return temp;
          }
        });
    }
  }
};
</script>

