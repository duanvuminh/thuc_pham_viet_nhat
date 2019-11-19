<template>
  <v-row>
    <h1>{{ $t('welcome') }}</h1>
    <v-col cols="12">
       <v-textarea
          solo
          name="input-10-4"
          label="type somethings"
          v-model="text"
        ></v-textarea>
      </v-col>
    <nuxt-link
      :to="switchLocalePath('vi')"
    >
    Tiếng Việt
    </nuxt-link>|
    <nuxt-link
      :to="switchLocalePath('ja')"
    >
      日本語
    </nuxt-link>
  </v-row>
</template>
<script>
export default {
  data(){
    return {
      text:""
    }
  },
  watch:{
    text(){
      alert(this.$i18n.locale);
      this.$axios.$get(
          "http://www.google.com/transliterate?langpair=en|ja&text=haha"
        )
        .then(r => console.log(r));
    }
  }
}
</script>
