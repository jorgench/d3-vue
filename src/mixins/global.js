export default {
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    width: {
      type: Number,
      default: 960
    },
    height: {
      type: Number,
      default: 450
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
  watch: {
    value(oldValue, newValue) {
      if (oldValue != newValue) {
        this.updateCharts();
      }
    },
    width(oldValue, newValue) {
      if (oldValue != newValue) {
        this.drawChart();
      }
    },
    height(oldValue, newValue) {
      if (oldValue != newValue) {
        this.drawChart();
      }
    }
  }
};
