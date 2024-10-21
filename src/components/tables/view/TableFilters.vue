<template>
  <div class="column q-col-gutter-xs q-mb-xl full-width">
    <small
      class="bg-solid justify-between row items-center q-mb-sm q-pb-xs q-px-md border-callout-info"
    >
      <span
        ><q-icon
          name="bi-info-circle-fill"
          color="info"
          size="sm"
          class="q-mr-sm"
        ></q-icon>
        Para filtrar entre rangos de fecha use el operador <b>start</b> para la
        fecha de inicio y <b>end</b> para la fecha de fin.</span
      >
      <q-btn
        rounded
        flat
        no-caps
        dense
        color="primary"
        @click="() => (verEjemploFiltrosAvanzados = true)"
      >
        <q-icon name="bi-eye" class="q-mr-sm"></q-icon>
        Ver ejemplo</q-btn
      >
    </small>

    <q-dialog v-model="verEjemploFiltrosAvanzados" full-width>
      <q-card class="bg-transparent no-border" flat>
        <q-toolbar class="bg-body" rounded>
          <q-toolbar-title class="text-primary text-subtitle1"
            ><span>{{
              'Ejemplo de filtro por rango de fecha'
            }}</span></q-toolbar-title
          >

          <div class="row q-gutter-x-sm">
            <q-btn
              round
              dense
              unelevated
              color="red"
              size="sm"
              @click="verEjemploFiltrosAvanzados = false"
            >
              <q-icon name="bi-x-lg" size="14px"></q-icon>
              <q-tooltip class="bg-dark">Cerrar</q-tooltip>
            </q-btn>
          </div>
        </q-toolbar>

        <q-card-section class="bg-body rounded-footer">
          <p>
            Debe seleccionar el mismo campo dos veces. En el primer campo use
            START para indicar la <b>fecha de inicio</b> de la búsqueda mientras
            que en el segundo campo deberá usar END para indicar la
            <b>fecha de fin</b>.
          </p>
          <q-img src="~assets/img/intervalo_fecha.png"></q-img>
        </q-card-section>
      </q-card>
    </q-dialog>

    <div
      v-for="(filtro, index) in columnas"
      :key="index"
      class="q-py-sm q-col-gutter-sm items-center full-width"
      :class="{ column: $q.screen.xs, row: !$q.screen.xs }"
    >
      <!-- Campo -->
      <div class="row col-md-4 items-center">
        <!-- <span class="col-md-2">Campo</span> -->
        <q-select
          outlined
          v-model="filtro.field"
          :options="configuracionColumnasFilter"
          hint="Campo"
          :option-label="item => item.label"
          :option-value="item => item.field"
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
        <!-- <span class="col-md-4">Operador</span> -->
        <q-select
          outlined
          v-model="filtro.operador"
          :options="filtro.operadores"
          hint="Operador"
          class="col-md-8"
          dense
          options-dense
        />
      </div>

      <!-- Valor -->
      <div class="row col-md-4 items-center">
        <!-- <span class="col-md-2">Valor</span> -->

        <q-checkbox
          v-if="filtro.type === 'boolean'"
          v-model="filtro.value"
          true-value="1"
          false-value="0"
          >{{ filtro.field }}
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
          placeholder="Valor"
          hint="Valor"
          dense
          clearable
          :class="{
            'col-md-6': filtro.type === 'datetime',
            'col-md-10': filtro.type !== 'datetime'
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

      <div class="row col-md-2 items-center">
        <q-btn
          color="negative"
          no-caps
          unelevated
          rounded
          dense
          class="full-width"
          @click="quitarFiltro(index)"
        >
          <q-icon name="bi-x"></q-icon>
          Quitar</q-btn
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Ref, defineComponent, ref } from 'vue'
import { ColumnConfig } from '../domain/ColumnConfig'
import { maskFecha } from 'config/utils'
import { formatearFechaHora } from 'shared/utils'

export default defineComponent({
  props: {
    configuracionColumnas: {
      type: Object as () => ColumnConfig<EntidadAuditable>[],
      required: true
    }
  },
  emits: ['filtrar'],
  setup(props, { emit }) {
    const operadoresNumeradores = ['<', '<=', '>', '>=', 'start', 'end']
    const operadores = [...operadoresNumeradores, '!=', 'like']
    const columnas: Ref<any[]> = ref([])

    const configuracionColumnasFilter = props.configuracionColumnas.filter(
      (columna: ColumnConfig<EntidadAuditable>) =>
        !columna.hasOwnProperty('filtrar') || columna.filtrar
    )

    function agregarFiltro() {
      columnas.value.push({})
    }

    function establecerInputType(index: number, filtro: ColumnConfig<any>) {
      const campo: ColumnConfig<EntidadAuditable> =
        props.configuracionColumnas.filter(
          (elemento: ColumnConfig<EntidadAuditable>) =>
            elemento.field === filtro.field
        )[0]
      columnas.value[index].type = campo.type
      columnas.value[index].options = campo.options
      columnas.value[index].operador = campo.operador
      columnas.value[index].operadores = obtenerOperadores(filtro)
      columnas.value[index].value = campo.type === 'boolean' ? '0' : null
      // columnas.value[index].type == 'boolean' ? false : null
    }

    function obtenerUri(filtro: any) {
      /*if (filtro.operador === 'like')
        return `${filtro.field}[${filtro.operador}]=%${filtro.value}%`
      else*/
      let valor = ''

      if (filtro.type === 'datetime')
        valor = formatearFechaHora(filtro.value, filtro.value2)
      else valor = filtro.value

      if (operadoresNumeradores.includes(filtro.operador)) {
        if (
          filtro.type === 'date' &&
          ['start', 'end'].includes(filtro.operador)
        )
          return `${filtro.field}[${filtro.operador}]=${valor}`
        else
          return `${filtro.field}[operator]=${filtro.operador}&${filtro.field}[value]=${valor}`
      } else {
        console.log(`${filtro.field}=${valor}`)
        return filtro.operador === 'like'
          ? `${filtro.field}[${filtro.operador}]=${valor}` // Se recomiendo no enviar el valor %7887% con porcentajes xq se llega asi �78% al backend
          : `${filtro.field}=${valor}`
      }
    }

    function obtenerOperadores(filtro: any) {
      if (filtro.hasOwnProperty('type')) {
        if (['boolean', 'select'].includes(filtro.type)) return ['=']
        //if (['datetime'].includes(filtro.type)) return ['like']
        if (['number', 'date', 'datetime'].includes(filtro.type))
          return ['=', ...operadoresNumeradores]
      }

      return ['=', 'like']
    }

    function quitarFiltro(index: number) {
      columnas.value.splice(index, 1)
    }

    function filtrar() {
      columnas.value = columnas.value.filter(
        filtro => filtro.field || filtro.value
      )

      const uri = columnas.value.map(filtro => obtenerUri(filtro)).join('&')
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
      verEjemploFiltrosAvanzados: ref(false)
    }
  }
})
</script>
