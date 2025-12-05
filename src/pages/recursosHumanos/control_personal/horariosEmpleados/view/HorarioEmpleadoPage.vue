<template>
  <tab-layout-filter-tabs2
    :configuracion-columnas="configuracionColumnas"
    :mixin="mixin"
    titulo-pagina="Horario de Empleados"
    :tab-options="tabOptions"
    :tab-defecto="currentTab"
    :filtrar="filtrarHorarios"
    :initial-search="searchTable"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-sm">

          <!-- Empleado -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Empleado</label>
            <q-select
              v-model="horario_empleado.empleado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              :disable="disabled"
              options-dense
              dense
              outlined
              :error="!!v$.empleado.$errors.length"
              @blur="v$.empleado.$touch"
              error-message="Debes seleccionar un empleado"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'nombres')"
              :option-value="v => v.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <error-component clave="empleado" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Horario -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Horario</label>
            <q-select
                v-model="horario_empleado.horario"
                :options="horarios"
                transition-show="jump-up"
                transition-hide="jump-down"
                :disable="disabled"
                options-dense
                dense
                outlined
                :error="!!v$.empleado.$errors.length"
                @blur="v$.empleado.$touch"
                error-message="Debes seleccionar un empleado"
                @popup-show="ordenarLista(horarios, 'nombre')"
                :option-value="v => v.id"
                :option-label="v => v.nombre"
                emit-value
                map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.nombre }}</q-item-label>
                    <q-item-label caption>
                      {{ scope.opt.dias.map(dia=>dia.substring(0,2)) }} - {{ scope.opt.hora_entrada }} - {{ scope.opt.hora_salida }} - {{ scope.opt.tiene_pausa }}
                    </q-item-label>
                  </q-item-section>
                </q-item>

              </template>
              <template v-slot:error>
                <error-component clave="empleado" :v$="v$" />
              </template>

              <template v-slot:no-option>
                <no-option-component />
              </template>
            </q-select>
          </div>

          <!-- Fecha de inicio -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Fecha de inicio</label>
            <q-input
                v-model="horario_empleado.fecha_inicio"
                placeholder="Obligatorio"
                :error="!!v$.fecha_inicio.$errors.length"
                @blur="v$.fecha_inicio.$touch"
                :disable="disabled"
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
                  >
                    <q-date
                        v-model="horario_empleado.fecha_inicio"
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
                <error-component clave="fecha_inicio" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- Fecha fin -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Fecha Fin</label>
            <q-input
                v-model="horario_empleado.fecha_fin"
                placeholder="Opcional"
                hint="Puedes dejarlo en blanco si no hay fecha de fin"
                :disable="disabled"
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
                  >
                    <q-date
                        v-model="horario_empleado.fecha_fin"
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
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./HorarioEmpleadoPage.ts" />
