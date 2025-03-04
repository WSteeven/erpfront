<template>
  <div class="row q-col-gutter-sm q-py-md q-mb-md">
    <div class="col-12 col-md-3">
      <voice-input
        v-model="entidad.nombre_completo"
        :v$="v$"
        key-error="nombre_completo"
        label="Nombre completo"
        placeholder="OBLIGATORIO"
        :disable="disable"
      ></voice-input>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Identificación</label>
      <q-input
        v-model="entidad.identificacion"
        placeholder="Obligatorio"
        :disable="disable"
        :error="!!v$.visitante.identificacion.$errors.length"
        @blur="v$.visitante.identificacion.$touch"
        outlined
        dense
      ></q-input>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Celular</label>
      <q-input
        v-model="entidad.celular"
        placeholder="Opcional"
        :disable="disable"
        mask="0## ### ####"
        outlined
        dense
      ></q-input>
    </div>

    <div class="col-12 col-md-3">
      <voice-input
        v-model="entidad.motivo_visita"
        :v$="v$"
        key-error="motivo_visita"
        label="Motivo de visita"
        placeholder="OBLIGATORIO"
        :disable="disable"
      ></voice-input>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Persona visitada</label>
      <q-input
        v-model="criterioBusqueda"
        placeholder="Escriba y presione enter para buscar"
        hint="Puede buscar por nombre, apellido o identificación"
        :disable="disable"
        @keydown.enter="listar"
        :error="!!v$.visitante.persona_visitada.$errors.length"
        @blur="v$.visitante.persona_visitada.$touch"
        outlined
        dense
      >
        <template v-slot:append>
          <q-icon
            :name="
              visitante.persona_visitada
                ? 'bi-check-circle-fill'
                : 'bi-check-circle'
            "
            :color="entidad.persona_visitada ? 'positive' : 'grey-6'"
            size="xs"
          ></q-icon>
        </template>

        <template v-slot:error>
          <div
            v-for="error of v$.visitante.persona_visitada.$errors"
            :key="error.$uid"
          >
            <div class="error-msg">{{ error.$message }}</div>
          </div>
        </template>
      </q-input>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Placa de vehículo</label>
      <q-input
        v-model="entidad.placa_vehiculo"
        placeholder="Opcional"
        :disable="disable"
        mask="XXX-##X#"
        outlined
        dense
      ></q-input>
    </div>

    <!--  <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha y hora de ingreso</label>
      <q-input
        v-model="entidad.fecha_hora_ingreso"
        hint="Se recupera de la fecha de registro en la bitácora"
        disable
        outlined
        dense
      ></q-input>
    </div>

    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Fecha y hora de salida</label>
      <q-input
        v-model="entidad.fecha_hora_salida"
        disable
        outlined
        dense
      ></q-input>
    </div> -->

    <div class="col-12 col-md-3">
      <voice-input
        v-model="entidad.observaciones"
        :v$="v$"
        key-error="observaciones"
        label="Observaciones"
        placeholder="OPCIONAL"
        :disable="disable"
      ></voice-input>
    </div>

    <div class="col-12">
      <essential-selectable-table
        ref="refListadoSeleccionable"
        :configuracion-columnas="(configuracionColumnasEmpleadosLite as any)"
        :datos="listado"
        @selected="seleccionar"
        tipo-seleccion="single"
      ></essential-selectable-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { configuracionColumnasEmpleadosLite } from 'pages/recursosHumanos/empleados/domain/configuracionColumnasEmpleadosLite'
import { useOrquestadorSelectorEmpleados } from 'pages/seguridad/bitacoras/application/useOrquestadorSelectorEmpleados'
import { Visitante } from '../domain/Visitante'
import { reactive } from 'vue'
import VoiceInput from 'components/inputs/VoiceInput.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'

const props = defineProps({
  visitante: {
    type: Object as () => Visitante,
    required: true
  },
  v$: {
    type: Object as () => any,
    required: true
  },
  disable: {
    type: Boolean,
    default: false
  }
})

const {
  refListadoSeleccionable,
  criterioBusqueda,
  listado,
  listar,
  seleccionar
} = useOrquestadorSelectorEmpleados(
  props.visitante,
  'empleados',
  'persona_visitada'
)

const entidad = reactive(props.visitante)
criterioBusqueda.value = entidad.persona_visitada
</script>
