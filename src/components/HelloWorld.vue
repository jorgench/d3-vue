<template>
  <div class="grid">
    <div class="grid-item">
      <div class="card">
        <h2 class="card-title">Donunt Chart</h2>

        <div class="chart-container">
          <d3-donut :height="960" :thickness="90" keyColor="color" :value="parserData"/>
        </div>
        <div class="controls">
          <div v-for="item,key in paises" :key="key">
            <label for>{{item.name}} {{item.value}}</label>
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

        <div class="chart-container">
          <d3-line :dots="true" :text="true" :value="parserData" keyLabel="name" :rotateAxisX="20"></d3-line>
        </div>
      </div>
    </div>

    <div class="grid-item">
      <div class="card">
        <h2 class="card-title">Bar Horizontal Chart</h2>

        <div class="chart-container">
          <d3-bar-vertical :value="parserData" keyLabel="name" @select="select">
            <div slot="tooltip" slot-scope="tooltip">{{tooltip.data}}</div>
          </d3-bar-vertical>
        </div>
      </div>
    </div>

    <div class="grid-item">
      <div class="card">
        <h2 class="card-title">Bar Vertical Chart</h2>

        <div class="chart-container">
          <d3-bar-horizontal :value="parserData" keyLabel="name"></d3-bar-horizontal>
        </div>
      </div>
    </div>

    <div class="grid-item">
      <div class="card">
        <div class="card-title">Bar Vertical Chart Stack</div>
        <div class="chart-container">
          <d3-bar-horizontal-stack
            :value="parserData"
            keyLabel="name"
            :keysValue="['value','value2','value3']"
          ></d3-bar-horizontal-stack>
        </div>
      </div>
    </div>

    <div class="grid-item">
      <div class="card">
        <div class="card-container">
          <div class="controls">
            <div v-for="item,key in paises" :key="key">
              <label for>{{item.name}} {{item.value2}}</label>
              <input type="checkbox" v-model="item.active">
              <input type="range" min="0" max="100" step="1" v-model="paises[key].value2">
            </div>
          </div>
          <hr>
          <div class="controls">
            <div v-for="item,key in paises" :key="key">
              <label for>{{item.name}} {{item.value3}}</label>
              <input type="checkbox" v-model="item.active">
              <input type="range" min="0" max="100" step="1" v-model="paises[key].value3">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-item">
      <div class="card">
        <div class="card-container">
          <d3-bar-vertical-stack
            keyLabel="name"
            :keysValue="['value','value2','value3']"
            :value="parserData"
            :colors="['#3d5a80','#98c1d9','#e0fbfc']"
          ></d3-bar-vertical-stack>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import D3Donut from "./D3Donut.vue";
import D3Line from "./D3Line.vue";
import D3BarVertical from "./D3BarVertical.vue";
import D3BarHorizontal from "./D3BarHorizontal.vue";
import D3BarHorizontalStack from "./D3BarHorizontalStack.vue";
import D3BarVerticalStack from "./D3BarVerticalStack.vue";

export default {
  name: "HelloWorld",
  components: {
    D3Donut,
    D3Line,
    D3BarVertical,
    D3BarHorizontal,
    D3BarHorizontalStack,
    D3BarVerticalStack
  },
  props: {
    msg: String
  },
  data() {
    return {
      paises: [
        {
          name: "USA",
          value: 95,
          value2: 120,
          value3: 14,
          color: "#3d5a80",
          active: true
        },
        {
          name: "UK",
          value: 20,
          value2: 450,
          value3: 52,
          color: "#98c1d9",
          active: true
        },
        {
          name: "Canada",
          value: 30,
          value2: 142,
          value3: 68,
          color: "#e0fbfc",
          active: true
        },
        {
          name: "Mexico",
          value: 10,
          value2: 240,
          value3: 100,
          color: "#ee6c4d",
          active: true
        }
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
        i.value2 = parseInt(i.value2);
        i.value3 = parseInt(i.value3);
        return i;
      });
    }
  },
  methods: {
    addPaises() {
      let arrayPaises = ["Croacia", "Dinamarca", "Italia", "España", "Francia"];

      let val = Math.floor(Math.random() * (100 - 1)) + 1;
      let val2 = Math.floor(Math.random() * (120 - 1)) + 1;
      let val3 = Math.floor(Math.random() * (90 - 1)) + 1;
      let indexPaises = Math.floor(Math.random() * (5 - 0)) + 0;

      this.paises.push({
        name: arrayPaises[indexPaises],
        value: val,
        value2: val2,
        value3: val3,
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
