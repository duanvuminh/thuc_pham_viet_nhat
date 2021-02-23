<template>
  <div>
    <v-avatar :size="size" v-if="photoURL" class="ma-2">
      <img :src="photoURL" :alt="name" />
    </v-avatar>
    <v-avatar :size="size" v-else-if="name" color="indigo" class="ma-2">
      <span class="white--text headline">{{name?name.split("")[0]:"^_^"}}</span>
    </v-avatar>
    <v-avatar :size="size" v-else class="ma-2">
      <img :src="require('@/assets/avatar.png')" alt="default" />
    </v-avatar>
  </div>
</template>
<script>
export default {
  mounted() {
    this.$axios
      .get(`/api/user?id=${this.email}`, { useCache: true })
      .then((r) => {
        let { name, email, photoURL } = r.data;
        this.name = name;
        this.photoURL = photoURL;
      });
  },
  data() {
    return {
      name: "",
      photoURL: "",
    };
  },
  name: "avarta",
  props: ["size", "email"],
};
</script>
