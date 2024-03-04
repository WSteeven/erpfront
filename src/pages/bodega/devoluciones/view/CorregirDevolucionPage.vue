<template>
  <q-form @submit.prevent>
    <div class="row q-col-gutter-sm q-py-md">
      <!-- N° devolucion -->
      <div v-if="devolucion.id" class="col-12 col-md-3">
        <label class="q-mb-sm block">Devolución N°</label>
        <q-input
          v-model="devolucion.id"
          placeholder="Obligatorio"
          disable
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Fecha de devolucion -->
      <div v-if="devolucion.created_at" class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha</label>
        <q-input v-model="devolucion.created_at" disable outlined dense />
      </div>

      <!-- Sucursal select -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Sucursal</label>
        <q-input v-model="devolucion.sucursal" dense outlined disable />
      </div>
      <!-- Solicitante -->
      <div v-if="devolucion.solicitante" class="col-12 col-md-3">
        <label class="q-mb-sm block">Solicitante</label>
        <!-- <q-input v-model="devolucion.solicitante" disable outlined dense>
                </q-input> -->
        <q-input v-model="devolucion.solicitante" dense outlined disable />
      </div>
      <!-- Justificacion -->
      <div class="col-12 col-md-6">
        <label class="q-mb-sm block">Justificación</label>
        <q-input
          type="textarea"
          autogrow
          v-model="devolucion.justificacion"
          placeholder="Obligatorio"
          disable
          outlined
          dense
        />
      </div>

      <!-- Es devolucion para stock personal -->
      <div v-if="devolucion.es_para_stock" class="col-12 col-md-3">
        <q-checkbox
          class="q-mt-lg q-pt-md"
          v-model="devolucion.es_para_stock"
          label="¿Es devolución al stock personal?"
          disable
          outlined
          dense
        ></q-checkbox>
      </div>
      <!-- Es devolucion automatico -->
      <div v-if="devolucion.pedido_automatico" class="col-12 col-md-3">
        <q-checkbox
          class="q-mt-lg q-pt-md"
          v-model="devolucion.pedido_automatico"
          label="¿Pedido automático?"
          disable
          outlined
          dense
        ></q-checkbox>
      </div>
      <!-- Es devolucion de tarea -->
      <div v-if="devolucion.es_tarea" class="col-12 col-md-3">
        <q-checkbox
          class="q-mt-lg q-pt-md"
          v-model="devolucion.es_tarea"
          label="¿Es material de tarea?"
          disable
          outlined
          dense
        ></q-checkbox>
      </div>
      <!-- Tarea -->
      <div v-if="devolucion.es_tarea" class="col-12 col-md-3">
        <label class="q-mb-sm block">Tarea</label>
        <q-input
          v-model="devolucion.tarea"
          hint="Tarea #"
          dense
          outlined
          disable
        />
      </div>
      <!-- Persona que autoriza -->
      <div v-if="devolucion.per_autoriza" class="col-12 col-md-3">
        <label class="q-mb-sm block">Persona que autoriza</label>
        <q-input v-model="devolucion.per_autoriza" dense outlined disable />
      </div>
      <!-- Select autorizacion -->
      <!-- v-if="devolucion.autorizacion || esCoordinador||esActivosFijos" -->
      <div v-if="devolucion.autorizacion" class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Autorizacion</label>
        <q-input v-model="devolucion.autorizacion" dense outlined disable />
      </div>
      <!-- Observacion de autorizacion -->
      <div v-if="devolucion.observacion_aut" class="col-12 col-md-3">
        <label class="q-mb-sm block">Observacion</label>
        <q-input
          autogrow
          v-model="devolucion.observacion_aut"
          placeholder="Opcional"
          disable
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Tabla -->
      <div class="col-12">
        <essential-table
          titulo="Productos Seleccionados"
          :configuracionColumnas="configuracionColumnasProductosSeleccionados"
          :datos="devolucion.listadoProductos"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :mostrarBotones="false"
          :alto-fijo="false"
          :ajustarCeldas="true"
          :accion1="botonEditarCantidad"
          :accion2="botonEliminar"
        >
        </essential-table>
      </div>
    </div>
    <div :class="{ 'q-pa-md': $q.screen.xs }">
      <div class="row justify-end q-col-gutter-x-xs">
        <button-submits
          :accion="acciones.editar"
          :permitirGuardar="true"
          :disabled="storeCargando.cargando"
          labelGuardar="Guardar"
          @cancelar="cancelar"
          @editar="actualizarDevolucion"
        />
      </div>
    </div>
  </q-form>
</template>
<script lang="ts">
//Dependencies
import { useDevolucionStore } from 'stores/devolucion'
import { defineComponent, ref } from 'vue'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionadosAccion'

//Components
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import buttonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { LocalStorage } from 'quasar'
import { useNotificaciones } from 'shared/notificaciones'
import { acciones } from 'config/utils'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  components: { EssentialTable, buttonSubmits },
  emits: ['cerrar-modal'],
  setup(props, { emit }) {
    const devolucionStore = useDevolucionStore()
    const { confirmar, prompt, notificarCorrecto, notificarError } =
      useNotificaciones()
    const devolucion = devolucionStore.devolucion
    const opciones_estados = ref([])

    const accion = 'editar'

    //limpiar cantidades de devolucion que se va a corregir
    devolucion.listadoProductos =
      devolucionStore.devolucion.listadoProductos.filter(
        (v) => v.cantidad != v.despachado
      )

    function cancelar() {
      devolucionStore.resetearDevolucion()
      emit('cerrar-modal', false)
    }

    async function actualizarDevolucion() {
      devolucionStore.idDevolucion = devolucion.id
      const response = await devolucionStore.modificarDevolucion(devolucion)
      if (response.status == 200) {
        notificarCorrecto('Devolución actualizada correctamente')
        emit('cerrar-modal', false)
      } else {
        notificarError('Hubo un error al guardar los cambios')
        emit('cerrar-modal', false)
      }
    }

    function eliminar({ entidad, posicion }) {
      confirmar('¿Está seguro de continuar?', async () => {
        const response = await devolucionStore.eliminarDetalle(
          entidad.id,
          devolucion.id
        )
        if (response.status == 200) {
          notificarCorrecto(response.data.mensaje)
          devolucion.listadoProductos.splice(posicion, 1)
        } else {
          notificarError('No se pudo eliminar el elemento')
        }
      })
    }
    const botonEliminar: CustomActionTable = {
      titulo: 'Quitar',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ entidad, posicion }) => eliminar({ entidad, posicion }),
      visible: ({ entidad }) => (entidad.devuelto == 0 ? true : false),
    }

    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad',
      icono: 'bi-pencil',
      accion: ({ posicion }) => {
        const data: CustomActionPrompt = {
          titulo: 'Modifica',
          mensaje: 'Ingresa la cantidad',
          tipo: 'number',
          defecto: devolucion.listadoProductos[posicion].cantidad,
          accion: (data) =>
            (devolucion.listadoProductos[posicion].cantidad = data),
          validacion: (data) =>
            devolucion.listadoProductos[posicion].devuelto <= data,
        }
        prompt(data)
      },
      visible: () => {
        return true
      },
    }

    opciones_estados.value = JSON.parse(
      LocalStorage.getItem('estados_transacciones')!.toString()
    )
    return {
      devolucion,
      botonEditarCantidad,
      botonEliminar,
      configuracionColumnasProductosSeleccionados,
      opciones_estados,
      storeCargando: useCargandoStore(),
      cancelar,
      actualizarDevolucion,
      acciones,
    }
  },
})
</script>
