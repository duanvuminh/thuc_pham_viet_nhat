<template>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" v-on:click.prevent>
          <v-icon color="grey darken-1" small>{{mdiDotsVertical}}</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-if="_add" @click="$emit('add')">
          <v-list-item-title>
            <v-icon color="grey darken-1" small>{{mdiPlusCircleOutline}}</v-icon>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="_edit" @click="$emit('edit')">
          <v-list-item-title>
            <v-icon color="grey darken-1" small>{{mdiPencilCircleOutline}}</v-icon>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="_delete" @click="$emit('delete')">
          <v-list-item-title>
            <v-icon color="grey darken-1" small>{{mdiDeleteCircleOutline}}</v-icon>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
</template>
<script>
import {mdiDotsVertical,mdiPlusCircleOutline,mdiPencilCircleOutline,mdiDeleteCircleOutline} from "@mdi/js"
export default {
  components: {},
  // type: {level1,topic}
  computed: {},
  data() {
    return {
      mdiDotsVertical,
      mdiPlusCircleOutline,
      mdiPencilCircleOutline,
      mdiDeleteCircleOutline
    };
  },
  name: "ActionPure",
  methods: {},
  mounted() {},
  props: ["_add", "_edit", "_delete"],
};
</script>
