<template>
  <div class="row bg-desenfoque rounded q-px-md">
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
            v-if="false"
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
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { ref } from 'vue'

// Componentes
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'

const emit = defineEmits(['cerrar-modal'])

const props = defineProps({
  mixin: {
    type: Object as () => ContenedorSimpleMixin<EntidadAuditable>,
    required: true,
  },
})

const { entidad: solicitud } = props.mixin.useReferencias()

/************
 * Variables
 ************/
const refArchivo = ref()

async function subirArchivos() {
  await refArchivo.value.subir()
  emit('cerrar-modal')
}

refArchivo.value.listarArchivosAlmacenados(solicitud.id)
</script>
