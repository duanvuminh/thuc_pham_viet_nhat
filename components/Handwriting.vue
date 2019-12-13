<template>
  <canvas id="can" width="400" height="400" style="cursor: crosshair;" @mouseup="submit"></canvas>
</template>
<script>
import handwriting from "@/module/handwriting";
export default {
  data() {
    return {
      canvas: {}
    };
  },
  computed: {},
  methods: {
    submit() {
      //recognize captured trace
      this.canvas.recognize();
    }
  },
  mounted() {
    this.canvas = new handwriting.Canvas(document.getElementById("can"));
    this.canvas.setCallBack((data, err) => {
      if (err) throw err;
      else console.log(data);
    });
    this.canvas.setLineWidth(5);
    //Set options
    this.canvas.setOptions({
      language: "ja",
      numOfReturn: 5
    });
  }
};
</script>