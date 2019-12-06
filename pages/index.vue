<template>
  <v-row justify="center">
    <v-col cols="12" sm="6">
      <v-text-field
        solo
        label="Search"
        prepend-inner-icon="mdi-magnify"
        clearable
        @keypress="search"
        @blur="search1"
        v-model="searchkey"
      ></v-text-field>
    </v-col>
    <v-col cols="12">
      <div v-html="$md.render(introdue)"></div>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      searchkey: "",
      introdue:`
## Cách sử dụng
Nhập từ kanji mà bạn muốn xem. Ví dụ "四" (cách nhớ dựa trên [kanji primitive](https://docs.google.com/document/d/1z-5C_Z1Cpkerrnd2Eo1mCVhMcFpE7cdgDydoLHBLnNQ/edit))
Để sửa đổi cần đăng nhập. 
## Các nguồn khác
* Best recommended input extension
[Google input tool](https://www.google.com/inputtools/chrome/)
* Join oboe Team
[Online support](https://lovejapanworkspace.slack.com)
* How to edit with markdown
[markdown](https://lithong.com/howto)
* Hỗ trợ đánh tiếng nhật online
[Gõ tiếng Nhật](https://typing.lithong.com/)
* Q&A
Comming soon...
      `
    };
  },
  layout: "oboe",
  methods: {
        search1() {
      if (this.searchkey.replace(/(\r\n|\n|\r)/gm, "").trim()) {
        this.$router.push(`/search/${this.searchkey[0]}`);
      }
    },
    search(e) {
      if (
        e.key == "Enter" &&
        this.searchkey.replace(/(\r\n|\n|\r)/gm, "").trim()
      ) {
        this.$router.push(`/search/${this.searchkey[0]}`);
      }
    }
  },
  mounted() {
    // this.$axios
    //   .$post(
    //     "https://translation.googleapis.com/language/translate/v2?key=AIzaSyCgybxabzEcfCXOeZHVrwVenvrtY7OkV3M",
    //     {
    //       q: "I've never seen a cow with human legs before!",
    //       source: "en",
    //       target: "vi",
    //       format: "text"
    //     }
    //   )
    //   .then(r => console.log(r));
  }
};
</script>