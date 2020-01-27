<template>
  <v-row>
    <v-col cols="12" class="mb-1 py-0">
      <v-textarea
        label="Bạn hãy viết gì đó"
        :rows="rows"
        auto-grow
        dense
        v-model="text"
        hide-details
        @click="showAction=true"
      >
        <div slot="prepend">
          <avartar :size="size" :email="email"></avartar>
        </div>
      </v-textarea>
    </v-col>
    <v-col cols="12" class="d-flex ma-0 pa-0" v-if="never_hide">
      <template v-if="showAction">
        <v-spacer></v-spacer>
        <v-btn text small @click="reset">Huỷ</v-btn>
        <v-btn text small>Thêm</v-btn>
      </template>
    </v-col>
    <v-col cols="12" class="d-flex ma-0 pa-0" v-else>
      <v-spacer></v-spacer>
      <v-btn text small @click="$emit('setShowAdd', false)">Huỷ</v-btn>
      <v-btn text small>Thêm</v-btn>
    </v-col>
  </v-row>
</template>
<script>
const avartar = () => import("./Avartar");
export default {
  components: {
    avartar
  },
  data() {
    return {
      show: true,
      email: this.$store.state.user.email,
      showAction: false,
      text: ""
    };
  },
  methods: {
    reset() {
      this.text = "";
      this.showAction = false;
    }
  },
  props: ["size", "rows", "never_hide"]
};
</script>