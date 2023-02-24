<template>
  <div
    v-if="configuracionColumnas && configuracionColumnas.length > 0"
    class="row q-col-gutter-xs q-py-xs col-12"
  >
    <div
      v-for="filtro in camposFiltro"
      :key="filtro.field"
      class="col-md-2 col-12 q-mb-md"
    >
      <br v-if="filtro.type === 'boolean'" />
      <label v-else class="q-mb-sm block">{{ filtro.label }}</label>

      <!-- Boolean -->
      <q-checkbox
        v-if="filtro.type === 'boolean'"
        v-model="filtro.value"
        @update:model-value="emitEvent()"
        >{{ filtro.label }}
      </q-checkbox>

      <!-- Select -->
      <q-select
        v-if="filtro.type === 'select'"
        outlined
        v-model="filtro.value"
        :options="filtro.options"
        @update:model-value="emitEvent()"
        dense
        clearable
      />

      <!-- Else -->
      <q-input
        v-if="!['boolean', 'select'].includes(filtro.type)"
        v-model="filtro.value"
        :type="filtro.type !== 'date' ? filtro.type : null"
        @update:model-value="emitEvent()"
        outlined
        dense
        clearable
      >
        <template v-if="filtro.type === 'date'" v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date
                v-model="filtro.value"
                :mask="maskFecha"
                today-btn
                @update:model-value="emitEvent()"
              >
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Cerrar" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>
  </div>
</template>

<script lang="ts">
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { defineComponent, onMounted, reactive } from 'vue'
import { ColumnConfig } from '../domain/ColumnConfig'
import { maskFecha } from 'config/utils'

export default defineComponent({
  props: {
    configuracionColumnas: {
      type: Object as () => ColumnConfig<EntidadAuditable>[],
      required: true,
    },
  },
  emits: ['filtrosEditados'],
  setup(props, { emit }) {
    const camposFiltro = reactive(
      props.configuracionColumnas.flatMap((filtro: any) => {
        if (filtro.field !== 'acciones') {
          return {
            field: filtro.field,
            label: filtro.label,
            value: null,
            type: filtro.type,
            options: filtro.options,
          }
        } else {
          return []
        }
      })
    )

    const emitEvent = function () {
      const filtros: any = new Object()
      camposFiltro.forEach((filtro: any) => {
        filtros[filtro.field] = determinarValor(filtro)
      })

      emit('filtrosEditados', filtros)
    }

    onMounted(() => emitEvent())

    const determinarValor = (filtro: any) => {
      return filtro.value === '' ? null : filtro.value
    }

    const resetearFiltros = () => {
      const filtros: any = new Object()
      camposFiltro.forEach((filtro: any) => {
        filtros[filtro.field] = null
      })

      emit('filtrosEditados', filtros)
    }

    function reset() {
      return props.configuracionColumnas.flatMap((filtro: any) => {
        if (filtro.field !== 'acciones') {
          return {
            field: filtro.field,
            label: filtro.label,
            value: null,
            type: filtro.type,
            options: filtro.options,
          }
        } else {
          return []
        }
      })
    }

    return {
      camposFiltro,
      emitEvent,
      resetearFiltros,
      maskFecha,
    }
  },
})
</script>
