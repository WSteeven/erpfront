<template>
  <div class="text-bold q-mb-md">Imágenes adicionales</div>
  <div class="row q-col-gutter-xs">
    <!-- Imagen -->
    <div
      v-for="imagen in tipoTrabajo.imagenes_adicionales"
      :key="imagen.etiqueta"
      class="col-12 col-md-3 q-mb-md"
    >
      <label class="q-mb-sm block">{{ imagen.etiqueta }}</label>
      <selector-imagen
        :imagen="imagen1"
        @update:modelValue="(data) => (imagen1 = data)"
      >
      </selector-imagen>
    </div>

    <!-- Imagen -->
    <!--<div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block"
        >Fotografía del rack del cliente con el mini ODF y equipo entregado por
        la cuadrilla</label
      >
      <selector-imagen
        :imagen="imagen1"
        @update:modelValue="(data) => (imagen1 = data)"
      >
      </selector-imagen>
    </div> -->

    {{ tipoTrabajo }}
    <!-- Imagen -->
    <!--<div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block"
        >Fotografía del mini ODF en la oficina del cliente (Fusión interna
        realizada. Etiquetado del mini ODF)</label
      >
      <selector-imagen
        :imagen="imagen1"
        @update:modelValue="(data) => (imagen1 = data)"
      >
      </selector-imagen>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
// Dependencias
import { reactive, ref } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TipoTrabajoController } from 'pages/tareas/tiposTareas/infraestructure/TipoTrabajoController'
import { SubtareaController } from 'pages/tareas/subtareas/infraestructure/SubtareaController'
import { TipoTrabajo } from 'pages/tareas/tiposTareas/domain/TipoTrabajo'
import { Subtarea } from 'pages/tareas/subtareas/domain/Subtarea'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import SelectorImagen from 'components/SelectorImagen.vue'

const imagen1 = ref()

//const mixin = new ContenedorSimpleMixin(Subtarea, new SubtareaController())
/*const { entidad: subtarea } = mixin.useReferencias()
const { consultar } = mixin.useComportamiento()*/
const subtareaController = new SubtareaController()
const tipoTrabajoController = new TipoTrabajoController()
// const subtarea = reactive(new Subtarea())
const imagenesAdicionales = ref()

const mixinTipoTrabajo = new ContenedorSimpleMixin(
  TipoTrabajo,
  new TipoTrabajoController()
)
const { entidad: tipoTrabajo } = mixinTipoTrabajo.useReferencias()
const { consultar: consultarTipoTrabajo } = mixinTipoTrabajo.useComportamiento()

const store = useTrabajoAsignadoStore()

async function cargar() {
  if (store.idSubtareaSeleccionada) {
    const data = await subtareaController.consultar(
      store.idSubtareaSeleccionada
    )

    const { result } = await tipoTrabajoController.consultar(
      data.result.tipo_trabajo
    )
    imagenesAdicionales.value = result
    console.log(tipoTrabajo.imagenes_adicionales)

    // await consultarTipoTrabajo({ id: data.result.tipo_trabajo })
    // console.log(data.result.tipo_trabajo)
    // console.log('sjsjsjsjsj')

    /*tipoTrabajo.imagenes_adicionales = JSON.parse(
      tipoTrabajo.imagenes_adicionales
    )*/
  }
}

cargar()
</script>
