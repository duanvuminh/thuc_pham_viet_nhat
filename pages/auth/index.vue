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
        </v-toolbar>
      </v-col>
      <v-col cols="12" md="2">
        <v-toolbar-title>Bài viết đợi duyệt</v-toolbar-title>
        <ais-refinement-list attribute="display" class="pb-5 ml-2">
          <!-- <a
            slot="item"
            slot-scope="{ item, refine, createURL }"
            :href="createURL(item.value)"
            :style="{ fontWeight: item.isRefined ? 'bold' : '' }"
            @click.prevent="refine(item.value)"
          >
            <ais-highlight attribute="item" :hit="item" />
            ({{ item.count.toLocaleString() }})
          </a>-->
          <template slot-scope="{ items, refine }">
            <v-row v-for="item in items" :key="item.value">
              <v-checkbox
                hide-details
                @change="refine(item.value)"
                :label="transformItems(item)"
                :value="item.value"
              ></v-checkbox>
              <v-badge v-if="item.label=='false'" style="top:20px" color="orange">
                <template v-slot:badge>{{ item.count.toLocaleString() }}</template>
                <v-icon>mdi-bell</v-icon>
              </v-badge>
              <v-badge v-else style="top:30px">
                <template v-slot:badge>{{ item.count.toLocaleString() }}</template>
              </v-badge>
            </v-row>
          </template>
        </ais-refinement-list>
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
      <v-col cols="12" md="10">
        <ais-hits class="mb-5">
          <template slot-scope="{ items }">
            <v-row>
              <v-col v-for="item in items" :key="item.title" cols="12" sm="4">
                <v-card class="mx-auto" max-width="400">
                  <v-img
                    v-if="item.image_url1"
                    class="orange--text align-end"
                    height="200px"
                    :src="item.image_url1"
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
                  <v-card-actions class="flex-wrap">
                    <v-spacer></v-spacer>
                    <template v-if="role=='admin'">
                      <v-switch
                        label="Show"
                        v-model="item.display"
                        @change="tonggleItem(item)"
                        class="pt-3"
                      ></v-switch>
                      <v-btn color="orange" text @click="deleteItem(item)">Xoá</v-btn>
                    </template>
                    <v-btn
                      color="orange"
                      text
                      :to="`/auth/edit/${nonAccentVietnamese(item.name)}-${item.id}`"
                    >Sửa</v-btn>
                    <v-btn
                      color="orange"
                      text
                      :to="`/auth/detail/${nonAccentVietnamese(item.name)}-${item.id}`"
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

const algoliaAdmin = require("algoliasearch");

const client = algoliaAdmin("N7UFARQ48L", "8d219c45506c851ab82563e0297891dd");
const indexAlgolia = client.initIndex("dulich");

export default {
  async asyncData({ params, store }) {
    let email = store.state.user.email;
    let role = "";
    await firebase
      .app()
      .firestore()
      .collection("Users")
      .where("email", "==", email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          role = doc.data().role;
        });
      });
    return instantsearch
      .findResultsState({
        // find out which parameters to use here using ais-state-results
        query: "",
        hitsPerPage: 20,
        disjunctiveFacets: ["type", "display"],
        filters: role == "admin" ? "" : `creator_id:${store.state.user.email}`
        //disjunctiveFacetsRefinements: { type }
      })
      .then(() => ({
        instantSearchState: instantsearch.getState()
      }));
  },
  beforeCreate() {
    this.email = this.$store.state.user.email;
    firebase
      .app()
      .firestore()
      .collection("Users")
      .where("email", "==", this.email)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // doc.data() is never undefined for query doc snapshots
          //console.log(doc.id, " => ", doc.data());
          this.role = doc.data().role;
        });
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
    return {
      email: "",
      role: "",
      searhType: ""
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
    transformItems(item) {
      console.log(item);
      return item.label == "true" ? "Đã duyệt" : "Chưa duyệt";
    },
    nonAccentVietnamese(text) {
      return getAppRoutes.nonAccentVietnamese(text);
    },
    tonggleItem(item) {
      firebase
        .firestore()
        .collection("dulich")
        .doc(item.id)
        .set(
          {
            display: item.display
          },
          { merge: true }
        )
        .then(r => {
          const objects = {
            objectID: item.id,
            date_edit: new Date(),
            display: item.display
          };
          indexAlgolia.partialUpdateObject(objects, (err, content) => {
            // console.log(content);
          });
        });
    },
    deleteItem(item) {
      firebase
        .firestore()
        .collection("dulich")
        .doc(item.id)
        .delete()
        .then(r => {
          indexAlgolia.deleteObject(item.id, (err, { taskID }) => {
            indexAlgolia.waitTask(taskID, () => {
              window.location.reload(true);
            });
          });
        });
    }
  },
  mounted() {},
  watch: {}
};
</script>