<template>
  <div class="text-bold q-mb-md">Imágenes adicionales</div>
  <div class="row q-col-gutter-xs">
    <div
      v-for="(imagen, index) in tipoTrabajo.imagenes_adicionales"
      :key="index"
      class="col-12 col-md-3 q-mb-md"
    >
      <label class="q-mb-sm block">{{ imagen.etiqueta }}</label>
      <selector-imagen
        :imagen="imagen.ruta"
        @update:modelValue="(data) => (imagen.ruta = data)"
      >
      </selector-imagen>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Dependencias
import { reactive, ref } from 'vue'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'

// Componentes
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { TipoTrabajoController } from 'pages/tareas/tiposTareas/infraestructure/TipoTrabajoController'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { TipoTrabajo } from 'pages/tareas/tiposTareas/domain/TipoTrabajo'

const tipoTrabajo = reactive(new TipoTrabajo())
const store = useTrabajoAsignadoStore()

async function getData() {
  const { result: subtarea } = await new SubtareaController().consultar(
    store.idSubtareaSeleccionada
  )
  const { result } = await new TipoTrabajoController().consultar(
    subtarea.tipo_trabajo
  )
  tipoTrabajo.hydrate(result)

  tipoTrabajo.imagenes_adicionales = JSON.parse(
    tipoTrabajo.imagenes_adicionales.toString()
  )
}

async function subir() {
  ///
}
subir()
getData()
</script>
