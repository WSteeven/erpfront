<template>
  <table class="full-width">
    <thead>
      <tr>
        <th
          v-for="(columna, index) in configuracionColumnas"
          :key="index"
          class="mini-texto"
        >
          {{ columna.label }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(fila, indice) in datosImprimir" :key="indice">
        <td v-for="(valor, clave) in fila" :key="clave" class="mini-texto">
          {{ valor }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps(['configuracionColumnas', 'datos'])

function wrapCsvValue(val, formatFn?, row?) {
  let formatted = formatFn !== void 0 ? formatFn(val, row) : val

  formatted =
    formatted === void 0 || formatted === null ? '' : String(formatted)

  return `${formatted}`
}

const datosImprimir = computed(() =>
  props.datos.map((row: any) =>
    props.configuracionColumnas.map((col: any) =>
      wrapCsvValue(
        typeof col.field === 'function'
          ? col.field(row)
          : row[col.field === void 0 ? col.name : col.field],
        col.format,
        row
      )
    )
  )
)
</script>

<style>
thead {
  background-color: #eee;
}

table {
  border-collapse: collapse;
}
</style>
