<template>
  <div class="text-bold q-mb-md">Imágenes adicionales</div>
  <div class="row q-col-gutter-xs">
    <!-- Imagen -->
    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block"
        >Fotografía del mini ODF en la oficina del cliente (Fusión interna
        realizada. Etiquetado del mini ODF)</label
      >
      <selector-imagen
        :imagen="imagen1"
        @update:modelValue="(data) => (imagen1 = data)"
      >
      </selector-imagen>
    </div>

    <!-- Imagen -->
    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block"
        >Fotografía del rack del cliente con el mini ODF y equipo entregado por
        la cuadrilla</label
      >
      <selector-imagen
        :imagen="imagen1"
        @update:modelValue="(data) => (imagen1 = data)"
      >
      </selector-imagen>
    </div>

    <!-- Imagen -->
    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block"
        >Fotografía del mini ODF en la oficina del cliente (Fusión interna
        realizada. Etiquetado del mini ODF)</label
      >
      <selector-imagen
        :imagen="imagen1"
        @update:modelValue="(data) => (imagen1 = data)"
      >
      </selector-imagen>
    </div>

    <!-- Imagen -->
    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block"
        >Fotografía del mini ODF en la oficina del cliente (Fusión interna
        realizada. Etiquetado del mini ODF)</label
      >
      <selector-imagen
        :imagen="imagen1"
        @update:modelValue="(data) => (imagen1 = data)"
      >
      </selector-imagen>
    </div>

    <!-- Imagen -->
    <div class="col-12 col-md-3 q-mb-md">
      <label class="q-mb-sm block"
        >Fotografía del mini ODF en la oficina del cliente (Fusión interna
        realizada. Etiquetado del mini ODF)</label
      >
      <selector-imagen
        :imagen="imagen1"
        @update:modelValue="(data) => (imagen1 = data)"
      >
      </selector-imagen>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SelectorImagen from 'components/SelectorImagen.vue'

const imagen1 = ref()
</script>
