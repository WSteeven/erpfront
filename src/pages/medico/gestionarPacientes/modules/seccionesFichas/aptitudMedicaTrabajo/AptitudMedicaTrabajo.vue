<template>
  <div class="row q-pa-md">
    <div class="col-12 q-mb-md">
      <label class="q-mb-sm block"
        >Después de la valoración medica ocupacional se certifica que la persona
        en mención, es calificada como:</label
      >
      <div class="q-gutter-sm">
        <q-radio
          v-for="tipo in tiposAptitudesMedicasLaborales"
          :key="tipo.id ?? undefined"
          v-model="entidad.tipo_aptitud_id"
          :val="tipo.id"
          :label="`${tipo.nombre}`"
          :disable="disable"
          @update:model-value="emitir()"
        />
      </div>
    </div>

    <div class="col-12 q-mb-md">
      <label class="q-mb-sm block">Observación</label>
      <q-input
        v-model="entidad.observacion"
        placeholder="Opcional"
        :disable="disable"
        outlined
        dense
        autogrow
        type="textarea"
        @update:model-value="emitir()"
      >
      </q-input>
    </div>

    <div class="col-12">
      <label class="q-mb-sm block">Limitación</label>
      <q-input
        v-model="entidad.limitacion"
        placeholder="Opcional"
        :disable="disable"
        outlined
        dense
        autogrow
        type="textarea"
        @update:model-value="emitir()"
      >
      </q-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Ref } from 'vue'
import { TipoAptitudMedicaLaboral } from '../../fichaAptitud/domain/TipoAptitudMedicaLaboral'
import { TipoAptitudMedicaLaboralController } from '../../fichaAptitud/infraestructure/TipoAptitudMedicaLaboralController'
import { AptitudMedica } from './domain/AptitudMedica'
import { reactive, ref } from 'vue'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  aptitudMedica: {
    type: Object as () => AptitudMedica,
    required: true,
  },
  disable: {
    type: Boolean,
    default: false,
  },
  validador: {
    type: Object,
    required: false,
  },
})

/*************
 * Variables
 *************/
const entidad = reactive(props.aptitudMedica)
const tipoAptitudMedicaLaboralController =
  new TipoAptitudMedicaLaboralController()
const tiposAptitudesMedicasLaborales: Ref<TipoAptitudMedicaLaboral[]> = ref([])
const cargando = new StatusEssentialLoading()

/*************
 * Funciones
 *************/
const emitir = () => emit('update:modelValue', entidad)

const consultartipoAptitudMedicaLaboralController = async () => {
  cargando.activar()

  try {
    const { result } = await tipoAptitudMedicaLaboralController.listar()
    tiposAptitudesMedicasLaborales.value = result
  } catch (e) {
    console.log(e)
  } finally {
    cargando.desactivar()
  }
}

/*******
 * Init
 *******/
consultartipoAptitudMedicaLaboralController()
</script>
