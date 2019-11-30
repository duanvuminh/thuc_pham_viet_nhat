<template>
  <ais-instant-search-ssr>
    <v-row>
      <v-col cols="12">
        <v-toolbar color="orange accent-1">
          <v-icon class="pr-5" color="purple  accent-3">pets</v-icon>
          <ais-search-box style="flex:1" />
          <!-- <template v-slot:extension>
        <v-spacer></v-spacer>
        <v-btn text>Địa điểm</v-btn>
        <v-btn text>Giá cả</v-btn>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
          </template>-->
        </v-toolbar>
      </v-col>
      <v-col cols="12" md="3">
        <v-toolbar-title>Phân loại</v-toolbar-title>
        <ais-refinement-list
          attribute="type"
          :limit="10"
          searchable
          show-more
          :show-more-limit="50"
          class="ml-2"
        >
          <template
            slot-scope="{items, refine, isShowingMore,toggleShowMore,canToggleShowMore,searchForItems}"
          >
            <v-text-field
              v-if="items.length>10"
              hide-details
              v-model="searhType"
              solo
              label="Tìm loại bài viết"
              prepend-inner-icon="search"
              @input="searchForItems(searhType)"
            ></v-text-field>
            <v-row v-for="item in items" :key="item.value">
              <v-checkbox
                hide-details
                @change="refine(item.value)"
                :label="item.label"
                :value="item.value"
              ></v-checkbox>
              <v-badge style="top:30px" class="pr-1">
                <template v-slot:badge>{{ item.count.toLocaleString() }}</template>
              </v-badge>
            </v-row>
            <v-btn
              text
              @click="toggleShowMore"
              v-show="canToggleShowMore"
            >{{ !isShowingMore ? 'Show more' : 'Show less'}}</v-btn>
          </template>
        </ais-refinement-list>
      </v-col>
      <v-col cols="12" md="8">
        <ais-hits class="mb-5">
          <template slot-scope="{ items }">
            <v-row>
              <v-col v-for="item in items" :key="item.title" cols="12" sm="4">
                <v-card class="mx-auto" max-width="400">
                  <v-img
                    class="orange--text align-end"
                    height="200px"
                    :src="getUrl(item)"
                  ></v-img>
                  <!-- <v-img v-else height="5px"></v-img> -->
                  <!-- <v-row v-if="!item.image_url1" style="height:200px;overflow: hidden;" align="end">
                    <v-col>
                      <v-card-text>
                        <div
                          class="text--primary"
                          style="height: 175px!important;line-height: 25px;overflow: hidden;"
                        >{{item.description}}</div>
                      </v-card-text>
                    </v-col>
                  </v-row> -->
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
                    <v-btn
                      color="orange"
                      text
                      :to="`/detail/${nonAccentVietnamese(item.name)}-${item.id}`"
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
  </ais-instant-search-ssr>
</template>
<script>
import firebase from "firebase";
import getAppRoutes from "~/utils/getRoutes.js";
const isImageUrl = require("is-image-url");

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
  indexName: "dulich"
});

export default {
  asyncData({ params }) {
    return instantsearch
      .findResultsState({
        // find out which parameters to use here using ais-state-results
        query: "",
        hitsPerPage: 20,
        disjunctiveFacets: ["type"],
        filters: `display=1`
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
    return {};
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
  layout: "normal",
  mixins: [rootMixin],
  methods: {
    nonAccentVietnamese(text) {
      return getAppRoutes.nonAccentVietnamese(text);
    },
    getUrl(item) {
      if (item.image_url1) {
        return item.image_url1;
      } else {
        let links = item.description.match(/(https?:\/\/[^\s)]+)/g);
        if (links && links.length > 0) {
          links = links.filter(x => {
            return isImageUrl(x);
          });
          if(links && links.length > 0){
          return links[0];
          }else{
            return "/plane.jpg";
          }
        } else {
          return "/plane.jpg";
        }
      }
    }
  },
  mounted() {}
};
</script>