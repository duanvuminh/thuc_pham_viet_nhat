<template>
  <div class="d-none d-md-block">
    <ActionPure
      :_add="_add"
      :_edit="_edit"
      :_delete="_delete"
      @add="dialog=true"
      @edit="dialog1=true"
      @delete="deleteMenu"
    ></ActionPure>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-form ref="form" v-model="valid" lazy-validation onsubmit="return false;">
        <v-card>
          <v-card-title>
            <span class="headline">Thêm chủ đề</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="full_name"
                    label="Tên chủ đề"
                    :rules="[v => !!v || 'Tên không được trống']"
                  ></v-text-field>
                  <v-text-field v-model="order" label="Thứ tự"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*Thêm topic để thảo luận</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="validate">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-dialog v-model="dialog1" persistent max-width="600px">
      <v-form ref="form" v-model="valid1" lazy-validation onsubmit="return false;">
        <v-card>
          <v-card-title>
            <span class="headline">Sửa chủ đề</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="full_name1"
                    label="Tên chủ đề"
                    :rules="[v => !!v || 'Tên không được trống']"
                  ></v-text-field>
                  <v-text-field v-model="order1" label="Thứ tự"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog1 = false">Close</v-btn>
            <v-btn color="blue darken-1" text @click="validate1">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>
<script>
import firebase from "firebase/app";
import "firebase/firestore";
import { mapState } from "vuex";
const ActionPure = () => import("./ActionPure");

export default {
  components: {
    ActionPure,
  },
  computed: {
    ...mapState(["mypage"]),
  },
  data() {
    return {
      dialog: false,
      dialog1: false,
      //form 1
      full_name: null,
      order: null,
      valid: true,
      //end form
      //form 2
      full_name1: this.value.full_name,
      order1: this.value.order,
      valid1: true,
      //end form
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.type.level1 == this.mypage) {
          firebase
            .firestore()
            .collection("topic")
            .doc(this.type.level1)
            .collection("users")
            .doc(this.$store.state.user.email)
            .collection("subtopic")
            .doc(this.type.topic)
            .collection("sutopic1")
            .add({
              isShow: true,
              order: this.order,
              full_name: this.full_name,
            })
            .then((doc) => {
              let topic = {
                id: doc.id,
                order: this.order,
                full_name: this.full_name,
                isShow: true,
              };
              this.$emit("addMenu", topic);
              this.dialog = false;
            });
        } else {
          firebase
            .firestore()
            .collection("topic")
            .doc(this.type.level1)
            .collection("subtopic")
            .doc(this.type.topic)
            .collection("sutopic1")
            .add({
              isShow: true,
              order: this.order,
              full_name: this.full_name,
            })
            .then((doc) => {
              let topic = {
                id: doc.id,
                order: this.order,
                full_name: this.full_name,
                isShow: true,
              };
              this.$emit("addMenu", topic);
              this.dialog = false;
            });
        }
      }
    },
    validate1() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.type.level1 == this.mypage) {
          if (this.id) {
            firebase
              .firestore()
              .collection("topic")
              .doc(this.type.level1)
              .collection("users")
              .doc(this.$store.state.user.email)
              .collection("subtopic")
              .doc(this.type.topic)
              .collection("sutopic1")
              .doc(this.id)
              .set(
                {
                  isShow: true,
                  full_name: this.full_name1,
                  order: this.order1,
                },
                { merge: true }
              )
              .then((doc) => {
                this.$emit("editMenu", {
                  full_name: this.full_name1,
                  order: this.order1,
                });
                this.dialog1 = false;
              });
          } else {
            firebase
              .firestore()
              .collection("topic")
              .doc(this.type.level1)
              .collection("users")
              .doc(this.$store.state.user.email)
              .collection("subtopic")
              .doc(this.type.topic)
              .set(
                {
                  isShow: true,
                  order: this.order1,
                  full_name: this.full_name1,
                  order: this.order,
                },
                { merge: true }
              )
              .then((doc) => {
                this.$emit("editMenu", {
                  full_name: this.full_name1,
                  order: this.order1,
                });
                this.dialog1 = false;
              });
          }
        } else {
          if (this.id) {
            firebase
              .firestore()
              .collection("topic")
              .doc(this.type.level1)
              .collection("subtopic")
              .doc(this.type.topic)
              .collection("sutopic1")
              .doc(this.id)
              .set(
                {
                  isShow: true,
                  order: this.order1,
                  full_name: this.full_name1,
                },
                { merge: true }
              )
              .then((doc) => {
                this.$emit("editMenu", {
                  full_name: this.full_name1,
                  order: this.order1,
                });
                this.dialog1 = false;
              });
          } else {
            firebase
              .firestore()
              .collection("topic")
              .doc(this.type.level1)
              .collection("subtopic")
              .doc(this.type.topic)
              .set(
                {
                  isShow: true,
                   order: this.order1,
                  full_name: this.full_name1,
                },
                { merge: true }
              )
              .then((doc) => {
                this.$emit("editMenu", {
                  full_name: this.full_name1,
                  order: this.order1,
                });
                this.dialog1 = false;
              });
          }
        }
      }
    },
    deleteMenu() {
      if (this.type.level1 == this.mypage) {
        if (this.id) {
          firebase
            .firestore()
            .collection("topic")
            .doc(this.type.level1)
            .collection("users")
            .doc(this.$store.state.user.email)
            .collection("subtopic")
            .doc(this.type.topic)
            .collection("sutopic1")
            .doc(this.id)
            .set(
              {
                isShow: false,
              },
              { merge: true }
            )
            .then((doc) => {
              this.$emit("deleteMenu");
            });
        } else {
          firebase
            .firestore()
            .collection("topic")
            .doc(this.type.level1)
            .collection("users")
            .doc(this.$store.state.user.email)
            .collection("subtopic")
            .doc(this.type.topic)
            .set(
              {
                isShow: false,
              },
              { merge: true }
            )
            .then((doc) => {
              this.$emit("deleteMenu");
            });
        }
      } else {
        if (this.id) {
          firebase
            .firestore()
            .collection("topic")
            .doc(this.type.level1)
            .collection("subtopic")
            .doc(this.type.topic)
            .collection("sutopic1")
            .doc(this.id)
            .set(
              {
                isShow: false,
              },
              { merge: true }
            )
            .then((doc) => {
              this.$emit("deleteMenu");
            });
        } else {
          firebase
            .firestore()
            .collection("topic")
            .doc(this.type.level1)
            .collection("subtopic")
            .doc(this.type.topic)
            .set(
              {
                isShow: false,
              },
              { merge: true }
            )
            .then((doc) => {
              this.$emit("deleteMenu");
            });
        }
      }
    },
  },
  mounted() {},
  // type: {level1,topic}
  props: ["_add", "_edit", "_delete", "type", "id", "value"],
};
</script>
