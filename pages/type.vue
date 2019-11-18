<template>
  <main>
    <h1>{{ $t('welcome') }}</h1>

    <nuxt-link
      v-if="$i18n.locale !== 'en'"
      :to="switchLocalePath('en')"
    >
      English
    </nuxt-link>

    <nuxt-link
      v-if="$i18n.locale !== 'ja'"
      :to="switchLocalePath('ja')"
    >
      Español
    </nuxt-link>
  </main>
</template>
<script>
export default {
}
</script>
