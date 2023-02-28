<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasTareas"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información general"
          header-class="bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-md">
            <div class="col-12">
              <q-btn-toggle
                v-model="tarea.para_cliente_proyecto"
                class="toggle-button"
                spread
                no-caps
                rounded
                toggle-color="positive"
                unelevated
                :options="[
                  {
                    label: 'Tarea para un proyecto',
                    value: destinosTareas.paraProyecto,
                  },
                  {
                    label: 'Tarea para cliente final',
                    value: destinosTareas.paraClienteFinal,
                  },
                ]"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm q-pa-md">
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Medio de notificación</label>
              <q-select
                v-model="tarea.medio_notificacion"
                :options="mediosNotificacion"
                options-dense
                dense
                outlined
                clearable
              />
            </div>

            <!-- Codigo tarea JP -->
            <div v-if="tarea.codigo_tarea" class="col-12 col-md-3">
              <label class="q-mb-sm block">Código de tarea</label>
              <q-input
                v-model="tarea.codigo_tarea"
                outlined
                dense
                disable
              ></q-input>
            </div>

            <!-- Numero tarea cliente -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Código de tarea cliente</label>
              <q-input
                v-model="tarea.codigo_tarea_cliente"
                placeholder="Obligatorio"
                hint="Ticket, OT, Tarea"
                :error="!!v$.codigo_tarea_cliente.$errors.length"
                @blur="v$.codigo_tarea_cliente.$touch"
                :disable="disabled"
                outlined
                dense
                autofocus
              >
                <template v-slot:error>
                  <div
                    v-for="error of v$.codigo_tarea_cliente.$errors"
                    :key="error.$uid"
                  >
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>

            <!-- Cliente principal -->
            <div v-if="paraClienteFinal" class="col-12 col-md-6">
              <label class="q-mb-sm block">Cliente corporativo</label>
              <q-select
                v-model="tarea.cliente"
                :options="clientes"
                @filter="filtrarClientes"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :option-label="(item) => item.razon_social"
                :option-value="(item) => item.id"
                :option-disable="(item) => (item.id === 1 ? true : false)"
                use-input
                input-debounce="0"
                emit-value
                map-options
                @update:model-value="establecerCliente()"
                :error="!!v$.cliente.$errors.length"
                :disable="disabled"
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

            <!-- Supervisor -->
            <div v-if="paraClienteFinal" class="col-12 col-md-3">
              <label class="q-mb-sm block">Fiscalizador</label>
              <q-select
                v-model="tarea.fiscalizador"
                :options="supervisores"
                @filter="filtrarSupervisores"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                clearable
                outlined
                :option-label="(item) => item.nombres + ' ' + item.apellidos"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
                :disable="disabled"
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

            <!-- Coordinador -->
            <div
              v-if="paraClienteFinal && tarea.coordinador"
              class="col-12 col-md-3"
            >
              <label class="q-mb-sm block">Coordinador</label>
              <q-select
                v-model="tarea.coordinador"
                :options="coordinadores"
                @filter="filtrarCoordinadores"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                clearable
                outlined
                :option-label="(item) => item.nombres + ' ' + item.apellidos"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
                :disable="disabled"
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

            <!-- Fecha de solicitud -->
            <div v-if="paraClienteFinal" class="col-12 col-md-3">
              <label class="q-mb-sm block"
                >Fecha de solicitud del cliente</label
              >
              <q-input
                v-model="tarea.fecha_solicitud"
                outlined
                dense
                :disable="disabled"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="tarea.fecha_solicitud"
                        mask="DD-MM-YYYY"
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

            <!-- Codigo de proyecto -->
            <div v-if="paraProyecto" class="col-12 col-md-3">
              <label class="q-mb-sm block">Código de proyecto</label>
              <q-select
                v-model="tarea.proyecto"
                :options="proyectos"
                @filter="filtrarProyectos"
                @blur="v$.proyecto.$touch"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :option-label="(item) => item.nombre"
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
                :error="!!v$.proyecto.$errors.length"
                @update:modelValue="setCliente"
                :disable="disabled"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No hay resultados
                    </q-item-section>
                  </q-item>
                </template>

                <template v-slot:error>
                  <div v-for="error of v$.proyecto.$errors" :key="error.$uid">
                    <div class="error-msg">{{ error.$message }}</div>
                  </div>
                </template>
              </q-select>
            </div>

            <!-- Titulo -->
            <div class="col-12">
              <label class="q-mb-sm block">Título de la tarea</label>
              <q-input
                v-model="tarea.titulo"
                placeholder="Obligatorio"
                outlined
                dense
                :error="!!v$.titulo.$errors.length"
                @blur="v$.titulo.$touch"
                :disable="disabled"
              >
                <template v-slot:error>
                  <div v-for="error of v$.titulo.$errors" :key="error.$uid">
                    <div>{{ error.$message }}</div>
                  </div>
                </template>
              </q-input>
            </div>
          </div>
        </q-expansion-item>

        <q-expansion-item
          v-if="paraClienteFinal"
          class="overflow-hidden q-mb-md expansion"
          label="Ubicación del trabajo para cliente final"
          header-class="bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-md">
            <!-- Nombre -->
            <div class="col-12">
              <label-abrir-modal
                v-if="mostrarLabelModal"
                label="Cliente final"
                @click="modales.abrirModalEntidad('ClienteFinalPage')"
              />
              <label v-else class="q-mb-sm block">Cliente final</label>
              <q-select
                v-model="tarea.cliente_final"
                :options="clientesFinales"
                @filter="filtrarClientesFinales"
                hint="Primero seleccione al cliente principal"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                :option-label="
                  (item) => item.nombres + ' ' + (item.apellidos ?? '')
                "
                :option-value="(item) => item.id"
                use-input
                input-debounce="0"
                emit-value
                map-options
                :disable="disabled"
                @update:model-value="
                  (v) => obtenerClienteFinal(tarea.cliente_final)
                "
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

            <!-- Id de cliente -->
            <div v-if="clienteFinal.id_cliente_final" class="col-12 col-md-3">
              <label class="q-mb-sm block">ID/Código de cliente final</label>
              <q-input
                v-model="clienteFinal.id_cliente_final"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Celular -->
            <div v-if="clienteFinal.celular" class="col-12 col-md-3">
              <label class="q-mb-sm block">Celular</label>
              <q-input
                v-model="clienteFinal.celular"
                outlined
                dense
                disable
              ></q-input>
            </div>

            <!-- Provincia -->
            <div v-if="clienteFinal.provincia" class="col-12 col-md-3">
              <label class="q-mb-sm block">Provincias</label>
              <q-select
                v-model="clienteFinal.provincia"
                :options="listadosAuxiliares.provincias"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                disable
                :option-label="(item) => item.provincia"
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

            <!-- Ciudad -->
            <div v-if="clienteFinal.canton" class="col-12 col-md-3">
              <label class="q-mb-sm block">Cantón</label>
              <q-select
                v-model="clienteFinal.canton"
                :options="listadosAuxiliares.cantones"
                transition-show="scale"
                transition-hide="scale"
                options-dense
                dense
                outlined
                disable
                :option-label="(item) => item.canton"
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

            <!-- Parroquia -->
            <div v-if="clienteFinal.parroquia" class="col-12 col-md-3">
              <label class="q-mb-sm block">Parroquia/Barrio</label>
              <q-input
                v-model="clienteFinal.parroquia"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Direccion -->
            <div v-if="clienteFinal.direccion" class="col-12 col-md-3">
              <label class="q-mb-sm block">Dirección</label>
              <q-input
                v-model="clienteFinal.direccion"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Referencia -->
            <div v-if="clienteFinal.referencia" class="col-12 col-md-3">
              <label class="q-mb-sm block">Referencia</label>
              <q-input
                v-model="clienteFinal.referencia"
                disable
                outlined
                dense
              ></q-input>
            </div>

            <!-- Coordenada latitud -->
            <div v-if="clienteFinal.coordenada_latitud" class="col-12 col-md-3">
              <label class="q-mb-sm block">Coordenada latitud</label>
              <q-input
                v-model="clienteFinal.coordenada_latitud"
                disable
                outlined
                dense
              >
              </q-input>
            </div>

            <!-- Coordenada longitud -->
            <div
              v-if="clienteFinal.coordenada_longitud"
              class="col-12 col-md-3"
            >
              <label class="q-mb-sm block">Coordenada longitud</label>
              <q-input
                v-model="clienteFinal.coordenada_longitud"
                disable
                outlined
                dense
              >
              </q-input>
            </div>
          </div>
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout>

  <modales-entidad :comportamiento="modales" />
</template>

<script src="./TareaPage.ts"></script>
