<template>
  <div>
    <v-card :class="!showAction?'mx-auto elevation-0 mb-0':'mx-auto pa-5'" :outlined="showAction">
      <v-row>
        <v-col cols="12" class="mb-0 py-0 pr-3">
          <v-textarea
            :placeholder="`${email?'Bạn hãy viết gì đó':'Đăng nhập'}`"
            :rows="rows"
            auto-grow
            v-model="commentText"
            hide-details
            @click:append="setdialog"
            @click="showAction=true;"
            persistent-hint
            :readonly="!email"
            append-icon="mdi-text-shadow"
            dense
          >
            <div slot="prepend">
              <avartar :size="size" :email="email"></avartar>
            </div>
          </v-textarea>
        </v-col>
        <!-- <v-col cols="6">
        <template v-if="showAction && email">
          <v-combobox v-model="select" :items="items" label="Chọn chủ đề" dense hide-details></v-combobox>
        </template>
        </v-col>-->
        <client-only>
          <v-col cols="12" class="mb-0 py-0 pr-3">
            <v-dialog v-model="dialog" fullscreen>
              <v-card>
                <vue-simplemde v-model="commentText" />

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="dialog = false">Close</v-btn>
                  <v-btn
                    color="primary"
                    text
                    @click="$emit('add',messageAdd);commentText='';dialog = false"
                    :disabled="checkLength"
                  >Thêm</v-btn> 
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-col>
        </client-only>
        <v-col cols="12" class="d-flex ma-0 pr-3">
          <template v-if="showAction && email">
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
      </v-row>
      <!-- <tags @setDialogTag="setDialogTag" :dialogTag="dialogTag" @setTagName="setTagName" :full="true"></tags> -->
    </v-card>
    <v-card class="mx-auto elevation-0 mb-0">
      <datepicker @datechange="datechange"></datepicker>
    </v-card>
  </div>
</template>
<script>
const avartar = () => import("./Avartar");
const tags = () => import("./TagsForum");
const datepicker = () => import("./DatePicker");

export default {
  components: {
    avartar,
    tags,
    datepicker
  },
  data() {
    return {
      dialog: false,
      dialogTag: false,
      show: true,
      email: this.$store.state.user.email,
      focusTab: "",
      showAction: false,
      commentText: "",
      content: ""
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
    setdialog() {
      this.dialog = true;
    },
    setDialogTag(val) {
      this.dialogTag = val;
    },
    setTagName(val) {
      this.focusTab = val;
    },
    datechange(val) {
      this.$emit("datechange", val);
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
    }
  },
  mounted() {
    this.commentText = this.text;
    // if (!this.isRoot) {
    //   this.text = this.from ? `**${this.from}**` : "";
    // }
  },
  props: ["size", "rows", "type"],
  computed: {
    messageAdd() {
      return {
        creator: this.email,
        time: new Date(),
        content: this.commentText,
        date: this.formatDate(new Date()),
        type: this.type
      };
    },
    checkLength() {
      if (!this.commentText) {
        return true;
      } else {
        return !(this.commentText.length > 10);
      }
    }
  }
};
</script>
 