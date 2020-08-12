<template>
  <div>
    <v-card :class="!outlinedCheck?'mx-auto elevation-0 mb-0 pa-3':'pa-1 mx-auto elevation-0'">
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
            <div slot="prepend"></div>
          </v-text-field>
          <v-textarea
            :placeholder="`${email?'Bạn hãy viết gì đó':'Đăng nhập'}`"
            :rows="rows"
            auto-grow
            v-model="commentText"
            hide-details
            @click="showAction=true;"
            persistent-hint
            :readonly="!email"
            dense
          >
            <div slot="prepend">
              <v-expand-transition>
                <avartar :size="size" :email="email"></avartar>
              </v-expand-transition>
            </div>
          </v-textarea>
        </v-col>
        <!-- <v-col cols="6">
        <template v-if="showAction && email">
          <v-combobox v-model="select" :items="items" label="Chọn chủ đề" dense hide-details></v-combobox>
        </template>
        </v-col>-->
        <v-col v-if="showAction && email" cols="12" class="d-flex ma-0 pr-3">
          <template>
            <!-- <v-chip
            class="ma-2"
            label
            x-small
            @click="openTag"
            @click:close="openTag"
            close
            close-icon="mdi-menu-down"
            outlined
            color="deep-purple accent-4"
          >
            <v-icon left x-small>mdi-tag</v-icon>
            {{focusTab?focusTab:'Tags'}}
            </v-chip>-->
            <v-spacer></v-spacer>
            <v-btn text small @click="reset">Huỷ</v-btn>
            <v-btn
              color="primary"
              small
              @click="$emit('add',messageAdd);commentText='';"
              :disabled="checkLength"
            >Thêm</v-btn>
          </template>
        </v-col>
        <v-col class="pa-0 ma-0">
          <datepicker @datechange="datechange"></datepicker>
        </v-col>
      </v-row>
      <!-- <tags @setDialogTag="setDialogTag" :dialogTag="dialogTag" @setTagName="setTagName" :full="true"></tags> -->
    </v-card>
  </div>
</template>
<script>
import {mapState} from 'vuex';
//const avartar = () => import("./Avartar");
import avartar from "./Avartar";
//const tags = () => import("./TagsForum");
//import tags from "./TagsForum";
//const datepicker = () => import("./DatePicker");
import datepicker from "./DatePicker";

export default {
  components: {
    avartar,
    datepicker,
  },
  data() {
    return {
      dialog: false,
      dialogTag: false,
      show: true,
      email: this.$store.state.user.email,
      focusTab: "",
      showAction: false,
      commentHeader:null,
      commentText: "",
      content: "",
    };
  },
  methods: {
    openTag() {
      this.dialogTag = true;
    },
    reset() {
      this.commentText = "";
      this.showAction = false;
      this.focusTab = "";
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
    ...mapState(["topic", "contents","date"]),
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
      if(this.commentHeader){
        comment = `### ${this.commentHeader}
${comment}
        `
      }
      return {
        creator: this.email,
        time: new Date(),
        content: comment,
        date: this.formatDate(new Date()),
        type: this.topic,
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
 