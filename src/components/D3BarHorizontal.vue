<template>
  <div ref="all">
    <div
      data-def="tooltip"
      style="pointer-events: none;position: absolute; transform: traslateY(-100%); max-width: 8rem;"
    >
      <slot name="tooltip" data="dataSelected"></slot>
    </div>
    <svg ref="svg" :viewBox="viewBox" perserveAspectRatio="xMidYMid meet"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import globalMixin from "../mixins/global";

export default {
  name: "D3BarHorizontal",
  mixins: [globalMixin],
  props: {
    keyValue: {
      type: [String, Array],
      default: "value"
    },
    keyLabel: {
      type: String,
      default: "label"
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
      dataSelected: {}
    };
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
        )
        .style("font-size", 24);

      this.updateCharts();
    },
    updateCharts() {
      let self = this;

      self.maxValue = d3.max(this.value, function(d) {
        return d[self.keyValue];
      });

      let tooltip = d3.select(this.$refs.all).select("div[data-def='tooltip']");
      tooltip.style("opacity", 0);

      this.y.domain([0, self.maxValue]);

      this.x.domain(
        this.value.map(function(d) {
          return d[self.keyLabel] ? d[self.keyLabel] : "";
        })
      );

      this.g
        .select(".x.axis")
        .transition()
        .duration(1000)
        .call(d3.axisBottom(this.x))
        .selectAll("text")
        .attr("font-size", 20);

      let ticks = self.maxValue < 12 ? self.maxValue : 10;

      this.g
        .select(".y.axis")
        .transition()
        .duration(1000)
        .call(
          d3
            .axisLeft(this.y)
            .ticks(ticks)
            .tickFormat(function(d, i) {
              return d3.format(",.0f")(d, i);
            })
        );

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

      /* barras */
      let bars = d3
        .select(this.$refs.svg)
        .select("g.global")
        .on("mouseover", function(d) {
          let coord = self.$refs.all.getBoundingClientRect();

          let staticY = window.scrollY + coord.top;
          let staticX = window.scrollX + coord.left;

          tooltip
            .transition()
            .duration(200)
            .style("opacity", "1")
            .style("top", d3.event.pageY - staticY + "px")
            .style("left", d3.event.pageX - staticX + "px");

          self.dataSelected = d;
        })
        .on("mousemove", function() {
          let coord = self.$refs.all.getBoundingClientRect();

          let staticY = window.scrollY + coord.top;
          let staticX = window.scrollX + coord.left;

          tooltip
            .style("top", d3.event.pageY - staticY + "px")
            .style("left", d3.event.pageX - staticX + "px");
        })
        .on("mouseout", function(d) {
          tooltip
            .transition()
            .duration(500)
            .style("opacity", 0);
        })
        .selectAll("rect.bar")
        .data(self.value);

      //remove
      bars.exit().remove();

      //enter
      let r_enter = bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("height", 0)
        .attr("width", self.x.bandwidth(), 40)
        .attr("x", function(d) {
          return self.x(d[self.keyLabel]);
        });

      //enter + update
      bars
        .merge(r_enter)
        .attr("height", function() {
          if (this.getAttribute("height")) {
            return this.getAttribute("height");
          } else {
            return 0;
          }
        })
        .attr("y", function(d, i) {
          if (this.getAttribute("y")) {
            return this.getAttribute("y");
          } else {
            return self.realH - self.y(self.maxValue);
          }
        })
        .attr("x", function(d) {
          if (this.getAttribute("x")) {
            return this.getAttribute("x");
          }
          return self.x(d[self.keyLabel]);
        })
        .attr("width", self.x.bandwidth())
        .transition()
        .duration(1000)
        .attr("height", function(d) {
          return self.realH - self.y(d[self.keyValue]);
        })
        .attr("class", "bar")
        .attr("y", function(d) {
          return self.y(d[self.keyValue]);
        })
        .attr("x", function(d) {
          return self.x(d[self.keyLabel]);
        })
        .attr("fill", this.fill);

      this.g.selectAll("rect.bar").on("click", function(d, i) {
        self.$emit("select", d, i);
      });
    }
  }
};
</script>
