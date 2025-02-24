<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Extensiones Telefónicas"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Empleado -->
          <div class="col-12 col-md-6 q-mb-md">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="asignacion.empleado"
              :options="opcionesEmpleados"
              hint="Seleccione un empleado"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filterFnEmpleados"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Extensiones -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Extensiones Telefónicas</label>
            <q-input
              v-model="asignacion.extensiones"
              placeholder="Ingrese una o varias extensiones"
              outlined
              dense
              type="text"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ExtensionTelefonicaPage.ts"></script>
