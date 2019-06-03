<template>
  <div ref="all">
    <div
      data-def="tooltip"
      style="pointer-events: none;position: absolute; transform: traslateY(-100%); max-width: 8rem;"
    >
      <slot name="tooltip" :data="dataSelected"></slot>
    </div>
    <svg ref="svg" :viewBox="viewBox" preserveAspectRatio="xMidYMid meet"></svg>
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
    margin: {
      type: Object,
      default() {
        return {
          top: 30,
          right: 15,
          bottom: 30,
          left: 130
        };
      }
    }
  },
  data() {
    return {
      g: {},
      dataSelected: {}
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
        );

      this.updateCharts();
    },
    updateCharts() {
      let self = this;

      self.maxValue = d3.max(this.value, function(d) {
        return d[self.keyValue];
      });

      let tooltip = d3.select(this.$refs.all).select("div[data-def='tooltip']");
      tooltip.style("opacity", 0);

      this.x.domain([0, self.maxValue]);

      this.y.domain(
        this.value.map(function(d) {
          return d[self.keyLabel] ? d[self.keyLabel] : "";
        })
      );

      let ticks = self.maxValue < 12 ? self.maxValue : 10;

      let xAxis = this.g.select(".x.axis").call(
        d3
          .axisBottom(this.x)
          .ticks(ticks)
          .tickFormat(function(d, i) {
            return d3.format(",.0f")(d, i);
          })
      );
      let yAxis = this.g
        .select(".y.axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(this.y))
        .selectAll("text")
        //.attr("transform", "translate(-10,30)rotate(45)")
        .attr("font-size", 20);

      /* barras */
      let bars = d3
        .select(this.$refs.svg)
        .select("g.global")
        .selectAll("rect.bar")
        .data(self.value);

      let texts = d3
        .select(this.$refs.svg)
        .select("g.global")
        .selectAll("text.field-text")
        .data(self.value);

      //remove
      bars.exit().remove();
      texts.exit().remove();

      //enter
      let r_enter = bars
        .enter()
        .append("g")
        .append("rect")
        .attr("class", "bar")
        .attr("height", self.y.bandwidth(), 40)
        .attr("width", 0)
        .attr("y", function(d) {
          return self.y(d[self.keyLabel]);
        })
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
        .on("mouseout", function() {
          tooltip
            .transition()
            .duration(500)
            .style("opacity", 0);
        });

      let t_enter = texts
        .enter()
        .append("text")
        .attr("class", "field-text")
        .attr(
          "transform",
          "translate(" + this.margin.right + "," + self.y.bandwidth() / 2 + ")"
        );

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
        .attr("fill", this.fill);

      texts
        .merge(t_enter)
        .transition()
        .duration(1000)
        .attr("class", "field-text")
        .attr("y", function(d) {
          return self.y(d[self.keyLabel]);
        })
        .attr(
          "transform",
          "translate(" +
            this.margin.right +
            "," +
            (self.y.bandwidth() / 2 + 10) +
            ")"
        )
        .attr("font-size", "24")
        .text(function(d) {
          return d[self.keyValue];
        });

      /* interactividad */
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
