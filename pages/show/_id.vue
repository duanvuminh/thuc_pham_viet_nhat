<template>
  <v-row justify="center">
    <Search :text="searchkey" />
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <v-tabs
            v-model="tab"
            background-color="deep-purple accent-4"
            class="elevation-0"
            dark
            show-arrows
            ref="tabs"
          >
            <v-tabs-slider></v-tabs-slider>

            <v-tab v-for="(item,index) in tabs" :key="index" :href="`#tab-${index}`" @click="tabclick(`tab-${index}`)">{{item.label}}</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab" touchless>
            <v-tab-item v-for="(item,index) in tabs" :key="index" :value="'tab-' + index">
              <v-card flat tile>
                <v-card-text class="pa-2">
                  <template v-if="index==0">
                    <Strockes :kanji="$route.params.id" />
                    <v-textarea
                      :outlined="!readonly"
                      :solo="readonly"
                      :flat="readonly"
                      label="Thêm cách nhớ của bạn"
                      auto-grow
                      v-model="commentvi"
                      rows="1"
                      :loading="loading"
                      :readonly="readonly"
                      :placeholder="placeholder"
                      @focus="show = true"
                      hide-details
                    />
                    <v-row v-if="show1">
                      <v-spacer />
                      <v-btn class="ma-2" color="success" @click="save" small text>Lưu</v-btn>
                      <v-btn
                        class="ma-2"
                        color="success"
                        @click="saveandshare"
                        small
                        text
                      >Lưu&chia sẻ</v-btn>
                      <v-btn class="ma-2" text @click="show=false" small>Huỷ</v-btn>
                    </v-row>
                    <HtmlParser
                      v-show="show1"
                      class="elevation-1 pa-2 mb-3"
                      v-if="commentvi!=''"
                      :content="$md.render(commentvi)"
                    ></HtmlParser>
                    <v-row>
                      <v-col cols="12" v-for="(oboe,i) in items" :key="i">
                        <Ocard :item="oboe" :searchkey="searchkey" :email="email"></Ocard>
                      </v-col>
                    </v-row>
                  </template>
                  <div v-else v-html="$md.render(item.text)"></div>
                  <div v-if="item.webo" v-html="item.webo"></div>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
//import HtmlParser from "@/components/HtmlParser";
const HtmlParser = () => import("@/components/HtmlParser");
//import Strockes from "@/components/Strockes";
const Strockes = () => import("@/components/Strockes");
//import Ocard from "@/components/Oboecard";
const Ocard = () => import("@/components/Oboecard");
//import Search from "@/components/nihongo/Search";
const Search = () => import("@/components/nihongo/Search");

export default {
  async asyncData({ params, store, $axios }) {
    let email = store.state.user.email ? store.state.user.email : "undefined";
    let items = await $axios
      .$get("/api/get_post_by_id", {
        params: {
          id: params.id
        }
      })
      .then();
    let searchkey = params.id;
    let webo = await $axios
      .get(`/api/dic?id=${encodeURIComponent(searchkey)}`)
      .then(r => {
        return r.data.html;
      });
  　 // webo = webo.includes(encodeURIComponent(searchkey)) ? webo : "";
    let tab = searchkey.length > 1 ? "tab-1" : null;
    let tabs=[]
    let fireObj={}
    if(tab=="tab-1"){
    await $axios
        .$post("https://mazii.net/api/search", {
          dict: "javi",
          type: "word",
          query: searchkey,
          limit: 20,
          page: 1
        })
        .then(response => {
          if (!response.found) {
            if (!webo) return;
            tabs[1].webo= this.webo
          } else {
            fireObj.isavaiable = true;
            fireObj.mean = response.data[0];
            // console.log(response);
            let strmean = "";
            response.data[0].means.map(x => {
              strmean = `${strmean}
* ${x.mean}(${x.kind ? x.kind : "-"})            
            `;
            });
            tabs[1].webo= webo
            tabs[1].text= `## ${response.data[0].word} 
### ${response.data[0].phonetic}
${strmean}         
            `
          }
        });
    }
    return {
      searchkey,
      email,
      fireObj,
      items,
      tab,
      tabs,
      webo,
      
    };
  },
  beforeCreate() {},
  components: {
    Ocard,
    Search,
    HtmlParser,
    Strockes
  },
  computed: {
    readonly() {
      return !this.$store.state.loggedIn;
    },
    placeholder() {
      return this.$store.state.loggedIn ? "" : "Đăng nhập để chỉnh sửa";
    },
    show1() {
      if (!this.$store.state.loggedIn) {
        return false;
      } else {
        return this.show;
      }
    }
    // avartar() {
    //   return this.user.email ? this.user.email[0] : "^.^";
    // }
  },
  data() {
    return {
      basecomment: "",
      commentvi: "",
      color: "",
      email: "",
      items: [],
      loading: false,
      loading1: false,
      show: false,
      searchkey: "",
      tab: null,
      tabs: [
      {
       webo:"",
       text: "",
       label: "Oboe"
      },
      {
       webo:"",
       text: "",
       label: "Nghĩa"
      },
      {
       webo:"",
       text: "",
       label: "Kanji"
      },
      {
       webo:"",
       text: "",
       label: "Mẫu"
      }
      ],
      valid: true,
      fireObj: {}
    };
  },
  head() {
    return {
      titleTemplate: `%s - cách nhớ ${this.searchkey}`
    };
  },
  layout: "oboe",
  methods: {
    async saveandshare() {
      this.loading = true;
      let items = await this.$axios.$post("/api/post1", null, {
        params: {
          searchkey: this.searchkey,
          vi: this.commentvi
        }
      });
      this.loading = false;
    },
    async save() {
      this.loading = true;
      let items = await this.$axios.$post("/api/post", null, {
        params: {
          searchkey: this.searchkey,
          vi: this.commentvi
        }
      });
      this.loading = false;
    },
    insertMtoF() {
      //insert mazzi to firestore
      if (!this.fireObj.isavaiable) return;
      firebase
        .firestore()
        .collection("opendic")
        .doc(this.searchkey.toLowerCase())
        .set(this.fireObj, { merge: true });
    },
    getKanji() {
      //kanji
      return this.$axios
        .$post("https://mazii.net/api/search", {
          dict: "javi",
          type: "kanji",
          query: this.searchkey,
          page: 1
        })
        .then(response => {
          //console.log(response);
          if (!response.results) return;
          this.fireObj.isavaiable = true;
          this.fireObj.kanji = response.results;
          let strG = "";
          response.results.map(x => {
            let str = "";
            x.compDetail
              ? x.compDetail.map(x => {
                  str = `${str} ${x.w}: ${x.h}`;
                })
              : "";
            strG = `${strG}
## ${x.kanji}
KunYomi: ${x.kun ? x.kun : ""}        
OnYomi: ${x.on ? x.on : ""} 
Bộ: ${x.mean}  
Bộ con: ${str}  
${x.detail.replace(/##/g, "")}        
            `;
          });
          this.tabs[2].text= strG
        });
    },
    getExample() {
      // ví dụ
      return this.$axios
        .$post("https://mazii.net/api/search", {
          dict: "javi",
          type: "word",
          query: this.searchkey,
          page: 1
        })
        .then(response => {
          //console.log(response);
          if (!response.found) return;
          this.fireObj.isavaiable = true;
          this.fireObj.example = response.data;
          // ví dụ
          let str = "";
          response.data.map(x => {
            str = `${str}
* ${x.word.replace(/````/g, "")}[${x.phonetic}]
${x.means[0].mean.replace(/````/g, "")}
            `;
          });
          this.tabs[3].text= `
${str}
            `
        });
    },
    getMean() {
      // nghĩa
      return this.$axios
        .$post("https://mazii.net/api/search", {
          dict: "javi",
          type: "word",
          query: this.searchkey,
          limit: 20,
          page: 1
        })
        .then(response => {
          if (!response.found) {
            if (!this.webo) return;
            this.tabs[1].webo= this.webo
          } else {
            this.fireObj.isavaiable = true;
            this.fireObj.mean = response.data[0];
            // console.log(response);
            let strmean = "";
            response.data[0].means.map(x => {
              strmean = `${strmean}
* ${x.mean}(${x.kind ? x.kind : "-"})            
            `;
            });
            this.tabs[1].webo= this.webo
            this.tabs[1].text= `## ${response.data[0].word} 
### ${response.data[0].phonetic}
${strmean}         
            `
          }
        });
    },
    tabclick(val){
       if (val == "tab-1") {
         this.getMean().then(()=>{this.insertMtoF()});
       }
       if (val == "tab-2") {
         this.getKanji().then(()=>{this.insertMtoF()});
       }
       if (val == "tab-3") {
         this.getExample().then(()=>{this.insertMtoF()});
       }
    }
  },
  mounted() {
    console.log(this.webo)
    // console.log("im here");
    firebase
      .firestore()
      .collection("kanji")
      .doc(this.searchkey)
      .collection("oboe")
      .doc(this.email)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.commentvi = doc.data().vi;
        }
      });
    // init tab
    // hiển thị nghĩa
    // hiển thị ví dụ
    // hiển thị ngữ pháp
    // this.tabs = [];
    //this.tabs[0] = {
    // webo:"",
    //  text: "",
    //  label: "Oboe"
    //};
    //this.tabs[1] = {
    //  webo:"",
    //  text: "",
    //  label: "Nghĩa"
    //};
    //this.tabs[2] = {
    //  webo:"",
    //  text: "",
    //  label: "Kanji"
    //};
    //this.tabs[3] = {
    //  webo:"",
    //  text: "",
    //  label: "Mẫu"
    //};
    //this.getMean()
    //Promise.all([this.getMean(), this.getKanji(), this.getExample()]).then(
    //  () => {
    //    this.insertMtoF();
    //    this.tab = this.searchkey.length > 1 ? "tab-1" : null;
    //    console.log(this.tabs)
    //  }
    //);
    if(this.tab=="tab-1"){
      this.insertMtoF()
    }
  },
  watch: {
    tab(val) {
       
     }
  }
};
</script>
