<template>
  <v-list-item v-show="show" class="px-2" @click="$emit('set-level1',item.id);" v-slot:default="{ active }">
    <v-list-item-avatar v-if="item.name=='home'" :color="active?'blue darken-1':'grey darken-1'">
      <v-icon>mdi-home</v-icon>
    </v-list-item-avatar>
    <template v-else-if="item.name=='mypage'">
      <v-list-item-avatar :color="active?'blue darken-1':'grey darken-1'">
        <v-icon>mdi-bookmark</v-icon>
      </v-list-item-avatar>
    </template>
    <v-list-item-avatar v-else :color="active?'blue darken-1':'grey darken-1'">{{item.name}}</v-list-item-avatar>
  </v-list-item>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  name: "topic",
  methods: {},
  mounted() {},
  props: ["item"],
  computed: {
    show() {
      if (this.item.name == "mypage") {
        if (this.$store.state.user.email) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
  },
};
</script>
