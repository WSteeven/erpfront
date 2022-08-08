<template>
  <div class="card p-4">
    <div class="d-flex flex-column flex-md-row">
      <!-- Tab buttons -->
      <div
        class="col d-flex flex-md-column flex-row flex-grow-0 tab-button-container"
      >
        <button
          v-for="(_, tab) in tabs"
          :key="tab"
          :class="['tab-button', {active: currentTab === tab}]"
          class="text-nowrap"
          @click="currentTab = tab"
        >
          {{ tab }}
        </button>
      </div>
      <!-- Contenido -->
      <div class="col flex-grow-1 ps-md-4 pt-4 pt-md-2">
        <transition name="fade" mode="out-in">
          <component :is="tabs[currentTab]"></component>
        </transition>
      </div>
    </div>
  </div>
</template>
<script lang="ts" src="./perfilUsuario.page.ts"></script>

<style lang="scss" scoped>
.tab-button-container {
  background-color: #f8f8f8;
  border-radius: 6px;

  .tab-button {
    padding: 8px 10px;
    border-radius: 4px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    // white-space: nowrap;

    &:hover {
      background: $light-gray;
    }

    &.active {
      background: $secondary;
      color: #fff;
      font-weight: bold;
    }
  }
}
</style>
