<template>
  <component :is="fullscreen ? 'q-page' : 'div'">
    <q-btn
      v-if="tabsPage != '1' && mostrarRegresar"
      outline
      color="grey-8"
      icon="bi-chevron-left"
      class="q-mt-md q-ml-md"
      no-caps
      rounded
      @click="regresar()"
      >Regresar</q-btn
    >

    <!-- Tabs -->
    <q-tabs
      v-if="tabsOptions"
      v-model="tabsPage"
      align="left"
      switch-indicator
      active-class="tab-active"
      indicator-color="transparent"
      dense
    >
      <q-tab
        v-for="(tab, index) in tabsOptions"
        :key="index + 1"
        :name="(index + 1) + ''"
        :label="tab"
        no-caps
      />
    </q-tabs>

    <q-tab-panels
      v-model="tabsPage"
      animated
      transition-prev="slide-right"
      transition-next="slide-left"
      keep-alive
      class="bg-desenfoque rounded-tabpanel"
    >
      <!-- Formulario -->
      <q-tab-panel name="1"><slot name="tab1" /></q-tab-panel>
      <q-tab-panel name="2"><slot name="tab2" /></q-tab-panel>
      <q-tab-panel name="3"><slot name="tab3" /></q-tab-panel>
      <q-tab-panel name="4"><slot name="tab4" /></q-tab-panel>
    </q-tab-panels>
  </component>
</template>

<script lang="ts" setup>
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ContenedorSimpleMixin } from '../application/ContenedorSimpleMixin'

const props = defineProps({
  mixin: {
    // Se usa solo para desplazarse
    type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
    required: true
  },
  regresarPrincipio: {
    type: Boolean,
    default: false
  },
  fullscreen: {
    type: Boolean,
    default: true
  },
  tabsOptions: {
    type: Array as () => string[],
    required: false
  },
  mostrarRegresar: {
    type: Boolean,
    default: true
  }
})

const { tabsPage } = props.mixin.useReferencias()

const regresar = () => {
  if (props.regresarPrincipio) {
    tabsPage.value = '1'
  } else {
    const tab = Number(tabsPage.value)
    tabsPage.value = tab > 1 ? tab - 1 + '' : '1'
  }
}
</script>
