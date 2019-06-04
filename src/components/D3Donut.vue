<template>
  <div>
    <svg ref="svg" :viewBox="viewBox" preserveAspectRatio="xMidYMid meet">
      <g class="text-group" :transform="'translate(' + (width/2) + ',' + (height/2) + ')'">
        <text text-anchor="middle" :dy="width / 20" :font-size=" width / 5">{{totalValue}}</text>
        <text text-anchor="middle" :font-size="width / 15" :dy="width / 7.5">{{subtitle}}</text>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";
import globalMixin from "@/mixins/global";

export default {
  name: "D3Donut",
  mixins: [globalMixin],
  props: {
    keyValue: {
      type: String,
      default: "value"
    },
    keyColor: {
      type: String,
      default: ""
    },
    subtitle: {
      type: String,
      default: "contactos"
    },
    thickness: {
      type: Number,
      default: 40
    }
  },
  data() {
    return {
      paths: [],
      g: {}
    };
  },
  computed: {
    totalValue() {
      let total = 0;
      this.value.forEach(element => {
        total += element[this.keyValue];
      });
      return total;
    },
    radius() {
      return Math.min(this.width, this.height) / 2;
    }
  },
  methods: {
    pie(a) {
      return d3
        .pie()
        .value(d => {
          return d[this.keyValue];
        })
        .sort(null)(a);
    },
    arc(a) {
      let arc = d3
        .arc()
        .innerRadius((this.radius - this.thickness) * 0.8)
        .outerRadius(this.radius * 0.8);

      return arc(a);
    },
    outerArc(b) {
      let arc = d3.svg
        .arc()
        .innerRadius(this.radius * 0.9)
        .outerRadius(this.radius * 0.9);
      return arc(b);
    },
    drawChart() {
      let self = this;

      this.g = d3.select(self.$refs.svg);

      this.g
        .append("g")
        .attr(
          "transform",
          "translate(" + self.width / 2 + "," + self.height / 2 + ")"
        )
        .attr("class", "slices");

      this.g.append("g").attr("class", "lines");

      this.updateCharts();
      return;
    },
    updateCharts() {
      let self = this;

      /*  Pie Slides */
      let p = this.g
        .select(".slices")
        .selectAll("path")
        .data(self.pie(self.value));

      p.transition()
        .duration(1000)
        .attrTween("d", function(d) {
          let interpolate = d3.interpolate(this._current, d);
          var _this = this;
          return function(t) {
            _this._current = interpolate(t);
            return self.arc(_this._current);
          };
        });

      p.exit()
        .transition()
        .delay(1000)
        .duration(0)
        .remove();

      p.enter()
        .append("g")
        .append("path")
        .attr("d", this.arc)
        .attr("fill", (d, i) => {
          if (self.keyColor !== "") {
            return d.data[self.keyColor];
          }
          return self.probarCodigo(i);
        })
        .each(function(d, i) {
          this._current = i;
        });

      /* Pie Polylines */
    },
    probarCodigo(j) {
      return d3
        .scaleOrdinal(d3.schemeCategory10)
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])(j);
    }
  }
};
</script>
