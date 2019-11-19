<template>
  <v-row class="ma-5">
    <h1 class="pr-5">{{ $t('welcome') }}</h1>
    <v-spacer />
    <nuxt-link :to="switchLocalePath('vi')">Tiếng Việt</nuxt-link>|
    <nuxt-link :to="switchLocalePath('ja')">日本語</nuxt-link>
    <v-col cols="12">
      <v-textarea
        solo
        name="input-10-4"
        label="type somethings"
        v-model="text"
        @keydown="openDg"
        hide-details
      ></v-textarea>
    </v-col>
    <v-card style="width:100px">
      <input
        id="ime"
        ref="duan"
        class="ma-1"
        v-model="text1"
        style="max-width:90%"
        @keydown="checkSubmit"
      />
      <select :size="items.length" style="width:100%" v-model="text2">
        <option
          v-for="(item,index) in items"
          :value="item"
          :key="index"
          :selected="index==0"
        >{{item}}</option>
      </select>
    </v-card>
  </v-row>
</template>
<script>
import * as wanakana from "wanakana";

export default {
  data() {
    return {
      items: [],
      show: false,
      text: "",
      text1: "",
      text2: "",
      focus: false,
      style: {
        position: "fixed",
        top: "0px",
        left: "0px"
      }
    };
  },
  mounted() {
    var input = document.getElementById("ime");
    wanakana.bind(input);
  },
  methods: {
    openDg(e) {
      var specialKeys = [37, 38, 39, 40, 8, 13, 27, 46];
      if (specialKeys.indexOf(e.keyCode) === -1) {
        console.log(String.fromCharCode(e.keyCode) + " Key is validated!");
        if (String.fromCharCode(e.keyCode).match(/[A-Za-z0-9,]/)) {
          event.preventDefault();
          this.text1 = String.fromCharCode(e.keyCode);
          this.show = true;
          this.$refs.duan.focus();
        }
      }
    },
    checkSubmit(e) {
      if (e.keyCode === 13) {
        this.text += this.text1;
        this.text1 = "";
        this.items = [];
      } else {
        if (e.keyCode === 32) {
           this.text1= document.getElementById("ime").value;;
          if (this.$i18n.locale == "vi") {
            this.$axios
              .$get(
                `http://www.google.com/transliterate?langpair=en|vi&text=${this.text1}`
              )
              .then(r => console.log(r));
          } else {
            this.$axios
              .$get(
                `http://www.google.com/transliterate?langpair=ja-Hira|ja&text=${this.text1}`
              )
              .then(r => {
                console.log(r);
                this.items = r[0][1];
              });
          }
        }else{
           if (e.keyCode === 37||e.keyCode === 38||e.keyCode === 39||e.keyCode === 40) {

           }
        }
      }
    }
  },
  computed: {},
  watch: {
    // text1(val) {
    //   this.text1 = wanakana.toKana(val);
    //   if (this.$i18n.locale == "vi") {
    //     this.$axios
    //       .$get(
    //         `http://www.google.com/transliterate?langpair=en|vi&text=${this.text1}`
    //       )
    //       .then(r => console.log(r));
    //   } else {
    //     this.$axios
    //       .$get(
    //         `http://www.google.com/transliterate?langpair=ja-Hira|ja&text=${this.text1}`
    //       )
    //       .then(r => {
    //         console.log(r);
    //         this.items = r[0][1];
    //       });
    //   }
    // },
    text2() {
      this.text += this.text2;
      this.text1 = "";
      this.items = [];
    }
  }
};
</script>
