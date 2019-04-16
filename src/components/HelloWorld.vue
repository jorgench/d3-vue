<template>
  <div class="grid">
    <div class="grid-item">
      <div class="card">
        <h2 class="card-title">Donunt Chart</h2>

        <div class="chart-container">
          <d3-donut :value="parserData"/>
        </div>
        <div class="controls">
          <div v-for="item,key in paises" :key="key">
            <label for>{{item.name}}</label>
            <input type="checkbox" v-model="item.active">
            <input type="range" min="0" max="100" step="1" v-model="paises[key].value">
          </div>

          <hr>

          <button @click="addPaises">Añadir</button>
        </div>
      </div>
    </div>

    <div class="grid-item">
      <div class="card">
        <h2 class="card-title">Line Chart</h2>

        <div class="chart-container"></div>
      </div>
    </div>

    <div class="grid-item">
      <div class="card">
        <h2 class="card-title">Bar Horizontal Chart</h2>

        <div class="chart-container">
          <d3-bar-vertical :value="parserData" keyLabel="name" @select="select"/>
        </div>
      </div>
    </div>

    <div class="grid-item">
      <div class="card">
        <h2 class="card-title">Bar Vertical Chart</h2>

        <div class="chart-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import D3Donut from "./D3Donut.vue";
import D3Line from "./D3Line.vue";
import D3BarVertical from "./D3BarVertical.vue";
import * as d3 from "d3";

export default {
  name: "HelloWorld",
  components: {
    D3Donut,
    D3Line,
    D3BarVertical
  },
  props: {
    msg: String
  },
  data() {
    return {
      paises: [
        { name: "USA", value: 95, active: true },
        { name: "UK", value: 20, active: true },
        { name: "Canada", value: 30, active: true },
        { name: "Mexico", value: 10, active: true }
      ]
    };
  },
  computed: {
    parserData() {
      let d = this.paises.filter(i => {
        return i.active;
      });

      return d.map(i => {
        i.value = parseInt(i.value);
        return i;
      });
    }
  },
  methods: {
    addPaises() {
      let arrayPaises = ["Croacia", "Dinamarca", "Italia", "España", "Francia"];

      let val = Math.floor(Math.random() * (100 - 1)) + 1;
      let indexPaises = Math.floor(Math.random() * (5 - 0)) + 0;

      this.paises.push({
        name: arrayPaises[indexPaises],
        value: val,
        active: true
      });
    },
    select(d, i) {
      console.log("d: ", d, " : ", i);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  width: 100%;
  min-height: 100vh;
  gap: 1em;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0.5em 0.75em;
  box-shadow: 0 0 0.25em 0.25em rgba(0, 0, 0, 0.05);
}

.card > .card-title {
  margin: 0;
  font-size: 1.25rem;
  font-family: sans-serif;
}
</style>
