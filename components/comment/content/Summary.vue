<template>
  <v-card>
    <v-container>
      <v-textarea
            placeholder="Hãy nhập các link ảnh"
            auto-grow
            v-model="text"
          >
      </v-textarea>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="$emit('close-timeline')">Close</v-btn>
        <v-btn color="primary" text @click="$emit('extension',{data:text})">Thêm</v-btn>
      </v-card-actions>
    </v-container>
  </v-card>
</template>

<script>
export default {
  components: {
  },
  data: () => ({
    text:null
  }),
  mounted() {
  },
  methods: {
  },
  props: ["items"],
};
</script>