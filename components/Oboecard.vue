<template>
  <v-card class="mx-auto" elevation="1">
    <div class="d-flex">
    <slot></slot>
    <v-card-text class="pb-0">
      <HtmlParser :content="$md.render(item.vi)" />
    </v-card-text>
    </div>
    <v-card-actions class="pt-0">
      <v-btn v-if="item.id=='duanvuminh@gmail.com'" text color="deep-purple accent-4" small>
        <v-icon left>{{mdiStarOutline}}</v-icon>Offical
      </v-btn>
      <v-btn v-else color="orange" text dark small>{{name}}</v-btn>
      <v-spacer></v-spacer>
      <Like icon="mdi-thumb-up" :path="path" name="liked"></Like>
      <!-- <client-only>
        <social-sharing
          :url="`https://oboemasu.com${$route.path}`"
          :quote="$md.render(item.vi).replace(/<[^>]*>?/gm, '')"
          inline-template
        >
          <div class="ma-2">
            <network network="facebook">
              ♻︎
            </network>
          </div>
        </social-sharing>
      </client-only> -->
    </v-card-actions>
  </v-card>
</template>
<script>
//const HtmlParser = ()=>import("@/components/HtmlParser");
import {mdiStarOutline} from "@mdi/js"
import HtmlParser from "@/components/HtmlParser";
import Like from "@/components/comment/Like";

export default {
  props: ["item", "searchkey", "email"],
  components: {
    HtmlParser,
    Like
  },
  data() {
    return {
      name: null,
      mdiStarOutline
    };
  },
  computed: {
    path(){
      return `kanji/${this.searchkey}/oboe/${this.item.id}`;
    }
  },
  methods: {
  },
  mounted() {
    this.$axios.get(`/api/user?id=${this.item.id}`).then(r => {
      this.name = r.data.name;
    });
  }
};
</script>