<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Tipo de tareas"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Cliente -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cliente</label>
            <q-select
              v-model="tipoTarea.cliente"
              :options="clientes"
              @filter="filtrarClientes"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
            >
              <!-- @update:model-value="obtenerResponsable(subtarea.grupo)" -->
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <!--<q-input
              v-model="criterioBusquedaCliente"
              placeholder="Obligatorio"
              @update:model-value="
                (v) => (criterioBusquedaCliente = v.toUpperCase())
              "
              :readonly="disabled"
              hint="Presiona Enter para seleccionar un cliente"
              @keydown.enter="listarClientes()"
              @blur="criterioBusquedaCliente === '' ? limpiarCliente() : null"
              autofocus
              outlined
              dense
              :error="!!v$.cliente.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input> -->
          </div>

          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="tipoTarea.nombre"
              placeholder="Obligatorio"
              @update:model-value="(v) => (tipoTarea.nombre = v.toUpperCase())"
              :readonly="disabled"
              outlined
              dense
              :error="!!v$.nombre.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-form>

      <essential-selectable-table
        ref="refListadoSeleccionableClientes"
        :configuracion-columnas="configuracionColumnasClientes"
        :datos="listadoClientes"
        @selected="seleccionarCliente"
      ></essential-selectable-table>
    </template>
  </tab-layout>
</template>

<script src="./TipoTareaPage.ts"></script>
