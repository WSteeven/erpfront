<template>
  <q-page padding>
    <q-card class="rounded-card q-mb-md">
      <q-card-section>
        <b>Movilización entre trabajos</b>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md">
            <div class="col-12 col-md-10">
              <label class="q-mb-sm block">Seleccione un empleado</label>
              <q-select
                v-model="reporteMovilizacion.empleado"
                :options="empleados"
                @filter="filtrarEmpleados"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :option-label="(item) => item.nombres + ' ' + item.apellidos"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
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

            <div class="col-12 col-md-2">
              <label v-if="!$q.screen.xs" class="q-mb-sm block">&nbsp;</label>
              <q-btn
                color="primary"
                type="submit"
                class="full-width"
                no-caps
                push
                @click="buscar()"
              >
                <q-icon name="bi-search" size="xs" class="q-pr-sm"></q-icon>
                <span>Buscar</span>
              </q-btn>
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>

    <essential-table
      v-if="listado.length"
      titulo="Resultados"
      :configuracionColumnas="configuracionColumnasMovilizacionSubtarea"
      :datos="listado"
      :mostrarBotones="false"
      :permitirConsultar="false"
      :permitirEditar="false"
      :permitirEliminar="false"
      :alto-fijo="false"
      :mostrar-header="true"
      :permitir-buscar="false"
    >
    </essential-table>
  </q-page>
</template>

<script src="./ReporteMovilizacionSubtareaPage.ts"></script>
