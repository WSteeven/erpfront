<template>
  <q-page padding>
    <div class="text-h6 q-my-md q-ml-md">Gestión de tareas</div>

    <q-card class="custom-shadow">
      <!-- Tabs -->
      <q-tabs v-model="tab" align="justify" narrow-indicator class="q-mb-lg">
        <q-tab name="formulario" label="Formulario" no-caps />
        <q-tab name="listado" label="Listado" no-caps />
      </q-tabs>

      <!-- Tab content -->
      <q-tab-panels
        v-model="tab"
        animated
        transition-prev="scale"
        transition-next="scale"
      >
        <!-- Formulario -->
        <q-tab-panel name="formulario" class="q-py-none">
          <slot name="formulario" />
          <div class="col-12">
            <q-btn label="Enviar" color="primary" type="submit" no-caps></q-btn>
          </div>
        </q-tab-panel>

        <!-- Listado -->
        <q-tab-panel name="listado" class="q-py-none">
          <essential-table
            :configuracionColumnas="configuracionColumnas"
            :datos="listado"
          ></essential-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { configuracionColumnas } from 'pages/tareas/domain/configuracionColumnas'

import EssentialTable from 'src/components/EssentialTable.vue'

export default defineComponent({
  components: { EssentialTable },
  setup() {
    const listado = [
      {
        tarea_jp: 'JP001',
        tarea_cliente: 'ADD878',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'FINALIZADO',
      },
      {
        tarea_jp: 'JP002',
        tarea_cliente: 'ADD879',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'EJECUTANDO',
      },
      {
        tarea_jp: 'JP003',
        tarea_cliente: 'ADD858',
        coordinador: 'MARILÚ JARAMILLO',
        cliente: 'NEDETEL',
        estado: 'CREADO',
      },
    ]
    return { tab: ref('formulario'), listado, configuracionColumnas }
  },
})
</script>
