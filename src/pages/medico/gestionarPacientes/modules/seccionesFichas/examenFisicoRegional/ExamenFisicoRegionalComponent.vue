<template>
  <div class="row q-col-gutter-x-sm q-pa-md">
    <div class="col-12 q-mb-md">
      <essential-table
        v-if="configuracionColumnasExamenFisicoRegional.length"
        :configuracionColumnas="configuracionColumnasExamenFisicoRegional"
        :datos="listado"
        :permitirConsultar="false"
        :permitirEliminar="false"
        :permitirEditar="false"
        :mostrarBotones="false"
        :permitir-editar-celdas="true"
        :mostrar-header="false"
        :mostrar-footer="false"
        :alto-fijo="false"
        :ajustarCeldas="false"
        separador="cell"
      >
      </essential-table>
    </div>
  </div>

  <div
    v-for="(examen, index) in listadoExamenFisicoRegional"
    :key="index"
    class="row"
  >
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Categoría examen físico</label>
      <q-chip>{{ `${examen.categoria_examen_fisico}` }}</q-chip>
    </div>

    <div class="col-12 col-md-9 q-mb-md">
      <label class="q-mb-sm block">Observaciones</label>
      <q-input
        v-model="examen.observacion"
        placeholder="Opcional"
        :disable="disable"
        autogrow
        outlined
        dense
      >
      </q-input>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { Ref, ref, reactive, watch, watchEffect } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { CategoriaExamenFisicoController } from '../../fichaPeriodicaPreocupacional/infraestructure/CategoriaExamenFisicoController'
import { RegionCuerpoController } from '../../fichaPeriodicaPreocupacional/infraestructure/RegionCuerpoController'
import { CategoriaExamenFisico } from '../../fichaPeriodicaPreocupacional/domain/CategoriaExamenFisico'
import { ExamenFisicoRegional } from '../../fichaPeriodicaPreocupacional/domain/ExamenFisicoRegional'
import { RegionCuerpo } from '../../fichaPeriodicaPreocupacional/domain/RegionCuerpo'

const emit = defineEmits(['update:modelValue'])

defineProps({
  disable: {
    type: Boolean,
    default: false,
  },
  validador: {
    type: Object,
    required: false,
  },
})

/************
 * Variables
 ************/
const configuracionColumnasExamenFisicoRegional: Ref<any> = ref([])
const listado = ref<any>([])
const listadoExamenFisicoRegional = ref<ExamenFisicoRegional[]>([])
const regionesCuerpo: Ref<RegionCuerpo[]> = ref([])
const categoriasExamenesFisicos: Ref<CategoriaExamenFisico[]> = ref([])
const cargando = new StatusEssentialLoading()

/*****************
 * Controladores
 *****************/
const categoriasExamenesFisicosController =
  new CategoriaExamenFisicoController()
const regionesCuerpoController = new RegionCuerpoController()

/*************
 * Funciones
 *************/
const emitir = () => emit('update:modelValue', recuperarArray())

const recuperarArray = () => {
  listadoExamenFisicoRegional.value = Object.values(listado.value[0])
    .filter((value) => Array.isArray(value))
    .flatMap((value) => value)
    .map((categoria_examen_fisico_id: number) => {
      const exam = new ExamenFisicoRegional()
      exam.categoria_examen_fisico = categoriasExamenesFisicos.value.find(
        (cat: CategoriaExamenFisico) => cat.id === categoria_examen_fisico_id
      )?.nombre
      exam.categoria_examen_fisico_id = categoria_examen_fisico_id
      exam.observacion = null
      return exam
    })

  return listadoExamenFisicoRegional.value
}

const consultarCategoriasExamenesFisicos = async () => {
  cargando.activar()

  try {
    const { result } = await categoriasExamenesFisicosController.listar()
    categoriasExamenesFisicos.value = result
  } catch (e) {
    console.log(e)
  } finally {
    cargando.desactivar()
  }
}

const consultarRegionesCuerpo = async () => {
  cargando.activar()

  try {
    const { result } = await regionesCuerpoController.listar()
    regionesCuerpo.value = result
  } catch (e) {
    console.log(e)
  } finally {
    cargando.desactivar()
  }
}

const consultar = async () => {
  await consultarCategoriasExamenesFisicos()
  await consultarRegionesCuerpo()

  regionesCuerpo.value.forEach((region: RegionCuerpo) => {
    configuracionColumnasExamenFisicoRegional.value.push({
      name: region.nombre ?? '',
      field: region.nombre ?? '',
      label: region.nombre ?? '',
      align: 'left',
      sortable: true,
      type: 'select_multiple',
      editable: true,
      options: categoriasExamenesFisicos.value
        .filter(
          (categoria: CategoriaExamenFisico) =>
            categoria.region_cuerpo === region.id
        )
        .map((categoria: CategoriaExamenFisico) => {
          return {
            label: categoria.nombre,
            value: categoria.id,
          }
        }),
    })
  })

  let fila = {}
  regionesCuerpo.value.forEach((region: RegionCuerpo) => {
    fila[region.nombre ?? ''] = null
  })

  console.log(fila)
  listado.value.push(JSON.parse(JSON.stringify(fila)))
}

/*************
 * Observers
 *************/
watch(listado, emitir, { deep: true })

/*******
 * Init
 *******/
consultar()
</script>
