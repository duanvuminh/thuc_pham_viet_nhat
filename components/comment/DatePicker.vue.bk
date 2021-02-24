<template>
  <v-col cols="6" class="mb-1 py-0 pr-3 ml-3">
    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field v-show="false " v-model="date"></v-text-field>
        <v-chip
          class="ma-2"
          label
          x-small
          close
          :close-icon="date?'mdi-close':'mdi-menu-down'"
          @click:close="date=null"
          outlined
          v-on="on"
        >
          <v-icon left x-small>event</v-icon>
          {{date?date:'Chọn ngày xem'}}
        </v-chip>
      </template>
      <v-date-picker
        ref="picker"
        v-model="date"
        :max="new Date().toISOString().substr(0, 10)"
        min="1950-01-01"
        @change="save"
        type="date"
      ></v-date-picker>
    </v-menu>
  </v-col>
</template>
<script>
export default {
  data: () => ({
    date: null,
    menu: false
  }),
  watch: {
    // menu(val) {
    //   val && setTimeout(() => (this.$refs.picker.activePicker = "YEAR"));
    // },
    date(val) {
      this.$emit("datechange", this.formatDate(val));
    }
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date);
    },
    formatDate(date) {
      if (!date) return null;
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return `${year}${month}${day}`;
    }
  }
};
</script>