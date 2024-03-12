<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasEtapa"
    titulo-pagina="Proyectos"
    :listar="false"
    :mostrarListado="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Proyecto -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Proyecto</label>
            <q-select
              v-model="etapa.proyecto"
              :options="proyectos"
              @filter="filtrarProyectos"
              @update:model-value="actualizarResponsable"
              :disable="disabled"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.codigo_proyecto"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :error="!!v$.proyecto.$errors.length"
              @blur="v$.proyecto.$touch"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.proyecto.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Responsable -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Responsable</label>
            <q-select
              v-model="etapa.responsable"
              :options="empleados"
              @filter="filtrarEmpleados"
              @popup-show="ordenarEmpleados"
              :disable="disabled"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.apellidos + ' ' + item.nombres"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :error="!!v$.responsable.$errors.length"
              @blur="v$.responsable.$touch"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.responsable.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Nombre de la etapa -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="etapa.nombre"
              :error="!!v$.nombre.$errors.length"
              @blur="v$.nombre.$touch"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <br />
            <q-toggle
              v-model="etapa.activo"
              checked-icon="check"
              color="positive"
              label="Activo"
            />
          </div>
        </div> </q-form></template
  ></tab-layout>
</template>

<script lang="ts" setup>
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Etapa } from '../domain/Etapa'
import { EtapaController } from '../infraestructure/EtapaController'
import { configuracionColumnasEtapa } from '../domain/configuracionColumnasEtapas'
import { EmpleadoRoleController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoRolesController'
import { acciones, rolesSistema } from 'config/utils'
import { ProyectoController } from 'pages/gestionTrabajos/proyectos/infraestructure/ProyectoController'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useFiltrosListadosTarea } from 'pages/gestionTrabajos/tareas/application/FiltrosListadosTarea'
import { useEtapaStore } from 'stores/tareas/etapa'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

const emit = defineEmits(['cerrar-modal', 'guardado'])
const mixin = new ContenedorSimpleMixin(Etapa, new EtapaController())
const {
  entidad: etapa,
  disabled,
  accion,
  listadosAuxiliares,
} = mixin.useReferencias()
const { cargarVista, obtenerListados, setValidador, consultar } =
  mixin.useComportamiento()
const { onModificado } = mixin.useHooks()

//stores
const etapaStore = useEtapaStore()

cargarVista(async () => {
  await obtenerListados({
    empleados: {
      controller: new EmpleadoRoleController(),
      params: { roles: [rolesSistema.coordinador, rolesSistema.supervisor] },
    },
    proyectos: {
      controller: new ProyectoController(),
      params: { finalizado: 0 },
    },
  })
  empleados.value = listadosAuxiliares.empleados
  proyectos.value = listadosAuxiliares.proyectos

  if (etapaStore.idEtapa) {
    console.log(etapaStore.idEtapa)
    accion.value = acciones.editar
    consultar({ id: etapaStore.idEtapa })
  }
})
const reglas = {
  nombre: { required },
  proyecto: { required },
  responsable: { required },
}
const v$ = useVuelidate(reglas, etapa)

/********
 * Hooks
 ********/
onModificado(() => {
  emit('cerrar-modal', false)
  emit('guardado', 'Etapa')
})

/***************************
 * Funciones
 ***************************/
function actualizarResponsable() {
  const proyectoSeleccionado = proyectos.value.filter(
    (v) => v.id === etapa.proyecto
  )
  etapa.responsable = proyectoSeleccionado[0].coordinador_id
    ? proyectoSeleccionado[0].coordinador_id
    : null
}

const { empleados, filtrarEmpleados, ordenarEmpleados } =
  useFiltrosListadosSelects(listadosAuxiliares)
const { proyectos, filtrarProyectos } =
  useFiltrosListadosTarea(listadosAuxiliares)
</script>
