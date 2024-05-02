<template>
  <div class="row bg-desenfoque rounded q-pa-md">
    <div class="col-12 ">
      <formulario-solicitud-examen
        :mixin="mixin"
        :empleado="empleado"
      ></formulario-solicitud-examen>
    </div>
    <!-- Manejo de archivos -->
    <div class="col-12 q-mb-md">
      <gestor-archivos
        ref="refArchivo"
        label="Adjuntar archivos"
        :mixin="mixin"
        :listarAlGuardar="false"
        :idModelo="solicitud.id ?? undefined"
      >
        <template #boton-subir>
          <q-btn
            color="positive"
            push
            no-caps
            class="full-width q-mb-lg"
            @click="subirArchivos()"
          >
            <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
            Subir archivos seleccionados</q-btn
          >
        </template>
      </gestor-archivos>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Dependencias
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { onMounted, ref } from 'vue'

// Componentes
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'
import FormularioSolicitudExamen from 'medico/solicitudesExamenes/view/FormularioSolicitudExamen.vue'

// Logica y controladores
import { SolicitudExamen } from 'pages/medico/solicitudesExamenes/domain/SolicitudExamen'
import { SolicitudExamenController } from 'pages/medico/solicitudesExamenes/infraestructure/SolicitudExamenController'
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { useMedicoStore } from 'stores/medico'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'

const emit = defineEmits(['cerrar-modal'])

interface Parametros {
  solicitud_examen: SolicitudExamen
}

const props = defineProps({
  datos: Object as () => Parametros,
})

/*********
 * Stores
 *********/
const medicoStore = useMedicoStore()

/************
 * Variables
 ************/
const refArchivo = ref()
const empleado = medicoStore.empleado || new Empleado()

/********
 * Mixin
 ********/
const mixin = new ContenedorSimpleMixin(
  SolicitudExamen,
  new SolicitudExamenController(),
  new ArchivoController()
)

const { entidad: solicitud, accion } = mixin.useReferencias()

async function subirArchivos() {
  await refArchivo.value.subir()
  emit('cerrar-modal')
}

onMounted(() => refArchivo.value.listarArchivosAlmacenados(solicitud.id))

/********
 * Init
 ********/
 solicitud.hydrate(medicoStore.solicitudExamen)
 accion.value = medicoStore.accion
</script>
