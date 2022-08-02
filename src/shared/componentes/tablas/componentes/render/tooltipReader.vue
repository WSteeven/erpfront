<template>
  <div
    class="ag-cell-label-container"
    role="presentation"
    @click="ordenarColumna($event)"
  >
    <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
    <div ref="eLabel" :class="generalClass" role="presentation">
      <span ref="eText" class="ag-header-cell-text" role="columnheader">
        <span
          :class="clase"
          :title="tooltip"
          container="body"
          data-placement="top"
          data-toggle="tooltip"
          >{{ text }}</span
        >
      </span>
      <span
        ref="eFilter"
        aria-hidden="true"
        class="ag-header-icon ag-filter-icon ag-hidden"
      >
        <span class="ag-icon ag-icon-filter"></span>
      </span>
      <span
        ref="eSortOrder"
        aria-hidden="true"
        class="ag-header-icon ag-sort-order ag-hidden"
      ></span>
      <span
        v-if="ascSort"
        ref="eSortAsc"
        aria-hidden="true"
        class="ag-header-icon ag-sort-ascending-icon"
      >
        <span class="ag-icon ag-icon-asc"></span>
      </span>
      <span
        v-if="descSort"
        ref="eSortDesc"
        aria-hidden="true"
        class="ag-header-icon ag-sort-descending-icon"
      >
        <span class="ag-icon ag-icon-desc"></span>
      </span>
      <span
        ref="eSortNone"
        aria-hidden="true"
        class="ag-header-icon ag-sort-none-icon ag-hidden"
      >
        <span class="ag-icon ag-icon-none"></span>
      </span>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue"

export default defineComponent({
  setup() {
    const params = ref(null)
    const ascSort = ref(null)
    const descSort = ref(null)
    const noSort = ref(null)
    const clase = ref(null)
    const tooltip = ref(null)
    const text = ref(null)
    const generalClass = ref("")

    clase.value = params.clase ? params.clase : ""
    text.value = params.text ? params.text : ""
    tooltip.value = params.tooltip ? params.tooltip : ""

    generalClass.value = `ag-header-cell-label ${
      params.value.column &&
      params.value.column.colDef &&
      params.value.column.colDef.headerClass
        ? params.value.column.colDef.headerClass
        : ""
    }`

    params.value.enableSorting
      ? params.value.column.addEventListener(
          "sortChanged",
          onSortChanged.bind(this)
        )
      : null

    const onSortChanged = () => {
      ascSort.value = descSort.value = noSort.value = false
      if (params.value.column.isSortAscending()) {
        ascSort.value = true
      } else if (params.value.column.isSortDescending()) {
        descSort.value = true
      } else {
        noSort.value = true
      }
    }

    const ordenarColumna = (event) => {
      if (params.enableSorting) {
        ascSort.value = descSort.value = noSort.value = false
        if (params.value.column.isSortAscending()) {
          onSortRequested("desc", event)
          descSort.value = true
        } else if (params.column.isSortDescending()) {
          onSortRequested("", event)
          noSort.value = true
        } else {
          onSortRequested("asc", event)
          ascSort.value = true
        }
      }
    }

    const onSortRequested = (order, event) => {
      params.value.setSort(order, event.shiftKey)
    }
    return {
      onSortChanged,
      ordenarColumna,
      onSortRequested,
    }
  },
})
</script>
