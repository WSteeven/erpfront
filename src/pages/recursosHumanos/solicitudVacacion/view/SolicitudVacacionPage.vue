<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :tabOptions="tabOptionsVacaciones"
    :full="true"
    :permitirEditar="false"
    :permitirEliminar="false"
    :mostrarButtonSubmits="true"
    :filtrar="filtrarSolicitudes"
    :tabDefecto="tabDefecto"
    :forzarListar="true"
    ajustar-celdas
    :accion1="editarVacacion"
    :accion2="btnAnular"
    :accion3="btnImprimir"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md q-mt-md q-mx-md q-py-sm">
          <!-- Empleado -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Empleado </label>
            <q-select
              v-model="solicitud.empleado"
              :options="empleados"
              options-dense
              clearable
              dense
              outlined
              disable
              :option-label="item => item.apellidos + ' ' + item.nombres"
              :option-value="item => item.id"
              map-options
            />
          </div>

          <!--Periodos -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Periodo</label>
            <q-select
              v-model="solicitud.periodo"
              :options="periodos"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="accion!==acciones.nuevo"
              :readonly="disabled"
              :error="!!v$.periodo.$errors.length"
              error-message="Debes seleccionar un periodo"
              use-input
              @blur="v$.periodo.$touch"
              @update:model-value="periodoSeleccionado"
              input-debounce="0"
              :option-value="v => v.periodo"
              :option-label="v => v.periodo"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.periodo }}</q-item-label>
                    <q-item-label caption
                    >Días disponibles: {{scope.opt.dias_disponibles}} </q-item-label
                    >
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:error>
                <error-component clave="periodo" :v$="v$"/>
              </template>
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>

          <!-- Dias disponibles -->
          <div class="col-4 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Días disponibles para tomar</label>
            <q-input v-model="dias_disponibles" disable outlined dense />
          </div>

          <!-- Días restantes -->
          <div class="col-4 col-md-3 col-sm-6">
            <label class="q-mb-sm block">Días restantes</label>
            <q-input v-model="dias_restantes" disable outlined dense />
          </div>

          <!-- Numero de  rango-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Días que voy a tomar</label>
            <q-input
              v-model="solicitud.dias_solicitados"
              :disable="disabled"
              min="0"
              :max="dias_disponibles"
              type="number"
              :error="!!v$.dias_solicitados.$errors.length"
              :error-message="'Solo puedes ingresar máximo '+dias_disponibles+' día/s'"
              @update:model-value="calcularFechaFin"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="dias_solicitados" :v$="v$"/>
              </template>
            </q-input>
          </div>
          <!-- Fecha Inicio -->
          <div class="col-12 col-md-3" >
            <label class="q-mb-sm block">Fecha Inicio</label>
            <q-input
              v-model="solicitud.fecha_inicio"
              placeholder="Obligatorio"
              :error="!!v$.fecha_inicio.$errors.length"
              :disable="disabled"
              readonly
              @blur="v$.fecha_inicio.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="solicitud.fecha_inicio"
                      :mask="maskFecha"
                      :options="optionsFechaInicio"
                      @update:model-value="calcularFechaFin"
                      today-btn
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
                <error-component clave="fecha_inicio" :v$="v$"/>
              </template>
            </q-input>
          </div>

<!--          {{dias_disponibles }}::::{{v$}}-->

          <!-- Fecha Fin  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha Fin</label>
            <q-input
              v-model="solicitud.fecha_fin"
              :error="!!v$.fecha_fin.$errors.length"
              disable
              @blur="v$.fecha_fin.$touch"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="solicitud.fecha_fin"
                      :mask="maskFecha"
                      today-btn
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
                <error-component clave="fecha_fin" :v$="v$"/>
              </template>
            </q-input>
          </div>

          <!-- observacion -->
          <div class="col-12 col-md-3" v-if="esAutorizador">
            <label class="q-mb-sm block">Observacion</label>
            <q-input
              v-model="solicitud.observacion"
              placeholder="Obligatorio"
              :disable="!esAutorizador"
              :error="!!v$.observacion.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="observacion" :v$="v$"/>
              </template>
            </q-input>
          </div>

          <!-- Autorizacion -->
          <div
            class="col-12 col-md-3"
            v-if="accion == acciones.editar && esAutorizador"
          >
            <label
              color="light-green-2"
              class="text-positive text-bold q-mb-sm inline-block bg-light-green-2 rounded q-px-md"
            >Autorización
            </label>
            <q-select
              v-model="solicitud.autorizacion"
              :options="autorizaciones"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :disable="!esAutorizador"
              :option-value="v => v.id"
              :option-label="v => v.nombre"
              emit-value
              map-options
            >
              <template v-slot:no-option>
                <no-option-component/>
              </template>
            </q-select>
          </div>
          <!-- Reemplazo -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Reemplazo <i class="bi bi-info-circle" /><q-tooltip class="bg-dark">La persona que cubrira su puesto durante sus vacaciones</q-tooltip></label>
            <q-select
              v-model="solicitud.reemplazo"
              :options="empleados"
              options-dense
              clearable
              dense
              outlined
              :disable="disabled"
              use-input
              input-debounce="0"
              @popup-show="ordenarLista(empleados, 'apellidos')"
              @filter="filtrarEmpleados"
              :option-label="item => item.apellidos + ' ' + item.nombres"
              :option-value="item => item.id"
              :error="!!v$.reemplazo.$errors.length"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="reemplazo" :v$="v$"/>
              </template>
              <template v-slot:no-option>
               <no-option-component/>
              </template>
            </q-select>
          </div>

          <!-- funciones -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Funciones (reemplazo)</label>
            <q-input
              v-model="solicitud.funciones"
              placeholder="Obligatorio"
              autogrow
              :disable="disabled"
              :error="!!v$.funciones.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="funciones" :v$="v$"/>
              </template></q-input
            >
          </div>
        </div>

      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./SolicitudVacacionPage.ts"></script>
