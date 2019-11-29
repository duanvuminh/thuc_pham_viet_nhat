<template>
  <v-app light>
    <v-toolbar>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="loggedIn" text to="/auth/items">My Page</v-btn>
      <v-btn v-else text to="/login">Login</v-btn>
    </v-toolbar>
    <v-content>
      <section>
        <v-parallax src="/hero.jpeg" height="600">
          <v-layout column align-center justify-center class="white--text">
            <h2 class="white--text mb-4 text-center">{{quote}}</h2>
            <div class="subheading mb-0 text-center">--quotes--</div>
            <div class="subheading text-center">Nhập tên địa điểm và bắt đầu khám phá...</div>
            <v-btn class="mt-12" color="blue lighten-2" dark large to="/items">Bắt đầu</v-btn>
          </v-layout>
        </v-parallax>
      </section>

      <section>
        <nuxt />
      </section>

      <section>
        <v-parallax src="/section.jpg" height="380">
          <v-layout column align-center justify-center>
            <div
              class="headline white--text mb-4 text-center"
            >Rất mong nhận được sự đóng góp của cộng đồng</div>
            <em>Đăng nhập và viết bài</em>
            <v-btn class="mt-12" color="blue lighten-2" dark large to="/howto">Chi tiết</v-btn>
          </v-layout>
        </v-parallax>
      </section>

      <section>
        <v-container grid-list-xl>
          <v-layout row wrap justify-center class="my-12">
            <v-flex xs12 sm4>
              <v-card flat class="transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Site info</div>
                </v-card-title>
                <v-card-text>
                  Review du lịch Nhật Bản và Việt Nam
                  <br />- Các địa điểm ở Nhật Bản
                  <br />- Các quán ăn
                  <br />- Các mặt hàng ở Nhật được ưa chuộng
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4 offset-sm1>
              <v-card flat class="transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Contact us</div>
                </v-card-title>
                <v-card-text>Có bất cứ câu hỏi nào hãy gửi mail theo địa chỉ bên dưới</v-card-text>
                <v-list class="transparent">
                  <v-list-item>
                    <v-list-item-action>
                      <v-btn text icon>
                        <v-icon class="blue--text text--lighten-2">mdi-phone</v-icon>
                      </v-btn>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>080-2360-7047</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-action>
                      <v-btn text icon>
                        <v-icon class="blue--text text--lighten-2">mdi-email</v-icon>
                      </v-btn>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>duanvuminh@gmail.com</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-flex>
          </v-layout>
        </v-container>
      </section>

      <v-footer color="blue darken-2">
        <v-layout row wrap align-center>
          <v-flex xs12>
            <div class="white--text ml-4">
              <v-icon class="red--text">mdi-heart</v-icon>
              <a class="white--text" href="https://typing.lithong.com/" target="_blank">Love Japan</a>
            </div>
          </v-flex>
        </v-layout>
      </v-footer>
    </v-content>
  </v-app>
</template> 

<script>
import firebase from "firebase";

export default {
  async asyncData({ params }) {},
  data() {
    return {
      title: process.env.site_name,
      quote: "In any moment of decision, the best thing you can do is the right thing, the next best thing is the wrong thing, and the worst thing you can do is nothing"
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    }
  },
  mounted() {
    // take care to clone data
    // this.$axios.setHeader(
    //   "Authorization",
    //   "Token fbb27296d0ff08daced608f1bafa867f42373c31"
    // );
    // this.$axios
    //   .$get(
    //     "https://cors-anywhere.herokuapp.com/https://api.paperquotes.com/apiv1/quotes/?tags=travel&random=random&curated=1&limit=10000"
    //   )
    //   .then(r => {
    //     for(let i=0;i<r.results.length;i++){
    //        firebase
    //         .firestore()
    //         .collection("Quotes")
    //         .add({
    //           pk:r.results[i].pk,
    //           quote:r.results[i].quote,
    //           random: i+2
    //         })
    //     }
    //   });
    let random = Math.random() * 100
    firebase
      .firestore()
      .collection("Quotes")
      .where("random", ">=", random)
      .orderBy("random")
      .limit(1)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          this.quote=`In any moment of decision, the best thing you can do is the right thing, the next best thing is the wrong thing, and the worst thing you can do is nothing`
          return;
        }  
        snapshot.forEach(doc => {
          this.quote = doc.data().quote;
        });
      });
  }
};
</script>
