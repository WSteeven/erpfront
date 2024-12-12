<template>
  <q-form @submit.prevent class="">
    <q-card class="rounded-card custom-shadow">
      <q-card-section>
        <div
          class="col-12 col-md-12 rounded-card q-py-sm text-center text-accent bg-yellow-2"
        >
          <q-icon
            name="bi-exclamation-triangle-fill"
            class="q-mr-sm"
            size="1em"
          ></q-icon>
          <b>&nbsp; Advertencia</b>
          <div>
            Procede con precaución, ningún gasto o ticket donde figures como
            responsable se te cargará a ti sino a la persona que seleccionas
            como delegado hasta la fecha y hora indicada.
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-xs">
          <div class="col-12 col-md-4 col-sm-6">
            <label class="q-mb-sm block">Delegador</label>
            <q-input
              :model-value="store.nombreUsuario"
              dense
              outlined
              disable
            />
          </div>
          <div class="col-12 col-md-4 col-sm-6">
            <label class="q-mb-sm block">Empleado delegado</label>
            <q-select
              v-model="empleado_delegado.delegado"
              :options="empleados"
              transition-show="jump-up"
              transition-hide="jump-down"
              options-dense
              dense
              outlined
              :error="!!v$.delegado.$errors.length"
              @blur="v$.delegado.$touch"
              error-message="Debes seleccionar un empleado para delegar"
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @popup-show="ordenarLista(empleados, 'nombres')"
              :option-value="v => v.id"
              :option-disable="v => v.id === store.user.id"
              :option-label="v => v.nombres + ' ' + v.apellidos"
              emit-value
              map-options
            >
              <template v-slot:error>
                <div v-for="error of v$.delegado.$errors" :key="error.$uid">
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
          <!-- Aplicar inmediatamente -->
          <div class="col-12 col-md-4 col-sm-3">
            <label class="q-mb-sm block">Tipo de delegación</label>
            <q-toggle
              :label="inmediato ? 'INMEDIATA' : 'PROGRAMADA'"
              v-model="inmediato"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              @update:model-value="checkTipoDelegacion"
            />
          </div>
          <!-- Fecha Desde -->
          <div class="col-12 col-md-4" v-if="!inmediato">
            <label class="q-mb-sm block">Delegar desde</label>
            <q-input
              v-model="empleado_delegado.fecha_hora_desde"
              placeholder="Obligatorio"
              :error="!!v$.fecha_hora_desde.$errors.length"
              @blur="v$.fecha_hora_desde.$touch"
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
                    <div class="q-gutter-md row items-start">
                      <q-date
                        v-model="empleado_delegado.fecha_hora_desde"
                        :mask="mask"
                        :options="dateOptions"
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
                      <q-time
                        v-model="empleado_delegado.fecha_hora_desde"
                        :mask="mask"
                        color="primary"
                      />
                    </div>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.fecha_hora_desde.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Fecha Hasta -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Delegar hasta</label>
            <q-input
              v-model="empleado_delegado.fecha_hora_hasta"
              placeholder="Obligatorio"
              :error="!!v$.fecha_hora_hasta.$errors.length"
              @blur="v$.fecha_hora_hasta.$touch"
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
                    <div class="q-gutter-md row items-start">
                      <q-date
                        v-model="empleado_delegado.fecha_hora_hasta"
                        :mask="mask"
                        :options="dateOptions"
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
                      <q-time
                        v-model="empleado_delegado.fecha_hora_hasta"
                        :mask="mask"
                        color="primary"
                      />
                    </div>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.fecha_hora_hasta.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <button-submits
          :accion="accion"
          @editar="editar(empleado_delegado)"
          @guardar="guardar(empleado_delegado)"
          @cancelar="cancelar"
        />
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script src="./ModoNoDisponiblePage.ts" />
