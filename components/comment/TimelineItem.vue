<template>
  <v-timeline-item :color="item.color" fill-dot :small="item.small">
    <span slot="opposite">{{item.title}}</span>
    <v-card :color="item.color">
      <v-card-text>
        <template v-if="!editMode">
          <HtmlParser v-if="item.content" :content="$md.render(item.content)"></HtmlParser>
        </template>
        <template v-else>
          <v-textarea v-model="item.content" outlined label="Nội dung học"></v-textarea>
          <v-text-field v-model="item.title" outlined label="Note"></v-text-field>
          <v-color-picker v-model="item.color" hide-inputs></v-color-picker>
          <v-checkbox v-model="item.small" label="sub timeline"></v-checkbox>
        </template>
      </v-card-text>
      <v-card-actions v-if="show">
        <template v-if="!editMode">
          <v-btn icon @click="$emit('add')">
            <v-icon small>mdi-plus</v-icon>
          </v-btn>
          <v-btn icon @click="$emit('xoa')">
            <v-icon small>mdi-minus</v-icon>
          </v-btn>
          <v-btn icon @click="editMode=true">
            <v-icon small>mdi-pen</v-icon>
          </v-btn>
        </template>
        <template v-else>
          <v-btn icon @click="editMode=false;$emit('edit',item)">
            <v-icon small>mdi-check</v-icon>
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-timeline-item>
</template>

<script>
export default {
  components: {
    HtmlParser: () => import("@/components/HtmlParser"),
  },
  computed: {
    show() {
      if (this.creator || this.$store.state.user.email == this.creator) {
        return true;
      } else {
        return false;
      }
    },
  },
  data: () => ({
    editMode: false,
  }),
  mounted() {},
  props: ["item", "creator"],
};
</script>