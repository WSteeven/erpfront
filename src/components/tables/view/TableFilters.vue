<template>
  <div class="column q-col-gutter-xs q-mb-xl full-width">
    <div
      v-for="(filtro, index) in columnas"
      :key="index"
      class="q-col-gutter-x-sm items-center full-width"
      :class="{ column: $q.screen.xs, row: !$q.screen.xs }"
    >
      <!-- Campo -->
      <div class="row col-md-4 items-center">
        <span class="col-md-2">Campo</span>
        <q-select
          outlined
          v-model="filtro.field"
          :options="configuracionColumnasFilter"
          :option-label="(item) => item.label"
          :option-value="(item) => item.field"
          @update:model-value="establecerInputType(index, filtro)"
          class="col-md-10"
          dense
          options-dense
          emit-value
          map-options
        />
      </div>

      <!-- Operador -->
      <div class="row col-md-2 items-center">
        <span class="col-md-4">Operador</span>
        <q-select
          outlined
          v-model="filtro.operador"
          :options="filtro.operadores"
          class="col-md-8"
          dense
          options-dense
        />
      </div>

      <!-- Valor -->
      <div class="row col-md-4 items-center">
        <span class="col-md-2">Valor</span>

        <q-checkbox v-if="filtro.type === 'boolean'" v-model="filtro.value"
          >{{ filtro.label }}
        </q-checkbox>

        <q-select
          v-if="filtro.type === 'select'"
          outlined
          v-model="filtro.value"
          :options="filtro.options"
          class="col-md-10"
          dense
          options-densed
          clearable
        />

        <q-input
          v-if="!['boolean', 'select'].includes(filtro.type ?? '')"
          v-model="filtro.value"
          :type="filtro.type !== 'date' ? filtro.type : null"
          outlined
          dense
          clearable
          :class="{
            'col-md-6': filtro.type === 'datetime',
            'col-md-10': filtro.type !== 'datetime',
          }"
        >
          <template
            v-if="['date', 'datetime'].includes(filtro.type)"
            v-slot:append
          >
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="filtro.value" :mask="maskFecha" today-btn>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          class="col-md-4"
          v-if="filtro.type === 'datetime'"
          v-model="filtro.value2"
          type="time"
          step="1"
          stack-label
          outlined
          clearable
          dense
        >
        </q-input>
      </div>

      <div class="row col-md-1 items-center">
        <q-btn
          color="negative"
          round
          push
          no-caps
          icon="bi-x"
          @click="quitarFiltro(index)"
        ></q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Ref, defineComponent, ref } from 'vue'
import { ColumnConfig } from '../domain/ColumnConfig'
import { maskFecha } from 'config/utils'
import { date } from 'quasar'
import { formatearFecha, formatearFechaHora } from 'shared/utils'

export default defineComponent({
  props: {
    configuracionColumnas: {
      type: Object as () => ColumnConfig<EntidadAuditable>[],
      required: true,
    },
  },
  emits: ['filtrar'],
  setup(props, { emit }) {
    const operadoresNumeradores = ['<', '<=', '>', '>=']
    const operadores = [...operadoresNumeradores, '!=', 'like']
    const columnas: Ref<any[]> = ref([])

    const configuracionColumnasFilter = props.configuracionColumnas.filter(
      (columna: ColumnConfig<EntidadAuditable>) =>
        !columna.hasOwnProperty('filtrar') || columna.filtrar
    )

    function agregarFiltro() {
      columnas.value.push({})
    }

    function establecerInputType(index: number, filtro: any) {
      const campo: ColumnConfig<EntidadAuditable> =
        props.configuracionColumnas.filter(
          (elemento: ColumnConfig<EntidadAuditable>) =>
            elemento.field === filtro.field
        )[0]
      columnas.value[index].type = campo.type
      columnas.value[index].options = campo.options
      columnas.value[index].operador = null
      columnas.value[index].operadores = obtenerOperadores(filtro)
      columnas.value[index].value =
        columnas.value[index].type == 'boolean' ? false : null
    }

    function obtenerUri(filtro: any) {
      /*if (filtro.operador === 'like')
        return `${filtro.field}[${filtro.operador}]=%${filtro.value}%`
      else*/
      let valor = ''

      if (filtro.type === 'date') valor = formatearFecha(filtro.value)
      else if (filtro.type === 'datetime')
        valor = formatearFechaHora(filtro.value, filtro.value2)
      else valor = filtro.value

      console.log(valor)

      if (operadoresNumeradores.includes(filtro.operador)) {
        return `${filtro.field}[operator]=${filtro.operador}&${filtro.field}[value]=${valor}`
      } else {
        console.log(`${filtro.field}=${valor}`)
        return `${filtro.field}=${valor}`
      }
    }

    function obtenerOperadores(filtro: any) {
      if (filtro.hasOwnProperty('type')) {
        if (['boolean', 'select'].includes(filtro.type)) return ['=']
        //if (['datetime'].includes(filtro.type)) return ['like']
        if (['number', 'date', 'datetime'].includes(filtro.type))
          return ['=', ...operadoresNumeradores]
      }

      return ['=']
    }

    function quitarFiltro(index: number) {
      columnas.value.splice(index, 1)
    }

    function filtrar() {
      const uri = columnas.value.map((filtro) => obtenerUri(filtro)).join('&')
      console.log(uri)
      emit('filtrar', uri)
    }

    const resetearFiltros = () => {
      columnas.value = []
    }

    return {
      filtrar,
      resetearFiltros,
      maskFecha,
      operadores,
      columnas,
      agregarFiltro,
      establecerInputType,
      quitarFiltro,
      configuracionColumnasFilter,
    }
  },
})
</script>
