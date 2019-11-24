<template>
  <ais-instant-search-ssr>
    <v-row>
      <v-col cols="12">
        <v-toolbar color="orange accent-1">
          <v-icon class="pr-5" color="purple  accent-3">pets</v-icon>
          <ais-search-box style="flex:1" class="mr-1" />
          <!-- <template v-slot:extension>
        <v-spacer></v-spacer>
        <v-btn text>Địa điểm</v-btn>
        <v-btn text>Giá cả</v-btn>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
          </template>-->
          <v-btn icon @click="dialog=!dialog">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>
      </v-col>
      <v-col cols="12" md="3">
        <ais-refinement-list attribute="type" :limit="100" />
        <ais-refinement-list attribute="display" :limit="100" />
      </v-col>
      <v-col cols="12" md="8">
        <ais-hits class="mb-5">
          <template slot-scope="{ items }">
            <v-row>
              <v-col v-for="item in items" :key="item.title" cols="12" sm="4" md="3" lg="3" xl="3">
                <v-card class="mx-auto" max-width="400">
                  <v-img
                    v-if="item.image_url1"
                    class="orange--text align-end"
                    height="200px"
                    :src="item.image_url1"
                    contain
                  ></v-img>
                  <v-img v-else height="5px"></v-img>
                  <v-row v-if="!item.image_url1" style="height:200px;overflow: hidden;" align="end">
                    <v-col>
                      <v-card-text>
                        <div
                          class="text--primary"
                          style="height: 175px!important;line-height: 25px;overflow: hidden;"
                        >{{item.description}}</div>
                      </v-card-text>
                    </v-col>
                  </v-row>
                  <v-card-title>
                    <ais-highlight
                      attribute="name"
                      :hit="item"
                      class="d-inline-block text-truncate"
                      style="max-width:100%"
                    />
                  </v-card-title>
                  <v-card-subtitle class="pb-0">
                    <ais-highlight
                      attribute="seo"
                      :hit="item"
                      class="d-inline-block text-truncate"
                      style="max-width:100%"
                    />
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="orange" text :href="`/auth/edit/${nonAccentVietnamese(item.name)}-${item.id}`">Sửa</v-btn>
                    <v-btn
                      color="orange"
                      text
                      :href="`/auth/detail/${nonAccentVietnamese(item.name)}-${item.id}`"
                    >Chi tiết</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </ais-hits>

        <ais-pagination :total-pages="5" />
      </v-col>
    </v-row>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-menu
                  ref="menu1"
                  v-model="menu1"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="dateFormatted"
                      label="Ngày tạo"
                      persistent-hint
                      prepend-icon="event"
                      @blur="date = parseDate(dateFormatted)"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12">
                <v-text-field label="Email*" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </ais-instant-search-ssr>
</template>
<script>
import firebase from "firebase";
import getAppRoutes from "~/utils/getRoutes.js";

import {
  AisInstantSearchSsr,
  AisRefinementList,
  AisHits,
  AisHighlight,
  AisSearchBox,
  AisPagination,
  AisPoweredBy,
  createInstantSearch
} from "vue-instantsearch";
import algoliasearch from "algoliasearch/lite";
const searchClient = algoliasearch(
  "N7UFARQ48L",
  "8d219c45506c851ab82563e0297891dd"
);
const { instantsearch, rootMixin } = createInstantSearch({
  searchClient,
  indexName: "muaban_phuquoc"
});

export default {
  asyncData({ params, store }) {
    return instantsearch
      .findResultsState({
        // find out which parameters to use here using ais-state-results
        query: "",
        hitsPerPage: 20,
        disjunctiveFacets: ["type","display"],
        filters: `creator_id:${store.state.user.email}`
        //disjunctiveFacetsRefinements: { type }
      })
      .then(() => ({
        instantSearchState: instantsearch.getState()
      }));
  },
  beforeCreate() {},
  beforeMount() {
    instantsearch.hydrate(this.instantSearchState);
  },
  components: {
    AisInstantSearchSsr,
    AisRefinementList,
    AisHits,
    AisHighlight,
    AisSearchBox,
    AisPoweredBy,
    AisPagination
  },
  data() {
    return {
      email: "",
      dialog: false,
      date: new Date().toISOString().substr(0, 10),
      dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      menu1: false,
      menu2: false
    };
  },
  head() {
    return {
      link: [
        {
          rel: "stylesheet",
          href:
            "https://cdn.jsdelivr.net/npm/instantsearch.css@7.3.1/themes/algolia-min.css"
        }
      ]
    };
  },
  layout: "admin",
  mixins: [rootMixin],
  methods: {
    nonAccentVietnamese(text) {
      return getAppRoutes.nonAccentVietnamese(text);
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    }
  },
  mounted() {},
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date);
    }
  }
};
</script>