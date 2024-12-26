<template>
  <q-page>
    <q-btn
      v-if="tabsPage != '1'"
      outline
      color="grey-8"
      icon="bi-chevron-left"
      class="q-mt-md q-ml-md"
      no-caps
      rounded
      @click="regresar()"
      >Regresar</q-btn
    >
    <q-tab-panels
      v-model="tabsPage"
      animated
      transition-prev="slide-right"
      transition-next="slide-left"
      keep-alive
      class="bg-transparent"
    >
      <!-- Formulario -->
      <q-tab-panel name="1"><slot name="tab1" /></q-tab-panel>
      <q-tab-panel name="2"><slot name="tab2" /></q-tab-panel>
      <q-tab-panel name="3"><slot name="tab3" /></q-tab-panel>
      <q-tab-panel name="4"><slot name="tab4" /></q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script lang="ts" setup>
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ContenedorSimpleMixin } from '../application/ContenedorSimpleMixin'

const props = defineProps({
  mixin: {
    type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
    required: true
  },
  regresarPrincipio: {
    type: Boolean,
    default: false
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
