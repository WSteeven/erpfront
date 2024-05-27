<template>
  <q-page padding>
    <q-card flat class="q-mb-sm bg-desenfoque border-white">
      <q-card-section class="row q-col-gutter-sm">
        <div class="col-12 col-md-5">
          <label class="q-mb-sm block"> Seleccione el año para consultar</label>
          <q-input
            v-model="filtro.anio"
            readonly
            outlined
            dense
          >
            <template v-slot:append>
              <q-btn
                name="event"
                no-caps
                icon="bi-calendar"
                label="Haga clic para seleccionar un año"
                unelevated
                square
              >
                <!-- <q-icon  class="cursor-pointer" color="blue-10"> -->
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                  v-model="isYear"
                >
                  <q-date
                    v-model="filtro.anio"
                    minimal
                    mask="YYYY"
                    emit-immediately
                    default-view="Years"
                    @update:model-value="checkValue"
                  >
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="Cerrar"
                        color="primary"
                        flat
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-btn>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-5">
          <label class="q-mb-sm block">Tipo cuestionario</label>
          <q-select
            v-model="filtro.tipo_cuestionario"
            :options="tiposCuestionarios"
            transition-show="scale"
            transition-hide="scale"
            hint="Obligatorio"
            options-dense
            dense
            outlined
            :option-label="(item) => item.titulo"
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

        <div class="col-12 col-md-2">
          <label class="q-mb-sm block">&nbsp;</label>
          <q-btn color="primary" label="Consultar" icon="bi-search" class="full-width" no-caps @click="reporte()"></q-btn>
        </div>
      </q-card-section>
    </q-card>

    <transition name="scale" mode="out-in">
      <div v-if="listado.length">
        <essential-table
          titulo="Empleados que respondieron el cuestionario en el año seleccionado"
          :configuracionColumnas="[
            ...ConfiguracionColumnasReporteCuestionarioEmpleado,
          ]"
          :datos="listado"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :accion1Header="btnImprimirReporte"
          :accion2Header="btnImprimirRespuestas"
        >
        </essential-table>
      </div>
    </transition>
  </q-page>
</template>

<script src="./ReporteCuestionarioPsicosocial.ts" />
