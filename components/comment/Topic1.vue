<template>
  <div v-show="item.isShow">
    <template v-if="show">
      <v-subheader>
        <span>{{item.full_name}}</span>
        <v-spacer></v-spacer>
        <v-list-item-action>
          <Action
            :add="true"
            :type="type"
            @addMenu="addMenu"
            @deleteMenu="val=>{item.isShow=false}"
            @editMenu="val=>{item.full_name=val}"
            :value="item.full_name"
          ></Action>
        </v-list-item-action>
      </v-subheader>
    </template>
    <template v-else>
      <v-list-item @click="$emit('selecTopic',level1,item.id)" dense>
        <v-list-item-title>{{item.full_name}}</v-list-item-title>
        <v-list-item-action>
          <Action
            :add="true"
            :type="type"
            @addMenu="addMenu"
            @deleteMenu="val=>{item.isShow=false}"
            @editMenu="val=>{item.full_name=val}"
            :value="item.full_name"
          ></Action>
        </v-list-item-action>
      </v-list-item>
    </template>
    <template v-if="topics.length>0">
      <template v-for="item1 in topics">
        <v-list-item
          dense
          :key="item1.id"
          @click="$emit('selecTopic1',level1,item.id,item1.id)"
          v-show="item1.isShow"
        >
          <v-list-item-title>{{item1.full_name}}</v-list-item-title>
          <v-list-item-action>
            <Action
              :add="false"
              :type="type"
              @addMenu="addMenu"
              :id="item1.id"
              @editMenu="val=>{item1.full_name=val}"
              @deleteMenu="val=>{item1.isShow=false}"
              :value="item1.full_name"
            ></Action>
          </v-list-item-action>
        </v-list-item>
      </template>
    </template>
  </div>
</template>
<script>
import Action from "./Action";
import firebase from "firebase/app";
import "firebase/firestore";

export default {
  components: {
    Action,
  },
  data() {
    return {
      topics: [],
    };
  },
  methods: {
    addMenu(topic) {
      this.topics.unshift(topic);
    },
  },
  mounted() {
    if (!this.level1) {
      return;
    }
    firebase
      .firestore()
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
        });
        if (this.item0 == 0) {
          if(this.topics.length > 0){
            this.$emit('selecTopic1',this.level1,this.item.id,this.topics[0].id);
            this.$emit('selecItem1',1);
          }else{
            this.$emit('selecTopic',this.level1,this.item.id);
            this.$emit('selecItem1',0);
          }
        }
      });
  },
  props: ["item", "level1", "item0"],
  computed: {
    show() {
      return this.topics.length > 0;
    },
    type() {
      // type: {level1,topic}
      return { level1: this.level1, topic: this.item.id };
    },
  },
};
</script>
