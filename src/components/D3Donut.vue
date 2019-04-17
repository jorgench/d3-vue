<template>
  <div>
    <svg ref="svg" :viewBox="viewBox" preserveAspectRatio="xMidYMid meet">
      <g class="text-group" :transform="'translate(' + (width/2) + ',' + (height/2) + ')'">
        <text
          text-anchor="middle"
          :dy="width / 20"
          :style="'font-size: ' + width / 10 + 'px'"
        >{{totalValue}}</text>
        <text text-anchor="middle" :dy="width / 10">{{subtitle}}</text>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "D3Donut",
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
    subtitle: {
      type: String,
      default: "contactos"
    }
  },
  data() {
    return {
      width: 960,
      height: 450,
      radius: 0,
      thickness: 40,
      paths: [],
      g: {}
    };
  },
  created() {
    console.log("Se recreo el componente");

    this.radius = Math.min(this.width, this.height) / 2;
  },
  mounted() {
    this.drawChart();
  },
  computed: {
    totalValue() {
      let total = 0;
      this.value.forEach(element => {
        total += element[this.keyValue];
      });
      return total;
    },
    viewBox() {
      return "0 0 " + this.width + " " + this.height;
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
      console.log("llamada a outerArc: ", arc);
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
      var self = this;

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
