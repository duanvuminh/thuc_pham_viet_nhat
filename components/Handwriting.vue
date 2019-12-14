<template>
  <div>
    <canvas id="can" :width="width" :height="height" style="cursor: crosshair"></canvas>
    <v-card class="d-flex flex-row mb-6" color="grey lighten-2" flat tile>
      <v-card outlined tile>
        <v-card-actions>
          <v-btn icon color="green" @click="undo">
            <v-icon>mdi-undo</v-icon>
          </v-btn>
          <v-btn icon color="green" @click="reset">
            <v-icon>mdi-autorenew</v-icon>
          </v-btn>
          <v-btn color="green">
            {{text}}
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-for="(kanji,i) in data" :key="i" class="pa-3" outlined tile @click="select(kanji)">{{kanji}}</v-card>
    </v-card>
  </div>
</template>
<script>
import handwriting from "@/module/handwriting";
export default {
  data() {
    return {
      canvas: {},
      width: 400,
      height: 250,
      data: []
    };
  },
  computed: {
    text(){
      return this.canvas.text
    }
  },
  methods: {
    undo() {
      this.canvas.undo();
    },
    reset() {
      //Clear canvas, captured trace, and stored steps
      this.canvas.erase();
    },
    select(kanji){
      this.$emit('handwriting', kanji)
    }
  },
  mounted() {
    this.width = window.innerWidth > 0 ? window.innerWidth : screen.width;
    this.canvas = new handwriting.Canvas(document.getElementById("can"));
    this.canvas.setCallBack((data, err) => {
      if (err) throw err;
      else this.data = data;
    });
    this.canvas.setLineWidth(5);
    //Set options
    this.canvas.setOptions({
      language: "ja",
      numOfReturn: 10
    });
    //only turn on undo functionality
    this.canvas.set_Undo_Redo(true, false);
  }
};
</script>