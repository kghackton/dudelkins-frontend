<template>
    <div class="pa-4">
      <TimeFilter />
      <v-select multiple
        v-model="regionFilter"
        :items="regionsItems"
        item-value="name"
        item-text="title"
        label="Округ"
      ></v-select>
      <v-select multiple
        v-model="categoriesFilter"
        :items="categoriesItems"
        item-value="id"
        item-text="title"
        label="Категория заявок"
      ></v-select>
      <v-select multiple
        v-model="anomalyClassesFilter"
        :items="anomalyClassesItems"
        item-value="id"
        item-text="title"
        label="Классы аномальности"
      ></v-select>
    </div>
</template>

<script>
    import { mapGetters, mapMutations } from "vuex";
    import TimeFilter from "./TimeFilter";
    import regions from "@/plugins/regions.json"
    import defects from "@/assets/defects.json"
    import labels from "@/plugins/labels.json"
    export default {
        name: "Filters",
        components: { TimeFilter },
        data: () => ({
          regionsItems: Object.values(regions),
        }),
        computed: {
          ...mapGetters(['FILTERS']),
          categoriesItems() {
            let categories = []
            for (let defect in defects) {
              categories.push({ id: defect, title: defects[defect] })
            }
            return categories
          },
          anomalyClassesItems() {
            let anomalyClasses = []
            for (let label in labels) {
              anomalyClasses.push({ id: label, title: labels[label].text })
            }
            return anomalyClasses
          },
          regionFilter: {
            get() { return this.FILTERS.region },
            set(value) { this.FILTER_REGION_SET(value); }
          },
          categoriesFilter: {
            get() { return this.FILTERS.categories },
            set(value) { this.FILTER_CATEGORIES_SET(value); }
          },
          anomalyClassesFilter: {
            get() { return this.FILTERS.anomalyClasses },
            set(value) { this.FILTER_ANOMALY_SET(value); }
          }
        },
        methods: {
          ...mapMutations(['FILTER_REGION_SET', 'FILTER_CATEGORIES_SET', 'FILTER_ANOMALY_SET'])
        }
    }
</script>

<style scoped>

</style>