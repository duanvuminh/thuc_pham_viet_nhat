<template>
  <v-app light>
    <v-toolbar color="white">
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="ma-2" outlined fab color="teal" href="/auth/">
        <v-icon>account_circle</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <section>
        <v-parallax src="/hero.jpeg" height="600">
          <v-layout column align-center justify-center class="white--text">
            <img src="/vuetify.png" alt="Vuetify.js" height="200" />
            <h1 class="white--text mb-2 display-1 text-center">Thu mua các mặt hàng đa dạng</h1>
            <div class="subheading mb-4 text-center">Sản phẩm từ giấy, sản phẩm phá dỡ công trình...</div>
            <v-btn class="mt-12" color="blue lighten-2" dark large href="/buyItem">Chi tiết</v-btn>
          </v-layout>
        </v-parallax>
      </section>

      <section>
        <nuxt />
      </section>

      <section>
        <v-parallax src="/section.jpg" height="380">
          <v-layout column align-center justify-center>
            <div class="headline white--text mb-4 text-center">Đồng thời có rất nhiều sản phẩm</div>
            <em>Giá cả phải chăng chất lượng tốt</em>
            <v-btn class="mt-12" color="blue lighten-2" dark large href="/pre-made-themes">Chi tiết</v-btn>
          </v-layout>
        </v-parallax>
      </section>

      <section>
        <v-container grid-list-xl>
          <v-layout row wrap justify-center class="my-12">
            <v-flex xs12 sm4>
              <v-card flat class="transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Company info</div>
                </v-card-title>
                <v-card-text>
                  Vựa Tiến Liêm
                  <br />- Chuyên thu mua phế liệu công trình... giá cao
                  <br />- Nhận cẩu thuê
                  <br />- Cung cấp ống nước cho công trình số lượng nhiều giá hấp dẫn
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs12 sm4 offset-sm1>
              <v-card flat class="transparent">
                <v-card-title primary-title class="layout justify-center">
                  <div class="headline">Contact us</div>
                </v-card-title>
                <v-card-text>Đừng ngại ngùng hãy gọi ngay cho chúng tôi</v-card-text>
                <v-list class="transparent">
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon class="blue--text text--lighten-2">mdi-phone</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>0975-184-820</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-action>
                      <v-btn
                        text
                        icon
                        color="pink"
                        href="https://www.google.com/maps/place/Khu+d%C3%A2n+c%C6%B0+B%E1%BA%BFn+Tr%C3%A0m/@10.2425873,104.0082674,17z/data=!3m1!4b1!4m5!3m4!1s0x31a7895e53fa7141:0x4ca1c93acdb9795a!8m2!3d10.2425873!4d104.0104561"
                      >
                        <v-icon>mdi-map-marker</v-icon>
                      </v-btn>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>Cầu lớn Bến Tràm, xã cửa Dương, Phú Quốc</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-action>
                      <v-icon class="blue--text text--lighten-2">mdi-email</v-icon>
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
              <a class="white--text" href="https://lithong.com" target="_blank">Love Japan</a>
            </div>
          </v-flex>
        </v-layout>
      </v-footer>
    </v-content>
  </v-app>
</template> 

<script>
export default {
  data() {
    return {
      title: process.env.site_name
    };
  }
};
</script>
