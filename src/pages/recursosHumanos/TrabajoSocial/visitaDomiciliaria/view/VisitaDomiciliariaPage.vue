<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnas"
    titulo-pagina="Ficha Socioeconomica"
    :tab-options="tabOptions"
    :tab-defecto="tabDefecto"
    :filtrar="filtrarListadoVisitas"
    ajustar-celdas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <!-- 7. Situación Sociofamiliar -->
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="2. SITUACIÓN SOCIOFAMILIAR"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <composicion-familiar :datos="visita.composicion_familiar" :accion="accion"/>
        </q-expansion-item>

      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./VisitaDomiciliariaPage.ts"/>
<script setup lang="ts">
</script>
