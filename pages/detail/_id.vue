<template>
  <v-row align="center" justify="center">
    <v-col class="flex-sm-grow-0 flex-grow-1">
      <v-carousel v-if="card.image_url1" height="250">
        <v-carousel-item
          v-for="(item,i) in arrayImage"
          :key="i"
          :src="item"
          reverse-transition="fade-transition"
          transition="fade-transition"
        ></v-carousel-item>
      </v-carousel>

      <v-list class="mb-5 mt-5">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Tên</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action style="max-width:80%">
            <v-list-item-action-text v-text="card.name"></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Ngày viết</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action style="max-width:80%">
            <v-list-item-action-text v-text="iso8601Time(card.date_edit)"></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>By</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action style="max-width:80%">
            <v-list-item-action-text v-text="card.creator_id"></v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <div v-html="$md.render(card.description)"></div>
      <v-textarea label="Comment" auto-grow :rows="1" @keypress="addComment" v-model="comment">
        <template slot="prepend">
          <v-avatar color="teal" size="48">
            <span class="white--text headline">48</span>
          </v-avatar>
        </template>
      </v-textarea>
      <template v-for="(item,i) in comments">
        <v-row :key="i" class="pb-5">
          <v-col cols="12" class="pb-0">
            <div class="d-flex flex-no-wrap">
              <v-avatar color="teal" class="ma-3" size="48">
                <span class="white--text headline">{{item.userId}}</span>
              </v-avatar>
              <div>
                <div>
                  <span>
                    <b>{{item.userName}}</b>
                  </span>
                  <small>{{item.editDate}}</small>
                </div>
                <div>{{item.text}}</div>
              </div>
            </div>
          </v-col>
          <v-col class="d-flex flex-no-wrap pt-0">
            <v-btn text>Reply</v-btn>
            <v-btn text icon>
              <v-icon>mdi-thumb-up</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="11" offset="1">
            <template v-for="(item1,i) in item.commentSub">
              <v-row :key="i" class="pb-1">
                <v-col cols="12" class="pb-0">
                  <div class="d-flex flex-no-wrap">
                    <v-avatar color="teal" class="ma-3" size="48">
                      <span class="white--text headline">{{item1.userId}}</span>
                    </v-avatar>
                    <div>
                      <div>
                        <span>
                          <b>{{item1.userName}}</b>
                        </span>
                        <small>{{item1.editDate}}</small>
                      </div>
                      <div>{{item1.text}}</div>
                    </div>
                  </div>
                </v-col>
                <v-col class="d-flex flex-no-wrap pt-0">
                  <v-btn text>Reply</v-btn>
                  <v-btn text icon>
                    <v-icon>mdi-thumb-up</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
          </v-col>
        </v-row>
      </template>
    </v-col>
  </v-row>
</template>
<script>
import firebase from "firebase";
export default {
  async asyncData({ params }) {
    let pieces = params.id.split("-");
    let id = pieces[pieces.length - 1];
    let item = firebase
      .app()
      .firestore()
      .collection("muaban_phuquoc")
      .doc(id);
    const rs = await item.get();
    let card = rs.data();
    return { card };
  },
  beforeCreate() {},
  computed: {
    arrayImage() {
      let ar = [];
      if (this.card.image_url1) {
        ar = [this.card.image_url1];
      }
      if (this.card.image_url2) {
        ar = [this.card.image_url1, this.card.image_url2];
      }
      if (this.card.image_url3) {
        ar = [this.card.image_url1, this.card.image_url2, this.card.image_url3];
      }
      return ar;
    }
  },
  data() {
    return {
      comment: "",
      checkbox: true,
      card: {},
      comments: [
        {
          id: 1,
          userId: 1,
          userName: "duanvuminh@gmail.com",
          text:
            "duan dep trai bien thai, duan dep trai bien thai, duan dep trai bien thai",
          editDate: "2019/11/26 15:36",
          commentSub: [
            {
              id: 1,
              userId: 1,
              text: "subtext",
              editDate: "2019/11/26 15:36"
            },
            {
              id: 1,
              userId: 1,
              text: "subtext",
              editDate: "2019/11/26 15:36"
            }
          ],
          liked: [1, 2]
        },
        {
          id: 1,
          userId: 1,
          text: "duan",
          editDate: "2019/11/26 15:36"
        }
      ]
    };
  },
  head() {
    return {
      titleTemplate: `%s - ${this.card.name}`,
      title: process.env.site_name || "",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: this.card.seo || ""
        }
      ]
    };
  },
  layout: "normal",
  methods: {
    iso8601Time(timestamp) {
      // console.log(timestamp);
      return new Date(timestamp.seconds * 1e3).toISOString().slice(0, -5);
    },
    addComment() {}
  },
  mounted() {}
};
</script>
<style>
.v-image__image {
  background-size: contain;
}
</style>