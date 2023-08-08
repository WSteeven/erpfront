<template>
  <q-form @submit.prevent>
    <div class="row q-col-gutter-sm q-py-md">
      <!-- N° pedido -->
      <div v-if="pedido.id" class="col-12 col-md-3">
        <label class="q-mb-sm block">Pedido N°</label>
        <q-input
          v-model="pedido.id"
          placeholder="Obligatorio"
          disable
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Fecha de pedido -->
      <div v-if="pedido.created_at" class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha</label>
        <q-input v-model="pedido.created_at" disable outlined dense />
      </div>
      <!-- Sucursal select -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Sucursal</label>
        <q-input v-model="pedido.sucursal" dense outlined disable />
      </div>
      <!-- Solicitante -->
      <div v-if="pedido.solicitante" class="col-12 col-md-3">
        <label class="q-mb-sm block">Solicitante</label>
        <!-- <q-input v-model="pedido.solicitante" disable outlined dense>
              </q-input> -->
        <q-input v-model="pedido.solicitante" dense outlined disable />
      </div>
      <!-- Justificacion -->
      <div class="col-12 col-md-6">
        <label class="q-mb-sm block">Justificación</label>
        <q-input
          type="textarea"
          autogrow
          v-model="pedido.justificacion"
          placeholder="Obligatorio"
          disable
          outlined
          dense
        />
      </div>
      <!-- Fecha límite -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha limite</label>
        <q-input
          v-model="pedido.fecha_limite"
          placeholder="Obligatorio"
          disable
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Es para el cliente -->
      <div class="col-12 col-md-3 q-mb-xl">
        <q-checkbox
          class="q-mt-lg q-pt-md"
          v-model="pedido.para_cliente"
          label="¿Es material para el cliente?"
          disable
          outlined
          dense
        ></q-checkbox>
      </div>
      <div v-if="pedido.para_cliente" class="col-12 col-md-3">
        <label class="q-mb-sm block">Cliente</label>
        <q-input v-model="pedido.cliente" dense outlined />
      </div>
      <!-- Responsable -->
      <div v-if="pedido.responsable" class="col-12 col-md-3">
        <label class="q-mb-sm block">Responsable</label>
        <q-input v-model="pedido.responsable" dense outlined disable />
      </div>
      <!-- Retira otra persona -->
      <div class="col-12 col-md-3 q-mb-xl">
        <q-checkbox
          class="q-mt-lg q-pt-md"
          v-model="pedido.retira_tercero"
          label="¿Retira otra persona?"
          disable
          outlined
          dense
        ></q-checkbox>
      </div>
      <!-- Persona que retira -->
      <div v-if="pedido.retira_tercero" class="col-12 col-md-3">
        <label class="q-mb-sm block">Persona que retira</label>
        <q-input v-model="pedido.per_retira" dense outlined disable />
      </div>
      <!-- Es pedido de tarea -->
      <div v-if="pedido.es_tarea" class="col-12 col-md-3 q-mb-xl">
        <q-checkbox
          class="q-mt-lg q-pt-md"
          v-model="pedido.es_tarea"
          label="¿Es material de tarea?"
          disable
          outlined
          dense
        ></q-checkbox>
      </div>
      <!-- Tarea -->
      <div v-if="pedido.es_tarea" class="col-12 col-md-3">
        <label class="q-mb-sm block">Tarea</label>
        <q-input v-model="pedido.tarea" hint="Tarea #" dense outlined disable />
      </div>
      <!-- Persona que autoriza -->
      <div v-if="pedido.per_autoriza" class="col-12 col-md-3">
        <label class="q-mb-sm block">Persona que autoriza</label>
        <q-input v-model="pedido.per_autoriza" dense outlined disable />
      </div>
      <!-- Select autorizacion -->
      <!-- v-if="pedido.autorizacion || esCoordinador||esActivosFijos" -->
      <div v-if="pedido.autorizacion" class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Autorizacion</label>
        <q-input v-model="pedido.autorizacion" dense outlined disable />
      </div>
      <!-- Observacion de autorizacion -->
      <div v-if="pedido.observacion_aut" class="col-12 col-md-3">
        <label class="q-mb-sm block">Observacion</label>
        <q-input
          autogrow
          v-model="pedido.observacion_aut"
          placeholder="Opcional"
          disable
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Select estado -->
      <div v-if="pedido.estado" class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Estado del despacho</label>
        <q-input v-model="pedido.estado" dense outlined disable />
      </div>

      <!-- Evidencia fotografica -->
      <div class="col-12 col-md-3 q-mb-xl">
        <q-checkbox
          class="q-mt-lg q-pt-md"
          v-model="pedido.tiene_evidencia"
          label="¿Tiene evidencia fotográfica?"
          disable
          outlined
          dense
        ></q-checkbox>
      </div>
      <!-- Evidencia fotografica 1 -->
      <div
        v-if="pedido.tiene_evidencia || pedido.evidencia1"
        class="col-12 col-md-3"
      >
        <label class="q-mb-sm block">Evidencia 1 </label>
        <selector-imagen
          file_extensiones=".jpg, image/*"
          :imagen="pedido.evidencia1"
          :alto="'200px'"
          @update:model-value="(data) => (pedido.evidencia1 = data)"
        ></selector-imagen>
      </div>
      <!-- Evidencia fotografica 2 -->
      <div
        v-if="pedido.tiene_evidencia || pedido.evidencia2"
        class="col-12 col-md-3"
      >
        <label class="q-mb-sm block">Evidencia 2</label>
        <selector-imagen
          file_extensiones=".jpg, image/*"
          :imagen="pedido.evidencia2"
          :alto="'200px'"
          @update:model-value="(data) => (pedido.evidencia2 = data)"
        ></selector-imagen>
      </div>
      <!-- observacion estado -->
      <div v-if="pedido.observacion_est" class="col-12 col-md-3">
        <label class="q-mb-sm block">Observacion</label>
        <q-input
          autogrow
          v-model="pedido.observacion_est"
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
          :configuracionColumnas="
            configuracionColumnasProductosSeleccionadosDespachado
          "
          :datos="pedido.listadoProductos"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :mostrarBotones="false"
          :alto-fijo="false"
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
          @editar="actualizarPedido"
        />
      </div>
    </div>
  </q-form>
</template>
<script lang="ts">
//Dependencies
import { usePedidoStore } from 'stores/pedido'
import { defineComponent, ref } from 'vue'
import { configuracionColumnasProductosSeleccionadosDespachado } from '../domain/configuracionColumnasProductosSeleccionadosDespachado'

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
    const pedidoStore = usePedidoStore()
    const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()
    const pedido = pedidoStore.pedido
    const opciones_estados = ref([])

    const accion = 'editar'

    //limpiar cantidades de pedido que se va a corregir
    pedido.listadoProductos = pedidoStore.pedido.listadoProductos.filter(
      (v) => v.cantidad != v.despachado
    )

    function cancelar() {
      emit('cerrar-modal', false)
    }

    async function actualizarPedido() {
      pedidoStore.idPedido = pedido.id
      const response = await pedidoStore.modificarPedido(pedido)
      if(response.status==200){
        notificarCorrecto('Pedido actualizado correctamente')
        emit('cerrar-modal', false)
      }else{
        notificarError('Hubo un error al guardar los cambios')
        emit('cerrar-modal', false)
      }
    }

    function eliminar({ entidad, posicion }) {
      confirmar('¿Está seguro de continuar?', async () => {
        const response = await pedidoStore.eliminarDetalle(entidad.id,pedido.id)
        if(response.status==200){
          notificarCorrecto(response.data.mensaje)
          pedido.listadoProductos.splice(posicion, 1)
        }else{
          notificarError('No se pudo eliminar el elemento')
        }
      })
    }
    const botonEliminar: CustomActionTable = {
      titulo: 'Quitar',
      color: 'negative',
      icono: 'bi-x',
      accion: ({ entidad, posicion }) => eliminar({ entidad, posicion }),
      visible: ({ entidad }) => (entidad.despachado == 0 ? true : false),
    }

    const botonEditarCantidad: CustomActionTable = {
      titulo: 'Cantidad',
      icono: 'bi-pencil',
      accion: ({ posicion }) => {
        const data: CustomActionPrompt = {
          titulo: 'Modifica',
          mensaje: 'Ingresa la cantidad',
          tipo: 'number',
          defecto: pedido.listadoProductos[posicion].cantidad,
          accion: (data) => (pedido.listadoProductos[posicion].cantidad = data),
          validacion: (data) => (pedido.listadoProductos[posicion].despachado <= data)
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
      pedido,
      botonEditarCantidad,
      botonEliminar,
      configuracionColumnasProductosSeleccionadosDespachado,
      opciones_estados,
      storeCargando:useCargandoStore(),
      cancelar,
      actualizarPedido,
      acciones,
    }
  },
})
</script>
