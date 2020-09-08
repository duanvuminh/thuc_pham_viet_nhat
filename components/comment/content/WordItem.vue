<template>
  <v-card elevation="0">
    <div class="d-flex">
      <v-card-text class="pa-1">
        <template v-if="!editMode">
          <div class="d-flex align-center">
            <span v-if="show1">{{item.word}}</span>
            <v-text-field v-else v-model="word" label="Từ" dense :hint="hint?item.hint:null"></v-text-field>
            <v-btn v-if="!show1" icon small :color="word==item.word?'green':'grey'" @click="hint=!hint">
              <v-icon small>mdi-check</v-icon>
            </v-btn>
            <v-btn icon @click="show1=!show1" small>
              <v-icon small>mdi-repeat-once</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <HtmlParser v-if="show2" :content="item.content"></HtmlParser>
            <v-btn icon @click="show2=!show2" small>
              <v-icon small>mdi-repeat-once</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
          </div>
        </template>
        <template v-else>
          <v-text-field v-model="item.word" outlined label="Từ"></v-text-field>
          <v-text-field v-model="item.hint" outlined label="Hint"></v-text-field>
          <v-textarea v-model="item.content" outlined label="Nội dung"></v-textarea>
        </template>
      </v-card-text>
      <v-spacer></v-spacer>
      <div>
        <v-menu bottom left v-if="show&&controller">
          <template v-slot:activator="{ on, attrs }">
            <v-btn dark icon v-bind="attrs" v-on="on">
              <v-icon small>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item dense>
              <v-btn icon @click="$emit('add')">
                <v-icon small>mdi-plus</v-icon>
              </v-btn>
              <v-btn icon @click="$emit('xoa')">
                <v-icon small>mdi-minus</v-icon>
              </v-btn>
              <v-btn icon @click="editMode=true">
                <v-icon small>mdi-pen</v-icon>
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
        <template v-if="editMode">
          <v-btn icon @click="editMode=false;$emit('edit',item)">
            <v-icon small>mdi-check</v-icon>
          </v-btn>
        </template>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  components: {
    HtmlParser: () => import("@/components/HtmlParser"),
  },
  computed: {
    show() {
      if (!this.creator || this.$store.state.user.email == this.creator) {
        return true;
      } else {
        return false;
      }
    },
  },
  data: () => ({
    editMode: false,
    hint:false,
    show1: true,
    show2: true,
    word: null,
  }),
  mounted() {
    if (this.item.word) {
      this.show1 = this.show1All;
      this.show2 = this.show2All;
    }
  },
  props: ["item", "creator", "controller", "show1All", , "show2All"],
};
</script>