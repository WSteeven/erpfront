<template>
  <div class="overflow-auto q-mb-sm">
    <table :class="estilos">
      <thead>
        <tr>
          <th
            v-for="(columna, index) in configuracionColumnas"
            :key="index"
            class="text-left"
            :class="{ 'mini-texto': dense }"
          >
            {{ columna.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(fila, index) in elementos" :key="index">
          <td
            v-for="(celda, index) in fila"
            :key="index"
            class="text-no-wrap"
            :class="{ 'mini-texto': dense }"
          >
            {{ celda }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <deslizar-movil></deslizar-movil>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ColumnConfig } from '../domain/ColumnConfig'
import DeslizarMovil from './DeslizarMovil.vue'

export default defineComponent({
  components: { DeslizarMovil },
  props: {
    configuracionColumnas: {
      type: Object as () => ColumnConfig<any>[],
      required: true,
    },
    elementos: {
      type: Array,
      required: true,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    estilos: {
      type: String,
      required: false,
    },
  },
  setup() {
    //
  },
})
</script>

<style lang="scss" scoped>
thead {
  background-color: #fff;
}

table {
  border-collapse: collapse;
  width: 100%;

  td,
  th {
    border: 1px solid #ddd;
    padding: 6px 12px;
  }
}
</style>
