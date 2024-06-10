<template>
  <q-dialog v-model="abierto" :maximized="true" :full-width="false">
    <q-card>
      <q-toolbar>
        <q-avatar square>
          <q-icon name="bi-grip-vertical" size="sm" class="q-mr-sm"></q-icon>
        </q-avatar>

        <q-toolbar-title>Vista previa</q-toolbar-title>

        <span class="q-gutter-sm">
          <q-btn
            color="primary"
            dense
            push
            no-caps
            class="q-px-md"
            @click="imprimir()"
          >
            <q-icon name="bi-printer" size="xs" class="q-mr-sm"></q-icon>
            <span>Imprimir</span>
          </q-btn>

          <q-btn
            color="negative"
            dense
            push
            no-caps
            class="q-px-sm"
            icon="close"
            label="Cancelar"
            v-close-popup
            @click="cerrar()"
          />
        </span>
      </q-toolbar>

      <div class="q-pa-md bg-dark alto-fijo-contenedor">
        <div ref="refPDF">
          <div class="q-pa-md bg-white alto-fijo-hoja">
            <q-avatar square>
              <img src="src/assets/logo.png" />
            </q-avatar>
            <span class="text-h6"> CONSTRUCRED </span>

            <div
              class="text-center text-bold mini-texto q-pt-xs q-pb-xs q-mt-md bg-grey-3"
            >
              {{ titulo }}
            </div>

            <table-view
              :configuracion-columnas="configuracionColumnas"
              :datos="datos"
            ></table-view>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import html2pdf from 'html2pdf.js'
import { ref } from 'vue'
import { VisibleModal } from '../application/VisibleModal'
import { ColumnConfig } from '../domain/ColumnConfig'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

// Componentes
import TableView from 'components/tables/view/TableView.vue'

const props = defineProps({
  configuracionColumnas: {
    type: Object as () => ColumnConfig<EntidadAuditable>[],
    required: true,
  },
  datos: {
    type: Array,
    required: true,
  },
  printTable: {
    type: Object as () => VisibleModal,
    required: true,
  },
  titulo: {
    type: String,
  },
})

const refPDF = ref()
const { abierto } = props.printTable.estadoAbierto()

function cerrar() {
  props.printTable.cerrar()
}

function imprimir() {
  const contenido = refPDF.value
  html2pdf()
    .set({
      margin: 0.5,
      filename: 'reporte.pdf',
      image: {
        type: 'jpeg',
        quality: 0.98,
      },
      html2canvas: {
        scale: 3,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'in',
        format: 'a4',
        orientation: 'portrait',
      },
    })
    .from(contenido)
    .save()
    .catch((err) => console.log(err))
}
</script>

<style scoped>
.alto-fijo-contenedor {
  height: calc(100vh - 50px);
}
.alto-fijo-hoja {
  height: calc(100vh - 80px);
}
</style>
