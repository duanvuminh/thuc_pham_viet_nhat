<template>
  <div>
    <input
      type="file"
      style="display: none"
      model="imgValue"
      accept="image/png, image/jpeg"
      ref="myFiles"
      class="custom-file-input"
      @change="previewFiles"
      multiple
    />
    <v-sheet ref="duan" class="overflow-y-auto" max-height="450px">
      <v-container fluid ref="chat">
        <template v-for="(item,index) in messageDisplay">
          <v-row align="start" :key="index" v-if="!item.isme">
            <v-col cols="1">
              <v-avatar color="teal" size="48">
                <span class="white--text headline">{{item.userName[0]}}</span>
              </v-avatar>
            </v-col>
            <v-col cols="9">
              <v-row align="start">
                <v-card class="grey">
                  <v-card-text class="white--text" v-html="item.text"></v-card-text>
                </v-card>
              </v-row>
            </v-col>
          </v-row>
          <v-row justify="end" :key="index" v-else>
            <v-col cols="8">
              <v-row justify="end">
                <v-card class="ma-5 mt-0 pa-5 blue" v-if="item.files.length==0">
                  <v-card-text class="white--text">{{item.text}}</v-card-text>
                </v-card>
                <template v-else>
                  <v-card v-for="(file,i) in item.files" class="ma-5" :key="i">
                    <v-img
                      contain
                      :src="file.fileUrl"
                      class="white--text align-end"
                      gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                      height="200px"
                      :key="i"
                    ></v-img>
                  </v-card>
                </template>
              </v-row>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </v-sheet>

    <v-text-field clearable hide-details solo v-model="message">
      <template slot="append">
        <v-icon @click="fileOpen">attach_file</v-icon>
        <v-icon @click="enterText">send</v-icon>
      </template>
    </v-text-field>
  </div>
</template>
<script>
import firebase from "firebase";
export default {
  beforeCreate() {
    // ここでローディングのインジケータアニメーションを表示すると良い
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit("setLoginState", true);
      } else {
        this.$store.commit("setLoginState", false);
        this.$router.push("/login");
      }
    });
  },
  data() {
    return {
      bottomNav: true,
      message: "",
      messageList: [
        {
          // là hệ thống hay người dùng
          isme: false,
          userName: process.env.site_name,
          // Tin nhắn gửi tới người sử dụng
          text:
            "Hệ thống sẽ hướng dẫn bạn tạo một bài giới thiệu/review sản phẩm.Nhập <b style='color:red'>blank</b> để bỏ trống.<br>Nhập tên bài viết/sản phẩm",
          // match database
          matchingItem: "name",
          value: "",
          files: [],
          // ít hơn 100 kí tự
          validate: /^.{1,50}$/,
          errorMessage: "Tiêu đề không để trống và nhỏ hơn 50 kí tự",
          // đã trả lời hay chưa
          isAnswer: false,
          //isImage
          isImage: false
        },
        {
          // là hệ thống hay người dùng
          isme: false,
          userName: process.env.site_name,
          // Tin nhắn gửi tới người sử dụng
          text:
            "Địa điểm mà bài viết đề cập là gì cố gắng cụ thể nhất có thể(có thể là ga gần nhất)",
          // match database
          matchingItem: "address",
          value: "",
          validate: /^.{0,}$/,
          files: "",
          // đã trả lời hay chưa
          isAnswer: false,
          //isImage
          isImage: false
        },
        {
          // là hệ thống hay người dùng
          isme: false,
          userName: process.env.site_name,
          // Tin nhắn gửi tới người sử dụng
          text: "Nhập loại sản phẩm",
          // match database
          matchingItem: "type",
          value: "",
          validate: /^.{0,}$/,
          files: "",
          // đã trả lời hay chưa
          isAnswer: false,
          //isImage
          isImage: false
        },
        {
          // là hệ thống hay người dùng
          isme: false,
          userName: process.env.site_name,
          // Tin nhắn gửi tới người sử dụng
          text: "Nhập ảnh của sản phẩm,tối đa 3 ảnh",
          // match database
          matchingItem: "type",
          value: "",
          validate: /^.{0,}$/,
          files: "",
          // đã trả lời hay chưa
          isAnswer: false,
          //isImage
          isImage: true
        },
        {
          // là hệ thống hay người dùng
          isme: false,
          userName: process.env.site_name,
          // Tin nhắn gửi tới người sử dụng
          text:
            "Bạn nghĩ rằng mọi người sẽ tìm kiếm bài viết của bạn bằng từ khoá nào(Ngăn cách bằng dấu phảy)<br>Ví dụ: quần áo, uniquino",
          // match database
          matchingItem: "type",
          value: "",
          validate: /^.{0,}$/,
          files: "",
          // đã trả lời hay chưa
          isAnswer: false,
          //isImage
          isImage: false
        }
      ],
      messageDisplay: []
    };
  },
  methods: {
    enterText() {
      let iptext = this.message;
      if (!iptext) {
        return;
      } else {
        if (iptext == "blank") {
          iptext = "";
        } else {
          let tmp = this.messageList.filter(x => {
            return !x.isAnswer;
          });
          if (tmp.length > 0) {
            if (tmp[0].isImage) {
              this.messageDisplay.push({
                // là hệ thống hay người dùng
                isme: false,
                userName: process.env.site_name,
                // Tin nhắn gửi tới người sử dụng
                text: "Nhập ảnh hoặc nhập <b style='color:red'>blank</b> ",
                files: []
              });
              //scroll
              this.$nextTick(() => {
                this.$refs.duan.$el.scrollTop = this.$refs.duan.$el.scrollHeight;
              });
              return;
            }
          }
        }
      }
      this.messageDisplay.push({
        // là hệ thống hay người dùng
        isme: true,
        userName: process.env.site_name,
        // Tin nhắn gửi tới người sử dụng
        text: iptext,
        files: []
      });
      let current = this.messageList.filter(x => {
        return !x.isAnswer;
      });
      if (current.length > 0) {
        if (current[0].validate) {
          if (current[0].validate.test(iptext ? iptext : "")) {
            current[0].isAnswer = true;
            current[0].value = iptext;
            let next = this.messageList.filter(x => {
              return !x.isAnswer;
            });
            if (next.length > 0) {
              this.messageDisplay.push(next[0]);
            } else {
              // register
              this.register();
            }
          } else {
            this.messageDisplay.push({
              // là hệ thống hay người dùng
              isme: false,
              userName: process.env.site_name,
              // Tin nhắn gửi tới người sử dụng
              text: current[0].errorMessage,
              files: []
            });
          }
        }
      } else {
        this.messageDisplay.push({
          // là hệ thống hay người dùng
          isme: false,
          userName: process.env.site_name,
          // Tin nhắn gửi tới người sử dụng
          text: "Hệ thống đang đăng kí...",
          files: []
        });
      }
      //scroll
      this.$nextTick(() => {
        this.$refs.duan.$el.scrollTop = this.$refs.duan.$el.scrollHeight;
      });
    },
    fileOpen() {
      let current = this.messageList.filter(x => {
        return !x.isAnswer;
      });
      if (current.length > 0) {
        if (!current[0].isImage) {
          return;
        }
      }
      this.$refs.myFiles.click();
    },
    previewFiles() {
      // console.log(this.$refs.myFiles.files);
      this.$refs.myFiles.files[0].fileUrl = URL.createObjectURL(
        this.$refs.myFiles.files[0]
      );
      let iptext = [this.$refs.myFiles.files[0]];
      if (this.$refs.myFiles.files[1]) {
        this.$refs.myFiles.files[1].fileUrl = URL.createObjectURL(
          this.$refs.myFiles.files[1]
        );
        iptext.push(this.$refs.myFiles.files[1]);
      }
      if (this.$refs.myFiles.files[2]) {
        this.$refs.myFiles.files[2].fileUrl = URL.createObjectURL(
          this.$refs.myFiles.files[2]
        );
        iptext.push(this.$refs.myFiles.files[2]);
      }
      this.messageDisplay.push({
        // là hệ thống hay người dùng
        isme: true,
        userName: process.env.site_name,
        // Tin nhắn gửi tới người sử dụng
        files: iptext
      });
      let current = this.messageList.filter(x => {
        return !x.isAnswer;
      });
      if (current.length > 0) {
        current[0].isAnswer = true;
        current[0].files = iptext;
        let next = this.messageList.filter(x => {
          return !x.isAnswer;
        });
        if (next.length > 0) {
          this.messageDisplay.push(next[0]);
        } else {
          // register
          this.register();
        }
      } else {
        this.messageDisplay.push({
          // là hệ thống hay người dùng
          isme: false,
          userName: process.env.site_name,
          // Tin nhắn gửi tới người sử dụng
          text: "Hệ thống đang đăng kí..."
        });
      }
      //scroll
      this.$nextTick(() => {
        this.$refs.duan.$el.scrollTop = this.$refs.duan.$el.scrollHeight;
      });
    },
    register() {}
    // urlImg(file) {
    //   return URL.createObjectURL(file);
    // }
  },
  mounted() {
    this.messageDisplay.push(this.messageList[0]);
  }
};
</script>