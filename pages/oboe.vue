<template>
    
</template>
<script>
export default {
    layout:"oboe",
    mounted(){
        this.$axios
        .$post(
          "https://translation.googleapis.com/language/translate/v2?key=AIzaSyCgybxabzEcfCXOeZHVrwVenvrtY7OkV3M",
          {
            q:
              "I've never seen a cow with human legs before!",
            source: "en",
            target: "vi",
            format: "text"
          }
        )
        .then(r => console.log(r));
    }
}
</script>