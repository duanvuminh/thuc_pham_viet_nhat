<template>
  <div>
    <v-card v-if="email" :class="!outlinedCheck?'mx-auto elevation-0 mb-0 pa-3':'pa-1 mx-auto elevation-0'">
      <v-row>
        <v-col cols="12" class="mb-0 py-0 pr-3">
          <v-text-field
            v-if="showAction&&email"
            class="text-h5"
            placeholder="Tiêu đề"
            :rows="1"
            v-model="commentHeader"
            hide-details
            persistent-hint
            :readonly="!email"
            dense
            solo
            flat
          >
            <div slot="append">
              <v-chip
                small
                v-if="cus_component"
                class="ma-2"
                close
                @click:close="resetTimeline"
              >{{cus_component}}</v-chip>
            </div>
          </v-text-field>
          <v-textarea
            :placeholder="`${email?'Bạn hãy viết gì đó':'Đăng nhập'}`"
            :rows="rows"
            auto-grow
            v-model="commentText"
            @click="showAction=true;"
            persistent-hint
            :readonly="!email"
            dense
            :loading="loading"
            :disabled="loading"
          >
            <div slot="prepend">
              <v-expand-transition>
                <avartar :size="size" :email="email"></avartar>
              </v-expand-transition>
            </div>
            <template v-if="email" slot="append">
              <div>
                <!-- <v-icon @click="openImage">mdi-paperclip</v-icon>
                <input
                  name="file"
                  @change="onFileChange"
                  ref="file"
                  type="file"
                  style="display: none"
                  accept="image/png, image/jpeg"
                /> -->
                <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                      <v-icon color="grey darken-1" small>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <div class="d-flex">
                    <v-list>
                      <v-list-item @click="dialog=true;cus_component='Timeline'">
                        <v-list-item-avatar>
                          <v-icon color="grey darken-1" small>mdi-timeline</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-title>Tạo timeline</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="dialog=true;cus_component='Word'">
                        <v-list-item-avatar>
                          W
                        </v-list-item-avatar>
                        <v-list-item-title>Tạo flash card</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="dialog=true;cus_component='Summary'">
                        <v-list-item-avatar>
                          S
                        </v-list-item-avatar>
                        <v-list-item-title>Tổng hợp bài</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="dialog=true;cus_component='Asobi'">
                        <v-list-item-avatar>
                          ✈️
                        </v-list-item-avatar>
                        <v-list-item-title>Du lịch</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-menu>
              </div>
            </template>
          </v-textarea>
        </v-col>
        <!-- <v-col cols="6">
        <template v-if="showAction && email">
          <v-combobox v-model="select" :items="items" label="Chọn chủ đề" dense hide-details></v-combobox>
        </template>
        </v-col>-->
        <v-col v-if="showAction && email" cols="12" class="d-flex ma-0 pr-3">
          <template>
            <v-spacer></v-spacer>
            <v-btn text small @click="reset">Huỷ</v-btn>
            <v-btn
              color="primary"
              small
              @click="$emit('add',messageAdd);commentText='';commentHeader='';showAction=false;cus_component=null"
              :disabled="checkLength"
            >Thêm</v-btn>
          </template>
        </v-col>
        <v-col class="pa-0 ma-0">
          <!-- <datepicker @datechange="datechange"></datepicker> -->
        </v-col>
        <v-dialog v-model="dialog" fullscreen>
          <component
            v-bind:is="cus_component"
            @close-timeline="resetTimeline"
            @extension="extension"
            :items="[{color: '#000000',}]"
          ></component>
        </v-dialog>
      </v-row>
      <!-- <tags @setDialogTag="setDialogTag" :dialogTag="dialogTag" @setTagName="setTagName" :full="true"></tags> -->
    </v-card>
  </div>
</template>
<script>
import { mapState } from "vuex";
//const avartar = () => import("./Avartar");
//const tags = () => import("./TagsForum");
//import tags from "./TagsForum";
//const datepicker = () => import("./DatePicker");

export default {
  components: {
    avartar: () => import("./Avartar"),
    // datepicker: () => import("./DatePicker"),
    Timeline: () => import("./content/Timeline"),
    Word: () => import("./content/Word"),
    Summary:()=> import("./content/Summary"),
    Asobi:()=> import("./content/Asobi"),
  },
  data() {
    return {
      dialog: false,
      dialogTag: false,
      show: true,
      email: this.$store.state.user.email,
      focusTab: "",
      showAction: false,
      // add object
      commentHeader: null,
      commentText: "",
      cus_component: null,
      data: null,
      //end
      loading: false,
    };
  },
  methods: {
    extension(ex) {
      this.dialog = false;
      this.data = ex.data;
    },
    openTag() {
      this.dialogTag = true;
    },
    openImage() {
      this.$refs.file.click();
    },
   onFileChange(e) {
//       this.loading = true;
//       var files = e.target.files || e.dataTransfer.files;
//       if (!files.length) return;
//       let d = new Date().toString();
//       Promise.all(
//         // Array of "Promises"
//         [files[0]].map((item) => {
//           var ref = this.$fire
//             .storage()
//             .ref(`forum/${this.$store.state.user.email}/${d}`);
//           return ref.put(item).then((r) => {
//             return ref.getDownloadURL();
//           });
//         })
//       ).then((url) => {
//         this.commentText = `${this.commentText ? this.commentText : ""}
// ![ảnh bài viết](${url[0]})
// `;
//         this.loading = false;
//       });
    },
    reset() {
      this.commentText = "";
      this.showAction = false;
      this.focusTab = "";
    },
    resetTimeline() {
      this.dialog = false;
      this.cus_component = null;
      this.data = null;
    },
    setDialogTag(val) {
      this.dialogTag = val;
    },
    setTagName(val) {
      this.focusTab = val;
    },
    datechange(val) {
      this.$store.commit("setDate", val);
    },
    formatDate(date) {
      if (!date) return null;
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return `${year}${month}${day}`;
    },
  },
  mounted() {
    this.commentText = this.text;
    // if (!this.isRoot) {
    //   this.text = this.from ? `**${this.from}**` : "";
    // }
  },
  props: ["size", "rows"],
  computed: {
    ...mapState(["contents", "date"]),
    outlinedCheck() {
      if (this.showAction) {
        if (this.email) {
          return true;
        }
      }
      return false;
    },
    messageAdd() {
      let comment = this.commentText;
      if (this.commentHeader) {
        comment = `### ${this.commentHeader}
${comment}
        `;
      }
      return {
        creator: this.email,
        time: new Date(),
        content: comment,
        date: this.cus_component?'99999990':this.formatDate(new Date()),
        type: this.$route.params.id,
        data: this.data?this.data:null,
        cus_component: this.cus_component,
      };
    },
    checkLength() {
      if (!this.commentText) {
        return true;
      } else {
        return !(this.commentText.length > 10);
      }
    },
  },
};
</script>
 