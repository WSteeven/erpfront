<template>
  <q-dialog v-model="abierto" :maximized="false" :full-width="false">
    <q-card class="bg-body">
      <q-toolbar class="bg-body" rounded>
        <q-avatar square>
          <img src="~assets/logo.png" />
        </q-avatar>

        <q-toolbar-title class="text-primary text-subtitle1"
          ><span>{{ 'Archivos' }}</span></q-toolbar-title
        >

        <div class="row q-gutter-x-sm">
          <q-btn
            round
            dense
            unelevated
            color="red"
            size="sm"
            @click="() => visibleModal.cerrar()"
          >
            <q-icon name="bi-x-lg" size="14px"></q-icon>
            <q-tooltip class="bg-dark">Cerrar</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>

      <div class="row q-ma-md bg-desenfoque border-white rounded q-pa-md">
        <!-- <div class="col-12">Visor de archivos</div> -->
        <div class="col-12">
          <div v-for="(archivo, index) in archivos" :key="index" class="row">
            <div class="col-12">
              <q-btn
                class="bg-white text-primary q-mb-xs full-width"
                :href="archivo.ruta ?? '#'"
                target="_blank"
                unelevated
              >
                <q-icon name="bi-archive" class="q-mr-sm" size="xs"></q-icon>
                {{ archivo.nombre }}
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

// Components
import { Archivo } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/domain/Archivo'
import { VisibleModal } from '../application/VisibleModal'

const props = defineProps({
  archivos: Array as () => Archivo[],
  visibleModal: {
    type: Object as () => VisibleModal,
    required: true,
  },
})

const { abierto } = props.visibleModal.estadoAbierto()
</script>
