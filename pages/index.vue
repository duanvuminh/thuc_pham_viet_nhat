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
        <ais-refinement-list attribute="type" :limit="100" />
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
                  ></v-img>
                  <v-img
                    v-else
                    height="5px"
                  ></v-img>
                  <v-row v-if="!item.image_url1" style="height:200px;overflow: hidden;" align="end">
                    <v-col>
                      <v-card-text>
                        <div class="text--primary" style="height: 175px!important;line-height: 25px;overflow: hidden;">
                          {{item.description}}
                        </div>
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
                      attribute="address"
                      :hit="item"
                      class="d-inline-block text-truncate"
                      style="max-width:100%"
                    />
                  </v-card-subtitle>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="orange" text :href="`/items/${item.id}`">Chi tiết</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>
        </ais-hits>

        <ais-pagination :total-pages="5"/>
      </v-col>
    </v-row>
  </ais-instant-search-ssr>
</template>
<script>
import firebase from "firebase";
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
  indexName: "GaoNhat_algolia"
});

export default {
  asyncData({ params }) {
    return instantsearch
      .findResultsState({
        // find out which parameters to use here using ais-state-results
        query: "",
        hitsPerPage: 20,
        disjunctiveFacets: ["type"],
        //disjunctiveFacetsRefinements: { type }
      })
      .then(() => ({
        instantSearchState: instantsearch.getState()
      }));
  },
  beforeCreate() {
    // ここでローディングのインジケータアニメーションを表示すると良い
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$store.commit("setLoginState", true);
      } else {
        this.$store.commit("setLoginState", false);
      }
    });
  },
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
  mixins: [rootMixin],
  methods: {},
  mounted() {
    this.$store.commit("setshowPlus", false);
  }
};
</script>