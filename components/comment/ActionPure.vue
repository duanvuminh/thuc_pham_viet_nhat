<template>
    <v-menu bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon color="grey darken-1" small>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item v-if="_add" @click="$emit('add')">
          <v-list-item-title>
            <v-icon color="grey darken-1" small>mdi-plus-circle-outline</v-icon>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="_edit" @click="$emit('edit')">
          <v-list-item-title>
            <v-icon color="grey darken-1" small>mdi-pencil-circle-outline</v-icon>
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="_delete" @click="$emit('delete')">
          <v-list-item-title>
            <v-icon color="grey darken-1" small>mdi-delete-circle-outline</v-icon>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
</template>
<script>
export default {
  components: {},
  // type: {level1,topic}
  computed: {},
  data() {
    return {};
  },
  name: "ActionPure",
  methods: {},
  mounted() {},
  props: ["_add", "_edit", "_delete"],
};
</script>
