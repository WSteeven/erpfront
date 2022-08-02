<template>
  <div class="navbar navbar-light position-sticky sticky-top d-flex">
    <i class="bi bi-search"></i>
    <input
      ref="searchInput"
      class="search"
      type="text"
      placeholder="¿Qué deseas encontrar?"
      aria-label="Search"
    />
    <i class="bi bi-x-lg close" @click="toggleSearchBar"></i>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, Ref, ref} from "vue"
import {useStore} from "vuex"

export default defineComponent({
  name: "Searchbar",
  setup() {
    const store = useStore()
    const toggleSearchBar = () => store.dispatch("searchbar/toggleSearchBar")

    const searchInput: Ref = ref(null)
    onMounted(() => {
      searchInput.value?.focus()
    })
    return {searchInput, toggleSearchBar}
  },
})
</script>

<style lang="scss" scoped>
div.navbar {
  padding: 12px 20px;

  i.close {
    cursor: pointer;
  }

  .search {
    border: none;
    padding: 10px;
    color: $texto;
    background-color: rgba($color: #000000, $alpha: 0);

    &:focus {
      outline: none;
    }
  }
}
</style>
