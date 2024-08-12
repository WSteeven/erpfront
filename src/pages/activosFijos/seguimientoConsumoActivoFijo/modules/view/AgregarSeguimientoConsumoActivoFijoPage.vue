<template>
  <simple-layout :mixin="mixinModal">
    <template #formulario>
      <div class="row q-col-gutter-sm q-pa-md">
        <div class="col-12 col-md-3">
          <!-- {{ seguimiento }} -->
          <label class="q-mb-sm block">Seleccione un cliente</label>
          <!-- @filter="filtrarClientes" -->
          <!-- {{ clientesMaterialesStock }} -->
          <q-select
            v-model="seguimiento.cliente"
            :options="clientesMaterialesStock"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="item => item.razon_social"
            :option-value="item => item.cliente_id"
            @update:model-value="
              obtenerActivosFijoPorCliente(seguimiento.cliente)
            "
            emit-value
            map-options
          >
          </q-select>
        </div>

        <div v-if="seguimiento.cliente" class="col-12 col-md-9">
          <label class="q-mb-sm block">Seleccione un activo fijo</label>
          <!-- @filter="filtrarClientes" -->
          <q-select
            v-model="seguimiento.detalle_producto"
            :options="activosFijosAsignados"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="item => item.detalle_producto + ' | ' + item.serial ?? ''"
            :option-value="item => item.detalle_producto_id"
            @update:model-value="
              seleccionarActivoFijo(seguimiento.detalle_producto)
            "
            emit-value
            map-options
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay activos fijos asignados o el stock está en cero
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div v-if="seguimiento.detalle_producto" class="col-12 col-md-3">
          <label class="q-mb-sm block">Stock actual</label>
          <q-input v-model="stockActual" outlined disable dense> </q-input>
        </div>

        <div v-if="seguimiento.detalle_producto" class="col-12 col-md-3">
          <label class="q-mb-sm block">Cantidad a utilizar</label>
          <q-input
            v-model="seguimiento.cantidad_utilizada"
            type="number"
            outlined
            dense
            :error="!!v$.cantidad_utilizada.$errors.length"
            @blur="v$.cantidad_utilizada.$touch"
          >
            <template v-slot:error>
              <div
                v-for="error of v$.cantidad_utilizada.$errors"
                :key="error.$uid"
              >
                <div>{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <div
          v-if="seguimiento.detalle_producto"
          class="col-12 col-md-3 col-sm-3"
        >
          <label class="q-mb-sm block">Canton</label>
          <q-select
            v-model="seguimiento.canton"
            :options="cantones"
            transition-show="jump-up"
            transition-hide="jump-down"
            options-dense
            dense
            outlined
            :input-debounce="0"
            use-input
            @filter="filtrarCantones"
            @popup-show="ordenarLista(cantones, 'canton')"
            :option-value="v => v.id"
            :option-label="v => v.canton"
            emit-value
            map-options
            :error="!!v$.canton.$errors.length"
            @blur="v$.canton.$touch"
          >
            <template v-slot:error>
              <div v-for="error of v$.canton.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>

            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <div v-if="seguimiento.detalle_producto" class="col-12 col-md-3">
          <label class="q-mb-sm block"
            >Categoria de motivo consumo de activo fijo</label
          >
          <q-select
            v-model="seguimiento.categoria_motivo_consumo"
            :options="categoriasMotivosConsumoActivosFijos"
            @filter="filtrarCategoriasMotivosConsumoActivosFijos"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="item => item.nombre"
            :option-value="item => item.id"
            use-input
            input-debounce="0"
            @update:model-value="
              seleccionarActivoFijo(seguimiento.detalle_producto)
            "
            emit-value
            map-options
            :error="!!v$.categoria_motivo_consumo.$errors.length"
            @blur="v$.categoria_motivo_consumo.$touch"
          >
            <template v-slot:error>
              <div
                v-for="error of v$.categoria_motivo_consumo.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>

        <div v-if="seguimiento.detalle_producto" class="col-12 col-md-3">
          <label class="q-mb-sm block">Motivo consumo de activo fijo</label>
          <q-select
            v-model="seguimiento.motivo_consumo"
            :options="motivosConsumoActivosFijos"
            @filter="filtrarMotivosConsumoActivosFijos"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="item => item.nombre"
            :option-value="item => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
            :error="!!v$.motivo_consumo.$errors.length"
            @blur="v$.motivo_consumo.$touch"
          >
            <template v-slot:error>
              <div v-for="error of v$.motivo_consumo.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-select>
        </div>

        <div v-if="seguimiento.detalle_producto" class="col-12 col-md-3">
          <label class="q-mb-sm block">Observación</label>
          <q-input v-model="seguimiento.observacion" outlined dense> </q-input>
        </div>
      </div>
    </template>
  </simple-layout>
</template>

<script src="./AgregarSeguimientoConsumoActivoFijoPage.ts"></script>
