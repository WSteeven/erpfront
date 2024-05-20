<template>
  <div class="row q-col-gutter-x-sm q-pa-md">
    <!-- <div class="col-12 bg-green">
      Datos <br />
      {{ datos }}
    </div>
    <div class="col-12 bg-cyan">
      Listado <br />
      {{ listado }}
    </div>  -->
    <div class="col-12 q-mb-md">
      <!-- v-if="configuracionColumnasExamenFisicoRegional.length" -->
      <essential-table
        v-if="mostrarTabla"
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
        :disable="disable"
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
import { Ref, ref, reactive, watch, computed } from 'vue'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { CategoriaExamenFisicoController } from '../../fichaPeriodicaPreocupacional/infraestructure/CategoriaExamenFisicoController'
import { RegionCuerpoController } from '../../fichaPeriodicaPreocupacional/infraestructure/RegionCuerpoController'
import { CategoriaExamenFisico } from '../../fichaPeriodicaPreocupacional/domain/CategoriaExamenFisico'
import { RegionCuerpo } from '../../fichaPeriodicaPreocupacional/domain/RegionCuerpo'
import { ExamenFisicoRegional } from './domain/ExamenFisicoRegional'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  disable: {
    type: Boolean,
    default: false,
  },
  validador: {
    type: Object,
    required: false,
  },
  datos: {
    type: Object as () => ExamenFisicoRegional[],
    required: true,
  },
})

/************
 * Variables
 ************/
const configuracionColumnasExamenFisicoRegional: Ref<any> = ref([])
const listado = ref<any>([]) // Origen datos
const listadoExamenFisicoRegional = ref<ExamenFisicoRegional[]>([]) // Lo que se devuelve
const regionesCuerpo: Ref<RegionCuerpo[]> = ref([])
const categoriasExamenesFisicos: Ref<CategoriaExamenFisico[]> = ref([])
const cargando = new StatusEssentialLoading()
const fila = reactive({})
const mostrarTabla = ref(false)

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
  console.log(listado.value)
  listadoExamenFisicoRegional.value = Object.values(listado.value[0])
    .filter((value) => Array.isArray(value))
    .flatMap((value) => value)
    .map((categoria_examen_fisico_id: number) => {
      const exam = new ExamenFisicoRegional()
      exam.categoria_examen_fisico = categoriasExamenesFisicos.value.find(
        (cat: CategoriaExamenFisico) => cat.id === categoria_examen_fisico_id
      )?.nombre
      exam.categoria_examen_fisico_id = categoria_examen_fisico_id
      exam.observacion = props.datos
        ? obtenerObservacion(categoria_examen_fisico_id)
        : null
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

const consultarConstruirColumnas = async () => {
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

  regionesCuerpo.value.forEach((region: RegionCuerpo) => {
    fila[region.nombre ?? ''] = null
  })

  console.log(fila)
  await listado.value.push(JSON.parse(JSON.stringify(fila)))

  mostrarTabla.value = true

  mapearDatosAListado()
}

const obtenerObservacion = (idCategoria: number) => {
  const examen: ExamenFisicoRegional | undefined = props.datos.find(
    (examen: ExamenFisicoRegional) =>
      examen.categoria_examen_fisico_id === idCategoria
  )
  return examen?.observacion ?? null
}

/*************
 * Observers
 *************/
watch(listado, emitir, { deep: true })

/*******
 * Init
 *******/
consultarConstruirColumnas()

// onConsultado
const mapearDatosAListado = () => {
  watch(
    computed(() => props.datos),
    (datos) => {
      //const datos: ExamenFisicoRegional[] = props.datos
      if (datos) {
        datos.forEach((examen) => {
          const region = examen.region_cuerpo ?? ''
          if (fila.hasOwnProperty(region)) {
            if (fila[region] === null) {
              fila[region] = [examen.categoria_examen_fisico_id]
            } else {
              fila[region]?.push(examen.categoria_examen_fisico_id)
            }
          }
        })

        console.log('Fila agregada al consultar')
        console.log(fila)
        listado.value = [fila]
      }
    }
  )
  // listadoExamenFisicoRegional.value = datos
}

// onConsultar
/* watch(
  computed(() => props.datos),
  () => mapearDatosAListado()
) */
</script>
