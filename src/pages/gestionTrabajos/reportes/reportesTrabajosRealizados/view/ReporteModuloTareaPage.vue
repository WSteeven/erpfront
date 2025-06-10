<template>
  <q-page padding>
    <q-card flat class="q-mb-md bg-desenfoque" square>
      <q-card-section>
        <div class="text-bold q-mb-md">Análisis de datos: Módulo de tareas</div>

        <!-- Tiempos -->
        <div class="row q-col-gutter-sm q-mb-lg">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">
              Seleccione mes y año a consultar</label
            >
            <q-input
              v-model="filtro.mes_anio"
              placeholder="Obligatorio"
              mask="##-####"
              :error="!!v$.mes_anio.$errors.length"
              @blur="v$.mes_anio.$touch"
              readonly
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                    v-model="is_month"
                  >
                    <q-date
                      v-model="filtro.mes_anio"
                      minimal
                      emit-immediately
                      mask="MM-YYYY"
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
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.mes_anio.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-5">
            <label class="q-mb-sm block">Cliente corporativo</label>
            <q-select
              v-model="filtro.cliente"
              :options="clientes"
              @filter="filtrarClientes"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="item => item.razon_social"
              :option-value="item => item.id"
              :option-disable="item => (item.id === 1 ? true : false)"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="consultarCliente()"
              :error="!!v$.cliente.$errors.length"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Seleccione el tipo de trabajo</label>
            <q-select
              v-model="filtro.tipo_trabajo"
              :options="tiposTrabajos"
              @filter="filtrarTiposTrabajos"
              transition-show="scale"
              transition-hide="scale"
              hint="Obligatorio"
              options-dense
              dense
              outlined
              :option-label="item => item.descripcion"
              :option-value="item => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              @update:model-value="consultarTipoTrabajo()"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Seleccione cliente corporativo
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>

        <q-separator class="q-mb-md"></q-separator>

        <!-- Tipos de trabajos realizados -->
        <div class="text-bold">
          <q-icon name="bi-bar-chart-line-fill" class="q-mr-sm" />
          Suma total de tipos de trabajos realizados
        </div>

        <div class="row q-col-gutter-sm q-pa-md q-mb-xl">
          <!-- <div class="col-12 col-md-6">
            <table-view
              v-if="trabajosRealizados.length"
              :configuracion-columnas="configuracionColumnasSubtareasRealizadas"
              :elementos="trabajosRealizados"
            ></table-view>
          </div> -->

          <div class="col-12 col-md-6">
            <!-- v-if="trabajosRealizadosBar" -->
            <grafico-generico
              :data="trabajosRealizadosBar"
              :options="options"
              tipo="bar"
              @click="mostrarTablaSubtareas"
            />
          </div>
        </div>

        <q-separator class="q-mb-md"></q-separator>

        <!-- Trabajos realizados por region -->
        <div class="text-bold">
          <q-icon name="bi-bar-chart-line-fill" class="q-mr-sm"></q-icon>
          Trabajos realizados por región
        </div>
        <div class="row q-col-gutter-sm q-pa-md q-mb-xl">
          <!-- <div class="col-12 col-md-6">
            <table-view
              :configuracion-columnas="
                configuracionColumnasSubtareasRealizadasPorRegion
              "
              :elementos="trabajoRealizadoPorRegion"
            ></table-view>
          </div> -->
          <div class="col-12 col-md-6">
            <grafico-generico
              :data="trabajoRealizadoPorRegionBar"
              :options="options"
              tipo="bar"
              @click="mostrarTablaSubtareas"
            />
          </div>
        </div>

        <q-separator class="q-mb-md"></q-separator>

        <!-- Trabajos realizados por region y tipo de trabajo -->
        <div class="text-bold">
          <q-icon name="bi-bar-chart-line-fill" class="q-mr-sm"></q-icon>
          Trabajos realizados por región y tipo de trabajo
        </div>
        <div class="row q-col-gutter-sm q-pa-md q-mb-xl">
          <!-- <div class="col-12 col-md-6">
            <table-view
              v-if="trabajoRealizadoPorRegionTipoTrabajo.length"
              :configuracion-columnas="
                configuracionColumnasSubtareasRealizadasPorRegion
              "
              :elementos="trabajoRealizadoPorRegionTipoTrabajo"
            ></table-view>
          </div> -->

          <div class="col-12 col-md-6">
            <grafico-generico
              :data="trabajoRealizadoPorRegionTipoTrabajoBar"
              :options="options"
              tipo="bar"
              @click="mostrarTablaSubtareas"
            />
          </div>
        </div>

        <q-separator class="q-mb-md"></q-separator>

        <!-- Trabajos realizados por grupo y tipo de trabajo -->
        <div class="text-bold">
          <q-icon name="bi-bar-chart-line-fill" class="q-mr-sm"></q-icon>
          Trabajos realizados por grupo y tipo de trabajo
        </div>
        <div class="row q-col-gutter-sm q-pa-md q-mb-xl">
          <!-- <div class="col-12 col-md-6">
            <table-view
              v-if="trabajoRealizadoPorGrupoTipoTrabajo.length"
              :configuracion-columnas="
                configuracionColumnasSubtareasRealizadasPorGrupo
              "
              :elementos="trabajoRealizadoPorGrupoTipoTrabajo"
            ></table-view>
          </div> -->

          <div class="col-12 col-md-6">
            <grafico-generico
              :data="trabajoRealizadoPorGrupoTipoTrabajoBar"
              :options="options"
              tipo="bar"
              @click="mostrarTablaSubtareas"
            />
          </div>
        </div>

        <q-separator class="q-mb-md"></q-separator>

        <!-- Trabajos realizados por grupo y tipos de trabajos EMERGENCIA -->
        <div class="text-bold">
          <q-icon name="bi-bar-chart-line-fill" class="q-mr-sm"></q-icon>
          Trabajos realizados por grupo y tipos de trabajos de EMERGENCIA
        </div>
        <div class="row q-col-gutter-sm q-pa-md q-mb-xl">
          <div class="col-12 col-md-6">
            <table-view
              :configuracion-columnas="
                configuracionColumnasSubtareasRealizadasPorGrupoTiposTrabajosEmergencia
              "
              :elementos="trabajoRealizadoPorGrupoTiposTrabajosEmergencia"
            ></table-view>
          </div>

          <div class="col-12 col-md-6">
            <!-- v-if="trabajosRealizadosBar" -->
            <grafico-generico
              :data="trabajosRealizadosBar"
              :options="options"
              tipo="bar"
              @click="mostrarTablaSubtareas"
            />
          </div>

          <div class="col-12">
            <Bar
              v-if="trabajoRealizadoPorGrupoTiposTrabajosEmergenciaBar"
              :data="trabajoRealizadoPorGrupoTiposTrabajosEmergenciaBar"
              :options="optionsVertical"
            />
          </div>
        </div>

        <q-separator class="q-mb-md"></q-separator>

        <!-- Trabajos realizados por grupo y causas de intervencion -->
        <div class="text-bold">
          <q-icon name="bi-bar-chart-line-fill" class="q-mr-sm"></q-icon>
          Trabajos realizados por grupo y causas de intervención
        </div>
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="row col-12 q-col-gutter-y-xl q-col-gutter-x-md">
            <div
              v-for="(grafico, index) in graficosCausaIntervencion"
              :key="index"
              class="col-12 col-md-6 text-center"
            >
              <div class="text-center row justify-center" style="height: 300px">
                <grafico-generico
                  :data="grafico"
                  :options="options"
                  tipo="bar"
                  @click="mostrarTablaSubtareas"
                />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="modalAbierto" full-width>
      <q-card class="bg-transparent no-border" flat>
        <q-toolbar class="bg-body rounded-header">
          <q-avatar square>
            <img :src="!$q.dark.isActive ? logoClaro : logoOscuro" />
          </q-avatar>

          <q-toolbar-title class="text-primary text-subtitle1"
            ><span>{{ titulo }}</span></q-toolbar-title
          >

          <div class="row q-gutter-x-sm">
            <q-btn
              round
              dense
              unelevated
              color="red"
              size="sm"
              v-close-popup
            >
              <q-icon name="bi-x-lg" size="14px"></q-icon>
              <q-tooltip class="bg-dark">Cerrar</q-tooltip>
            </q-btn>
          </div>
        </q-toolbar>

        <q-card-section class="bg-body rounded-footer">
          <essential-table
            titulo="Subtareas"
            :configuracionColumnas="columnasSubtareas"
            :datos="subtareas"
            :permitirConsultar="false"
            :permitirEditar="false"
            :permitirEliminar="false"
            :mostrarBotones="false"
            :alto-fijo="false"
            :accion1="botonVer"
            :accion2="btnSeguimiento"
            :mostrar-exportar="true"
          ></essential-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>

  <modales-entidad
    :comportamiento="modalesSubtarea"
    :mixin-modal="mixinSubtarea"
    :persistent="false"
    :mostrar-listado="false"
  />
</template>

<script src="./ReporteModuloTareaPage.ts"></script>
