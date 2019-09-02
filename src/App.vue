<template>
  <div id="app">
    <BarGraph :dataArr="arrData" :xAxisTitle="xTitle" :yAxisTitle="yTitle" :key="componentKey" />
  </div>
</template>

<script>
import BarGraph from "./components/BarGraph.vue";

export default {
  name: "app",
  components: {
    BarGraph
  },
  data() {
    var arrData = [
      "2011:221:rgb(73,160,216)",
      "2012:288:rgb(211,83,160)",
      "2013:450:rgb(255,197,39)",
      "2014:550:rgb(223,76,39)",
      "2015:670:rgb(228,49,78)",
      "2016:950:rgb(201,231,221)",
      "2017:550:rgb(35,71,67)",
      "2018:900:rgb(255,255,5)"
    ];

    var xTitle = "Years";
    var yTitle = "Tourists to India in millions";

    return {
      arrData,
      componentKey: 0,
      xTitle,
      yTitle
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  methods: {
    handleResize() {
      this.componentKey += 1;
    }
  }
};
</script>

<style>
html,
.app {
  height: 100%;
}

body {
  background-image: linear-gradient(#282448, #585375);
  padding-top: 60px;
  /* padding-bottom: 60px; */
  justify-content: center;
  text-align: center;
  vertical-align: middle;
  background-color: #ffffff;
}
</style>
