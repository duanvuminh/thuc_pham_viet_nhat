<template>
  <div>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon color="grey darken-1" small>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-if="add" @click="dialog=true">
          <v-list-item-title>
            <v-icon color="grey darken-1" small>mdi-plus-circle-outline</v-icon>
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="dialog1=true">
          <v-list-item-title>
            <v-icon color="grey darken-1" small>mdi-pencil-circle-outline</v-icon>
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="deleteMenu">
          <v-list-item-title>
            <v-icon color="grey darken-1" small>mdi-delete-circle-outline</v-icon>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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

export default {
  components: {},
  data() {
    return {
      dialog: false,
      dialog1: false,
      //form 1
      full_name: null,
      valid: true,
      //end form
      //form 2
      full_name1: this.value,
      valid1: true,
      //end form
    };
  },
  methods: {
    validate() {
      this.$refs.form.validate();
      if (this.valid) {
        if (this.type.level1 == "4PisKFBkxDzV7voklXYA") {
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
              full_name: this.full_name,
            })
            .then((doc) => {
              let topic = {
                id: doc.id,
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
              full_name: this.full_name,
            })
            .then((doc) => {
              let topic = {
                id: doc.id,
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
        if (this.type.level1 == "4PisKFBkxDzV7voklXYA") {
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
                },
                { merge: true }
              )
              .then((doc) => {
                this.$emit("editMenu", this.full_name1);
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
                  full_name: this.full_name1,
                },
                { merge: true }
              )
              .then((doc) => {
                this.$emit("editMenu", this.full_name1);
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
                  full_name: this.full_name1,
                },
                { merge: true }
              )
              .then((doc) => {
                this.$emit("editMenu", this.full_name1);
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
                  full_name: this.full_name1,
                },
                { merge: true }
              )
              .then((doc) => {
                this.$emit("editMenu", this.full_name1);
                this.dialog1 = false;
              });
          }
        }
      }
    },
    deleteMenu() {
      if (this.type.level1 == "4PisKFBkxDzV7voklXYA") {
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
                isShow: false
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
                isShow: false
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
                isShow: false
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
  props: ["add", "type", "id", "value"],
  computed: {},
};
</script>
