<template>
    <essential-table
    ref="refCoordenadas"
    :titulo="titulo"
    :configuracionColumnas="columnas"
    :datos="coordenadas"
    :alto-fijo="false"
    :permitirConsultar="false"
    :permitirEditar="true"
    :permitirEliminar="true"
    :permitir-buscar="false"
    :permitirEditarModal="true"
    :mostrarFooter="!coordenadas.length"
    separador="cell"
    :accion1Header="agregarActividadRealizada"
    :accion1="accion1"
    @eliminar="eliminarCoordenada"
    :modalMaximized="$q.screen.xs"
    :entidad="entidad"
    :editarFilaLocal="editarFilaLocal"
    @guardarFilaNueva="(fila) => emit('guardar-fila-coordenada', fila)"
    @guardarFila="(fila) => emit('actualizar-fila-coordenada', fila)"
    :ajustar-celdas="true"
    />
</template>

<script lang="ts" setup>
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading';
import { ColumnConfig } from 'components/tables/domain/ColumnConfig';
import { CustomActionTable } from 'components/tables/domain/CustomActionTable';
import { accionesTabla } from 'config/utils';
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';
import { Instanciable } from 'shared/entidad/domain/instanciable';
import { useNotificaciones } from 'shared/notificaciones';
import { Ref, watchEffect } from 'vue';
import { ref } from 'vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { obtenerUbicacion } from 'shared/utils';

const props = defineProps({
  listado: {
    type: Object as () => EntidadAuditable[],
    required: true,
  },
  configuracionColumnas: {
    type: Object as () => ColumnConfig<EntidadAuditable>[],
    required: true,
  },
  entidad: {
    type: Object as Instanciable,
    required: true,
  },
  accion1: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  mostrarAccion1Header: {
    type: Boolean,
    default: true,
  },
  editarFilaLocal: {
    type: Boolean,
    default: true,
  },
  titulo: String,
  consultarCoordenadas: {
    type: Boolean,
    default: true,
  },
})
const refCoordenadas = ref()
const emit = defineEmits(['actualizar-fila-coordenada', 'guardar-fila-coordenada', 'eliminar-coordenada'])

/************
 * Variables
 ************/
const coordenadas: Ref<any[]> = ref(props.listado)
const { confirmar, notificarError } = useNotificaciones()
const cargando = new StatusEssentialLoading()

watchEffect(() => (coordenadas.value = props.listado))

/***************************
 * Configuracion de columnas
 ****************************/
const columnas: any = [...props.configuracionColumnas, accionesTabla]

/************
 * Funciones
 ************/
async function obtenerCoordenadas() {
      try {
        const ubicacion = await obtenerUbicacion()

        const punto =
          ubicacion.coords.latitude + ',' + ubicacion.coords.longitude
        console.log(punto)
        return ubicacion
      } catch (error) {
        console.log('Error obteniendo ubicación:', error)
      }
    }
const agregarActividadRealizada: CustomActionTable = {
  titulo: 'Agregar fila',
  icono: 'bi-plus',
  color: 'positive',
  visible: () => props.mostrarAccion1Header,
  accion: async () => {
    try {
      cargando.activar()
      const ubicacion = await obtenerCoordenadas()

      if (props.consultarCoordenadas) {
        refCoordenadas.value.abrirModalEditar({latitud: ubicacion.coords.latitude,
            longitud: ubicacion.coords.longitude,
            direccion: await obtenerDireccion(ubicacion.coords.latitude, ubicacion.coords.longitude) })
        console.log('agregar fila')
      } else {
        refCoordenadas.value.abrirModalEditar()
      }
    } catch (e) {
      notificarError(
        'Problemas para capturar las coordenadas. Intenta nuevamente o verifica tu conexión a Internet.'
      )
    } finally {
      cargando.desactivar()
    }
  },
}
async function obtenerDireccion(lat: number, lng: number) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
  const data = await response.json();
  return data.display_name;
}
const eliminarCoordenada = ({ posicion }) => {
    emit('eliminar-coordenada', coordenadas.value.at(posicion))
}

</script>
