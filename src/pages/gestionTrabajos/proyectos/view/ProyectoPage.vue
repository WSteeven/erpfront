<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasProyecto"
    titulo-pagina="Proyectos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Cliente -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cliente corporativo</label>
            <q-select
              v-model="proyecto.cliente"
              :options="clientes"
              @filter="filtrarClientes"
              :disable="disabled"
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
              :error="!!v$.cliente.$errors.length"
              @blur="v$.cliente.$touch"
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

          <!-- Codigo proyecto -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Código de proyecto</label>
            <q-input
              v-model="proyecto.codigo_proyecto"
              :error="!!v$.codigo_proyecto.$errors.length"
              @blur="v$.codigo_proyecto.$touch"
              placeholder="Obligatorio"
              :disable="disabled"
              autofocus
              outlined
              dense
            >
              <template v-slot:error>
                <div
                  v-for="error of v$.codigo_proyecto.$errors"
                  :key="error.$uid"
                >
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Nombre de proyecto -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre del proyecto</label>
            <q-input
              v-model="proyecto.nombre"
              :error="!!v$.nombre.$errors.length"
              @blur="v$.nombre.$touch"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Fecha de inicio de proyecto-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de inicio de proyecto</label>
            <q-input
              v-model="proyecto.fecha_inicio"
              :error="!!v$.fecha_inicio.$errors.length"
              placeholder="Obligatorio"
              @blur="v$.fecha_inicio.$touch"
              :disable="disabled"
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
                      v-model="proyecto.fecha_inicio"
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

              <template v-slot:error>
                <div v-for="error of v$.fecha_inicio.$errors" :key="error.$uid">
                  <div>{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Fecha de fin de proyecto-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de fin de proyecto</label>
            <q-input
              v-model="proyecto.fecha_fin"
              :error="!!v$.fecha_fin.$errors.length"
              placeholder="Obligatorio"
              @blur="v$.fecha_fin.$touch"
              :disable="disabled"
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
                      v-model="proyecto.fecha_fin"
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

              <template v-slot:error>
                <div v-for="error of v$.fecha_fin.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Canton -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cantón</label>
            <q-select
              v-model="proyecto.canton"
              :options="cantones"
              @filter="filtrarCantones"
              @blur="v$.canton.$touch"
              :disable="disabled"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.canton"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :error="!!v$.canton.$errors.length"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.canton.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Coordinador -->
          <div v-if="mostrarCoordinador" class="col-12 col-md-3">
            <label class="q-mb-sm block">Coordinador</label>
            <q-select
              v-model="proyecto.coordinador"
              :options="coordinadores"
              @filter="filtrarCoordinadores"
              @blur="v$.coordinador.$touch"
              :disable="disabled"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombres + ' ' + item.apellidos"
              :option-value="(item) => item.id"
              :error="!!v$.coordinador.$errors.length"
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

              <template v-slot:error>
                <div v-for="error of v$.coordinador.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Fiscalizador -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fiscalizador</label>
            <q-select
              v-model="proyecto.fiscalizador"
              :options="fiscalizadores"
              @filter="filtrarFiscalizadores"
              :disable="disabled"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombres + ' ' + item.apellidos"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              clearable
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

          <div class="col-12 col-md-3">
            <br />
            <q-toggle
              v-model="proyecto.finalizado"
              checked-icon="check"
              color="positive"
              label="Marcar proyecto como finalizado"
            />
          </div>
          <!-- Tiene etapas -->
          <div class="col-12 col-md-12">
            <essential-table
              ref="refEtapas"
              titulo="Etapas del proyecto"
              :configuracionColumnas="accion==acciones.nuevo||accion==acciones.editar? [...columnasEtapas, accionesTabla]:columnasEtapas"
              :datos="proyecto.etapas"
              :accion1Header="addNuevaEtapa"
              :permitirBuscar="false"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :mostrarCantidadElementos="false"
              :permitirEditarModal="true"
              :modalMaximized="false"
              :alto-fijo="false"
              :mostrarFooter="false"
              :accion1="btnEliminar"
              :accion2="btnDesactivar"
              :accion3="btnActivar"
            ></essential-table>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
  <modales-entidad
    :comportamiento="modales"
    :persistente="false"
    @guardado="(data) => guardado(data)"
  ></modales-entidad>
</template>

<script src="./ProyectoPage.ts"></script>
