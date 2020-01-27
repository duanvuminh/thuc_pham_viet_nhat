<template>
  <v-row>
    <v-col cols="12">
      <v-hover v-slot:default="{ hover }">
        <div class="d-flex justify-start">
          <avartar :size="size" :email="comment.userEmail"></avartar>
          <div class="ml-1">
            <article>
              <header>
                <b>Vũ Minh Duẩn</b>
                <small>2020/1/25 23:30</small>
              </header>
              <div>Paris is the capital and most populous city of France.Paris is the capital and most populous city of France.</div>
              <footer></footer>
            </article>
            <div class="d-flex justify-start">
              <v-btn text icon>
                <v-icon>mdi-thumb-up</v-icon>
              </v-btn>
              <span></span>
              <v-btn text icon>
                <v-icon>mdi-thumb-down</v-icon>
              </v-btn>
              <span></span>
              <v-btn text @click="showAdd=!showAdd">Trả lời</v-btn>
            </div>
            <add :size="25" :rows="1" v-if="showAdd" @setShowAdd="setShowAdd"></add>
          </div>
          <v-menu left bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" v-if="hover">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
              <v-btn icon v-on="on" v-else disabled></v-btn>
            </template>

            <v-list>
              <v-list-item-group color="primary">
                <template v-if="email==comment.userEmail">
                  <v-list-item dense>
                    <v-list-item-icon>
                      <v-icon>edit</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Chỉnh sửa</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item dense>
                    <v-list-item-icon>
                      <v-icon>delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Xoá</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <template v-else>
                  <v-list-item dense>
                    <v-list-item-icon>
                      <v-icon>flag</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Báo cáo</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </template>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </div>
      </v-hover>
    </v-col>
  </v-row>
</template>
<script>
import firebase from "firebase/app";
import "firebase/auth";
const avartar = () => import("./Avartar");
const add = () => import("./Add");

export default {
  components: {
    avartar,
    add
  },
  data() {
    return {
      email: this.$store.state.user.email,
      size: 40,
      showAdd: false,
      value: true
    };
  },
  mounted() {},
  methods: {
    setShowAdd(val) {
      this.showAdd = val;
    }
  },
  props: ["comment"]
};
</script>