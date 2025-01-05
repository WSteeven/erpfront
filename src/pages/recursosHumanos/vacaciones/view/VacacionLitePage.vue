<template>
  <div class="row q-col-gutter-sm q-py-md">
    <!-- Dias de vacaciones -->
    <div class="col-12 col-md-2 col-sm-3">
      <label class="q-mb-sm block">Días de Vacaciones</label>
      <q-input v-model="vacacion.dias" disable readonly outlined dense>
      </q-input>
    </div>
    <!-- Dias tomados -->
    <div class="col-12 col-md-2 col-sm-3">
      <label class="q-mb-sm block">Días Tomados</label>
      <q-input
        type="number"
        v-model="vacacion.dias_tomados"
        disable
        readonly
        outlined
        dense
      >
      </q-input>
    </div>

    <!-- Dias disponibles -->
    <div class="col-12 col-md-2 col-sm-3">
      <label class="q-mb-sm block">Días Disponibles</label>
      <q-input
        type="number"
        v-model="vacacion.dias_disponibles"
        disable
        readonly
        outlined
        dense
      >
      </q-input>
    </div>
    <!-- Completadas -->
    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block">Vacaciones Tomadas</label>
      <q-toggle
        :label="vacacion.completadas ? 'SI' : 'NO'"
        v-model="vacacion.completadas"
        color="primary"
        keep-color
        icon="bi-check2-circle"
        unchecked-icon="clear"
        disable
      />
    </div>

    <!-- Completadas -->
    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block">Optó por cobrar vacaciones</label>
      <q-toggle
        :label="vacacion.opto_pago ? 'SI' : 'NO'"
        v-model="vacacion.opto_pago"
        color="primary"
        disable
        keep-color
        icon="bi-check2-circle"
        unchecked-icon="clear"
      />
    </div>
    <div class="col-12">
      <essential-table
        titulo="Registro de días de vacaciones tomados"
        :datos="vacacion.detalles"
        :configuracion-columnas="configuracionColumnasDetallesVacacion"
        :alto-fijo="false"
        ajustar-celdas
        :mostrar-header="false"
        :permitir-consultar="false"
        :permitir-editar="false"
        :permitir-eliminar="false"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { configuracionColumnasDetallesVacacion } from 'recursosHumanos/vacaciones/modules/detallesVacaciones/domain/configuracionColumnasDetallesVacacion.ts'
import { Vacacion } from 'recursosHumanos/vacaciones/domain/Vacacion'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps({
  vacacion: {
    type: Object as () => Vacacion,
    required: true
  }
})

const vacacion = props.vacacion
</script>
