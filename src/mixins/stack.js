export default {
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
    colors: {
      type: Array,
      default() {
        return [];
      }
    }
  }
};
