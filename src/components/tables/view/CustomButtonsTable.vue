<template>
  <!-- Accion 1-->
  <span
    class="row"
    :class="{
      'q-gutter-x-sm': !$q.screen.xs,
      'justify-end q-gutter-y-sm': $q.screen.xs,
    }"
  >
    <q-btn
      v-if="extraerVisible(accion1)"
      :color="accion1?.color ?? 'primary'"
      rounded
      dense
      push
      no-caps
      no-wrap
      class="q-px-sm"
      @click="ejecutarAccion(accion1)"
    >
      <q-icon
        v-if="accion1?.icono"
        :name="extraerIcono(accion1) ?? ''"
        size="xs"
        class="q-mr-xs"
      ></q-icon>
      <span>{{ extraerTitulo(accion1) }}</span>
    </q-btn>

    <!-- Accion 2 -->
    <q-btn
      v-if="extraerVisible(accion2)"
      :color="accion2?.color ?? 'primary'"
      rounded
      dense
      push
      no-caps
      no-wrap
      class="q-px-sm"
      @click="ejecutarAccion(accion2)"
    >
      <q-icon
        v-if="accion2?.icono"
        :name="extraerIcono(accion2) ?? ''"
        size="xs"
        class="q-mr-xs"
      ></q-icon>
      <span>{{ extraerTitulo(accion2) }}</span>
    </q-btn>

    <!-- Accion 3 -->
    <q-btn
      v-if="extraerVisible(accion3)"
      :color="accion3?.color ?? 'primary'"
      rounded
      dense
      push
      no-caps
      no-wrap
      class="q-px-sm"
      @click="ejecutarAccion(accion3)"
    >
      <q-icon
        v-if="accion3?.icono"
        :name="extraerIcono(accion3) ?? ''"
        size="xs"
        class="q-mr-xs"
      ></q-icon>
      <span>{{ extraerTitulo(accion3) }}</span>
    </q-btn>

    <!-- Accion 4 -->
    <q-btn
      v-if="extraerVisible(accion4)"
      :color="accion4?.color ?? 'primary'"
      rounded
      dense
      push
      no-caps
      no-wrap
      class="q-px-sm"
      @click="ejecutarAccion(accion4)"
    >
      <q-icon
        v-if="accion4?.icono"
        :name="extraerIcono(accion4) ?? ''"
        size="xs"
        class="q-mr-xs"
      ></q-icon>
      <span>{{ extraerTitulo(accion4) }}</span>
    </q-btn>

    <!-- Accion 5 -->
    <q-btn
      v-if="extraerVisible(accion5)"
      :color="accion5?.color ?? 'primary'"
      rounded
      dense
      push
      no-caps
      no-wrap
      class="q-px-sm"
      @click="ejecutarAccion(accion5)"
    >
      <q-icon
        v-if="accion5?.icono"
        :name="extraerIcono(accion5) ?? ''"
        size="xs"
        class="q-mr-xs"
      ></q-icon>
      <span>{{ extraerTitulo(accion5) }}</span>
    </q-btn>

    <!-- Accion 6 -->
    <q-btn
      v-if="extraerVisible(accion6)"
      :color="accion6?.color ?? 'primary'"
      rounded
      dense
      push
      no-caps
      no-wrap
      class="q-px-sm"
      @click="ejecutarAccion(accion6)"
    >
      <q-icon
        v-if="accion6?.icono"
        :name="extraerIcono(accion6) ?? ''"
        size="xs"
        class="q-mr-xs"
      ></q-icon>
      <span>{{ extraerTitulo(accion6) }}</span>
    </q-btn>
  </span>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { CustomActionTable } from '../domain/CustomActionTable'

const props = defineProps({
  propsTable: {
    type: Object,
    required: true,
  },
  accion1: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion2: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion3: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion4: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion5: {
    type: Object as () => CustomActionTable,
    required: false,
  },
  accion6: {
    type: Object as () => CustomActionTable,
    required: false,
  },
})

function extraerVisible(accion?: CustomActionTable): boolean {
  if (accion && accion.visible && accion.hasOwnProperty('visible')) {
    return accion.visible({
      entidad: props.propsTable.row,
      posicion: props.propsTable.rowIndex,
    })
  } else {
    return accion !== undefined ?? false
  }
}

function extraerIcono(accion?: CustomActionTable) {
  return typeof accion?.icono === 'function'
    ? accion.icono({
        entidad: props.propsTable.row,
        posicion: props.propsTable.rowIndex,
      })
    : accion?.icono
}

function extraerTitulo(accion?: CustomActionTable) {
  return typeof accion?.titulo === 'function'
    ? accion.titulo({
        entidad: props.propsTable.row,
        posicion: props.propsTable.rowIndex,
      })
    : accion?.titulo
}

function ejecutarAccion(accion?: CustomActionTable) {
  accion?.accion({
    entidad: props.propsTable.row,
    posicion: props.propsTable.rowIndex,
  })
}
</script>
