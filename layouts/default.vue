<template>
  <v-app>
    <v-content color="white">
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer app color="cyan" dark>
      <span>&copy; duanvuminh@gmail.com</span>
    </v-footer>
  </v-app>
</template> 

<script>
export default {
  head() {
    const i18nSeo = this.$nuxtI18nSeo();
    return {
      htmlAttrs: {
        title: "Free input tools",
        ...i18nSeo.htmlAttrs
      },
      titleTemplate: `%s - ${this.$t("title")}`,
      title: process.env.site_name || "",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("description")
        },
        ...i18nSeo.meta
      ],
      link: [
              { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
,
        ...i18nSeo.link
      ]
    };
  }
};
</script>
