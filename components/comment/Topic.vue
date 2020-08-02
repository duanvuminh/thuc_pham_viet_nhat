<template>
  <v-list-item class="px-2" @click="$emit('setLevel1',item.id);">
    <v-list-item-avatar v-if="item.name=='home'" color="red">
      <v-icon>mdi-home</v-icon>
    </v-list-item-avatar>
    <v-list-item-avatar v-else-if="item.name=='mypage'" color="blue">
      <v-icon>mdi-bookmark</v-icon>
    </v-list-item-avatar>
    <v-list-item-avatar v-else color="grey darken-1">{{item.name}}</v-list-item-avatar>
  </v-list-item>
</template>
<script>
export default {
  components: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {},
  props: ["item"],
  computed: {},
};
</script>
