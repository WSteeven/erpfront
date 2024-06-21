<template>
  <q-page padding>
    <q-card class="q-mb-md rounded no-border custom-shadow">
      <q-card-section>
        <div class="border-1 text-primary text-bold q-mb-lg">
          <q-icon name="bi-file-text" class="q-mr-sm"></q-icon>
          Logs de Auditorias por Empleado
        </div>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- check para saber si buscar por auditable_id o por empleado -->
          <div class="col-12 col-md-3">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="checkAuditable"
              label="¿Auditable?"
              outlined
              dense
            ></q-checkbox>
          </div>
          <!-- fecha de fin -->
          <div class="col-12 col-md-3" v-if="checkAuditable">
            <label class="q-mb-sm block">Auditable ID </label>
            <q-input
              v-model="auditoria.auditable_id"
              outlined
              dense
              type="number"
              @keyup.enter="consultar"
            ></q-input>
          </div>

          <!-- empleado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Seleccione un empleado</label>
            <q-select
              v-model="auditoria.empleado"
              :options="empleados"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              :error="!!v$.empleado.$errors.length"
              dense
              outlined
              use-input
              input-debounce="0"
              @filter="filtrarEmpleados"
              @blur="v$.empleado.$touch"
              @update:model-value="consultar"
              @popup-show="ordenarEmpleados"
              :option-label="(item) => item.apellidos + ' ' + item.nombres"
              :option-value="(item) => item.id"
              emit-value
              map-options
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.empleado.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
          <!-- fecha de inicio -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de inicio</label>
            <q-input
              v-model="auditoria.fecha_inicio"
              :error="!!v$.fecha_inicio.$errors.length"
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
                      v-model="auditoria.fecha_inicio"
                      :mask="maskFecha"
                      @update:model-value="consultar"
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
                <div v-for="error of v$.fecha_inicio.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- fecha de fin -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha fin </label>
            <q-input
              v-model="auditoria.fecha_fin"
              :error="!!v$.fecha_fin.$errors.length"
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
                      v-model="auditoria.fecha_fin"
                      :mask="maskFecha"
                      @update:model-value="consultar"
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
                <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Modelo auditable -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Modelo</label>
            <q-select
              v-model="auditoria.auditable_type"
              :options="modelosAuditables"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              clearable
              use-input
              input-debounce="0"
              @update:model-value="consultar"
              :option-label="(item) => item"
              :option-value="(item) => item"
              ><template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.empleado.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card class="q-mb-md rounded no-border custom-shadow">
      <div class="row q-col-gutter-sm q-pa-sm">
        <!-- Linea de tiempo de cambios -->
        <div class="col-12 q-px-lg q-py-md">
          <q-timeline color="primary" v-if="listado.length > 0">
            <q-timeline-entry title="Registros de cambios realizados" />
            <q-timeline-entry
              v-for="(l, index) in listado"
              :key="l.id"
              :title="`Evento: ${l.event}`"
              :color="`${
                l.event == 'created'
                  ? 'green'
                  : l.event == 'updated'
                  ? 'orange'
                  : l.event == 'deleted'
                  ? 'red'
                  : 'gray'
              }`"
              :subtitle="`[${l.updated_at}], ${l.user_name} [${l.ip_address}] ${
                l.event == 'created'
                  ? 'ha creado un registro'
                  : l.event == 'updated'
                  ? 'ha actualizado un registro'
                  : l.event == 'deleted'
                  ? 'ha eliminado un registro'
                  : l.event == 'sync'
                  ? 'ha sincronizado un registro'
                  : 'ha restaurado un registro'
              }`"
            >
              <p>
                Modelo afectado: <strong> {{ l.auditable_type }}</strong> <br />
                Url: {{ l.url }}
              </p>
              <p>
                Id de registro: {{ l.auditable_id }} <br />Ingreso desde:
                {{ l.user_agent }}
              </p>
              <div class="row q-col-gutter-sm q-pa-sm">
                <div class="col-12 col-md-12">
                  <q-card class="my-card" bordered>
                    <q-card-section horizontal>
                      <q-card-section
                        class="col-6 col-md-6"
                        v-if="l.event !== 'created'"
                      >
                        <q-item-label
                          ><strong>Antiguos valores</strong></q-item-label
                        >
                        <q-separator />
                        <pre style="white-space: break-spaces">{{
                          JSON.stringify(l.old_values, null, 2)
                        }}</pre>
                      </q-card-section>

                      <q-separator vertical />

                      <q-card-section class="col-6 col-md-6">
                        <q-item-label
                          ><strong>Nuevos valores</strong></q-item-label
                        >
                        <q-separator />
                        <pre style="white-space: break-spaces">{{
                          JSON.stringify(l.new_values, null, 2)
                        }}</pre>
                      </q-card-section>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
              <q-separator
                v-if="
                  index < listado.length - 1 &&
                  l.updated_at !== listado[index + 1].updated_at
                "
                color="grey-5"
                size="4px"
                spaced="10px"
              />
            </q-timeline-entry>
          </q-timeline>
          <q-timeline v-else>
            <div class="text-center q-my-lg text-negative text-subtitle2">
              <q-icon
                name="bi-exclamation-triangle-fill"
                class="q-mr-sm"
              ></q-icon>
              No se encontraron registros para el empleado y rango de fechas
              seleccionado
            </div>
          </q-timeline>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script src="./AuditoriaPage.ts" />
