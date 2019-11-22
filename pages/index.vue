<template>
  <v-row>
    <v-col cols="12" style="position:relative">
      <v-textarea
        ref="textarea1"
        solo
        name="input-10-4"
        label="type somethings"
        v-model="text"
        @keydown="openDg"
        hide-details
        @blur="blurCheck"
      ></v-textarea>
      <v-col cols="12">
        <v-card max-width="250">
          <v-img
            src="https://lh3.googleusercontent.com/SjIqtAFVZqAddDtevUlG6jjiDlumvgDPakI6Hxf08diFWN-N0TyFHl2pbawi6Pszn82I34aZjuU=w128-h128-e365"
            class="lighten-2 pink--text"
            height="200px"
            contain
          >
            <v-card-title>Google-cloud-input</v-card-title>
          </v-img>

          <v-card-text class="text--primary">
            <div>{{ $t('pr')}}</div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="orange"
              text
              href="https://chrome.google.com/webstore/detail/google-input-tools/mclkkofklkfljcocdinagocijmpgbhab"
            >{{ $t('dowloadpage')}}</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-card style="position:absolute;min-width:100px" tile v-show="show" ref="sugest">
        <v-list dense>
          <div class="pa-2">
            {{textshow}}
            <span :class="tongle?'white--text':'grey--text'">|</span>
          </div>
          <v-list-item-group v-model="item" color="primary">
            <v-list-item v-for="(me, i) in items" :key="i" @click="setText">
              <v-list-item-content>
                <v-list-item-title v-text="me"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import * as wanakana from "wanakana";
var getCaretCoordinates = require("textarea-caret");

export default {
  data() {
    return {
      text: "",
      focus: false,
      // component
      //textshow:"",
      textreal: "",
      tongle: false,
      item: null,
      items: [],
      show: false,
      caret: {},
      //Last key
      lastKey: "xxxx"
    };
  },
  mounted() {
    console.log(this.$refs);
    // var input = document.getElementById("ime");
    // wanakana.bind(input);
    setInterval(() => {
      this.tongle = !this.tongle;
    }, 500);
    let me = this;
    document.querySelector("textarea").addEventListener("keydown", function() {
      this.caret = getCaretCoordinates(this, this.selectionEnd);
      me.$nextTick(() => {
        me.$refs.sugest.$el.style.top =
          this.caret.top - -me.$refs.textarea1.$el.offsetTop - -50 + "px";
        me.$refs.sugest.$el.style.left =
          this.caret.left - -me.$refs.textarea1.$el.offsetLeft - -30 + "px";
      });
    });
  },
  methods: {
    blurCheck() {
      setTimeout(() => {
        this.show = false;
        this.textreal = "";
      }, 200);
    },
    setText() {
      this.$nextTick(() => {
        let startPos = this.$refs.textarea1.$el.getElementsByTagName(
          "textarea"
        )[0].selectionStart;
        let endPos = this.$refs.textarea1.$el.getElementsByTagName(
          "textarea"
        )[0].selectionEnd;
        let cursorPos = startPos;
        let tmpStr = this.text;
        let tmpShow = this.textshow;
        // insert:
        this.text =
          tmpStr.substring(0, startPos) +
          tmpShow +
          tmpStr.substring(endPos, tmpStr.length);
        this.$nextTick(() => {
          this.$refs.textarea1.$el.getElementsByTagName(
            "textarea"
          )[0].selectionEnd = endPos + tmpShow.length;
        });
        //this.text += this.textshow;
        this.item = null;
        this.textreal = "";
        this.show = false;
      });
    },
    openDg(e) {
      console.log(this.lastKey);
      console.log(e.key);
      var specialKeys = [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "Shift",
        "Tab",
        "Control",
        "Meta",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Delete",
        "Backspace",
        "Enter",
        " "
      ];
      if (this.show) {
        event.preventDefault();
        if (e.key == "Backspace") {
          this.item = null;
          console.log(this.textreal);
          this.textreal =
            this.textreal.length > 1
              ? this.textreal.substr(0, this.textreal.length - 1)
              : "";
        }
        if (
          e.key == " " ||
          e.key == "ArrowLeft" ||
          e.key == "ArrowRight" ||
          e.key == "ArrowUp" ||
          e.key == "ArrowDown"
        ) {
          if (!this.item && this.item != 0) {
            this.item = 0;
          } else {
            this.item += 1;
            this.item %= this.items.length;
          }
        }
        if (e.key == "Enter") {
          let startPos = this.$refs.textarea1.$el.getElementsByTagName(
            "textarea"
          )[0].selectionStart;
          let endPos = this.$refs.textarea1.$el.getElementsByTagName(
            "textarea"
          )[0].selectionEnd;
          let cursorPos = startPos;
          let tmpStr = this.text;
          let tmpShow = this.textshow;
          // insert:
          this.text =
            tmpStr.substring(0, startPos) +
            tmpShow +
            tmpStr.substring(endPos, tmpStr.length);
          this.$nextTick(() => {
            this.$refs.textarea1.$el.getElementsByTagName(
              "textarea"
            )[0].selectionEnd = endPos + tmpShow.length;
          });
          //this.text += this.textshow;
          this.item = null;
          this.textreal = "";
          this.show = false;
        }
      }
      if (specialKeys.indexOf(e.key) === -1) {
        if (
          (this.lastKey == "Meta" ||
            this.lastKey == "Control") &&
          (e.key == "a" ||
            e.key == "x" ||
            e.key == "A" ||
            e.key == "X" ||
            e.key == "v" ||
            e.key == "V" ||
            e.key == "c" ||
            e.key == "C")
        ) {
          this.lastKey = e.key;
        } else {
          this.lastKey = e.key;
          event.preventDefault();
          this.textreal += e.key;
          this.show = true;
        }
      } else {
        this.lastKey = e.key;
      }
    }
  },
  computed: {
    textshow() {
      if (this.item || this.item == 0) {
        return this.items[this.item];
      }
      let convertText = wanakana.toHiragana(this.textreal);
      this.$axios
        .$get(
          `https://www.google.com/transliterate?langpair=ja-Hira|ja&text=${convertText}`
        )
        .then(r => {
          console.log(r);
          this.items = [
            ...r[0][1],
            wanakana.toKatakana(this.textreal),
            this.textreal,
            this.textreal.toUpperCase(),
            this.textreal.toLowerCase()
          ];
          this.items = [...new Set(this.items)];
        });
      return convertText;
    }
  },
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
    // }
  }
};
</script>
