<template>
  <v-row justify="center">
    <Search />
    <v-col cols="12">
      <HtmlParser :content="$md.render(introdue)"/>
    </v-col>
  </v-row>
</template>
<script>
const Search =()=> import("@/components/nihongo/Search");
const HtmlParser =()=> import("@/components/HtmlParser");
export default {
  components: {
    Search,
    HtmlParser
  },
  data() {
    return {
      introdue: ` 
#### Cách để nhớ kanji dễ dàng hơn
* [Kanji Primitive Elements](/main)
* [awesome 日本語](/awesome)
      `
    };
  },
  layout: "oboe",
  methods: {
    
  },
  mounted() {
  }
};
</script>