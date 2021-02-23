<template>
  <div v-show="item.isShow">
    <template v-if="show">
      <v-subheader>
        <span>{{item.full_name}}</span>
        <v-spacer></v-spacer>
        <v-list-item-action>
          <Action
            v-if="showAction"
            :_add="true"
            :_edit="true"
            :_delete="true"
            :type="type"
            @addMenu="addMenu"
            @deleteMenu="val=>{item.isShow=false}"
            @editMenu="val=>{item.full_name=val.full_name;item.order = val.order}"
            :value="item"
          ></Action>
        </v-list-item-action>
      </v-subheader>
    </template>
    <template v-else>
      <v-list-item dense :to="`${url}/${item.id}`">
        <v-list-item-title>{{item.full_name}}</v-list-item-title>
        <v-list-item-action>
          <Action
            v-if="showAction"
            :_add="true"
            :_edit="true"
            :_delete="true"
            :type="type"
            @addMenu="addMenu"
            @deleteMenu="val=>{item.isShow=false}"
            @editMenu="val=>{item.full_name=val.full_name;item.order = val.order}"
            :value="item"
          ></Action>
        </v-list-item-action>
      </v-list-item>
    </template>
    <template v-if="topics.length>0">
      <template v-for="item1 in topics">
        <v-list-item dense :key="item1.id" :to="`${url}/${item1.id}`" v-show="item1.isShow">
          <v-list-item-title>{{`　　${item1.full_name}`}}</v-list-item-title>
          <v-list-item-action>
            <Action
              v-if="showAction"
              :_add="false"
              :_edit="true"
              :_delete="true"
              :type="type"
              @addMenu="addMenu"
              :id="item1.id"
              @editMenu="val=>{item1.full_name=val.full_name;item1.order = val.order}"
              @deleteMenu="val=>{item1.isShow=false}"
              :value="item1"
            ></Action>
          </v-list-item-action>
        </v-list-item>
      </template>
    </template>
  </div>
</template>
<script>
import { mapState } from "vuex";
const Action = () => import("./Action");

export default {
  components: {
    Action,
  },
  data() {
    return {
      topics: [],
    };
  },
  name: "topic1",
  methods: {
    addMenu(topic) {
      this.topics.unshift(topic);
    },
  },
  mounted() {
    // console.log(this.$route);
    // console.log(this.$router);
    if (!this.level1) {
      return;
    }
    this.$fire
      .firestore
      .collection("topic")
      .doc(this.level1)
      .collection("subtopic")
      .doc(this.item.id)
      .collection("sutopic1")
      .get()
      .then((documentSnapshots) => {
        documentSnapshots.forEach((doc) => {
          if (doc.data().isShow) {
            let topic = { id: doc.id, ...doc.data() };
            this.topics.push(topic);
          }
          if (this.item.name == "home") {
            this.$store.commit("setTopic", this.topics[0].id);
          }
        });
      });
  },
  // topic
  props: ["item", "level1", "url","showAction"],
  computed: {
    show() {
      return this.topics.length > 0;
    },
    type() {
      // type: {level1,topic}
      return { level1: this.level1, topic: this.item.id };
    },
    ...mapState(["topic"]),
  },
};
</script>
