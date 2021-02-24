<template>
  <v-timeline-item :color="item.color" fill-dot :small="item.small">
    <span slot="opposite">{{ item.title }}</span>
    <v-card :color="item.color">
      <div class="d-flex">
        <v-card-text class="pa-1">
          <template v-if="!editMode">
            <HtmlParser
              v-if="item.content"
              :content="$md.render(item.content)"
            ></HtmlParser>
          </template>
          <template v-else>
            <v-textarea
              v-model="item.content"
              outlined
              label="Nội dung học"
            ></v-textarea>
            <v-text-field
              v-model="item.title"
              outlined
              label="Note"
            ></v-text-field>
            <v-color-picker
              v-model="item.color"
              hide-inputs
              width="150"
            ></v-color-picker>
            <v-checkbox v-model="item.small" label="sub timeline"></v-checkbox>
          </template>
        </v-card-text>
        <v-spacer></v-spacer>
        <div>
          <v-menu bottom left v-if="show && controller">
            <template v-slot:activator="{ on, attrs }">
              <v-btn dark icon v-bind="attrs" v-on="on">
                <v-icon small>{{ mdiDotsVertical }}</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item dense>
                <v-btn icon @click="$emit('add')">
                  <v-icon small>{{ mdiPlus }}</v-icon>
                </v-btn>
                <v-btn icon @click="$emit('xoa')">
                  <v-icon small>{{ mdiMinus }}</v-icon>
                </v-btn>
                <v-btn icon @click="editMode = true">
                  <v-icon small>{{ mdiPen }}</v-icon>
                </v-btn>
              </v-list-item>
            </v-list>
          </v-menu>
          <template v-if="editMode">
            <v-btn
              icon
              @click="
                editMode = false;
                $emit('edit', item);
              "
            >
              <v-icon small>{{ mdiCheck }}</v-icon>
            </v-btn>
          </template>
        </div>
      </div>
    </v-card>
  </v-timeline-item>
</template>

<script>
import { mdiCheck, mdiPen, mdiMinus, mdiPlus, mdiDotsVertical } from "@mdi/js";
export default {
  components: {
    HtmlParser: () => import("@/components/HtmlParser"),
  },
  computed: {
    show() {
      if (!this.creator || this.$store.state.user.email == this.creator) {
        return true;
      } else {
        return false;
      }
    },
  },
  data: () => ({
    editMode: false,
    mdiCheck,
    mdiPen,
    mdiMinus,
    mdiPlus,
    mdiDotsVertical,
  }),
  mounted() {},
  props: ["item", "creator", "controller"],
};
</script>