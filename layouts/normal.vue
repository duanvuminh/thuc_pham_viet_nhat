<template>
  <v-app light>
    <v-app-bar flat app>
      <v-container>
        <v-layout>
          <v-btn icon to="/" class="align-self-center">
            <v-icon>mdi-home</v-icon>
          </v-btn>
          <v-btn text to="/items" class="align-self-center">View</v-btn>
          <v-spacer />
          <v-btn v-if="loggedIn" text to="/logout" class="align-self-center">Logout</v-btn>
          <v-btn v-else text to="/login" class="align-self-center">Login</v-btn>
        </v-layout>
      </v-container>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Hướng dẫn cách tạo bài viết</v-toolbar-title>
            </v-toolbar>
            <v-row class="pa-5">
              <v-col cols="12" md="6">
                <v-textarea no-resize auto-grow name="input-7-4" v-model="content" readonly></v-textarea>
              </v-col>
              <v-col cols="12" md="6">
                <v-card class="elevation-1">
                  <div v-html="$md.render(content)" class="pa-2"></div>
                </v-card>
              </v-col>
            </v-row>>
          </v-card>
        </v-dialog>
      </v-container>
    </v-content>
  </v-app>
</template> 

<script>
export default {
  data() {
    return {
      dialog: false,
      content: `# h1 Thẻ tiêu đề
## h2 Thẻ tiêu đề nhỏ hơn
### h3 Thẻ tiêu đề nhỏ hơn nữa

Dòng 1 - 2 dấu cách để xuống dòng   
Dòng 2

**In đậm**

__In đậm__

*In nghiêng*

_In nghiêng_

~~Gạch ngang chữ~~

## Lists
Tạo danh sách với + - hoặc * phía sau là dấu cách
+ apple
+ banana
  1. France banana
  2. VietName banana

## Links
[vue-markdown](https://github.com/miaolz123/vue-markdown)


## Images
![Minion](https://miaolz123.github.io/vue-markdown/dist/img/minion.png)

### Emojies
> Các icon từ điện thoại
 `
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.loggedIn;
    }
  }
};
</script>
