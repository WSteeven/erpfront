<template>
  <q-page padding>
    <q-form @submit.prevent>
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Información general"
        header-class="bg-grey-1"
        default-opened
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <!-- Subtarea -->
          <div v-if="subtarea.codigo_subtarea" class="col-12 col-md-3">
            <label class="q-mb-sm block">Código subtarea</label>
            <q-input
              v-model="subtarea.codigo_subtarea"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Detalle de la subtarea -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block"
              >Detalle / Ruta / Enlace / Proyecto</label
            >
            <q-input
              v-model="subtarea.detalle"
              placeholder="Obligatorio"
              @update:model-value="(v) => (subtarea.detalle = v.toUpperCase())"
              outlined
              dense
              autogrow
              :disable="disable"
              type="textarea"
              :error="!!v$.detalle.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.detalle.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Grupo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Grupo asignado</label>
            <q-select
              v-model="subtarea.grupo"
              :options="grupos"
              @filter="filtrarGrupos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              @update:model-value="obtenerResponsables(subtarea.grupo)"
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              clearable
              :disable="disable"
              :error="!!v$.grupo.$errors.length"
            >
              <!--@update:model-value="obtenerResponsables(subtarea.grupo)"-->
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.grupo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Tipo trabajo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo de trabajo</label>
            <q-select
              v-model="subtarea.tipo_trabajo"
              :options="tiposTrabajos"
              @filter="filtrarTiposTrabajos"
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
              :disable="disable"
              :error="!!v$.tipo_trabajo.$errors.length"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.tipo_trabajo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Fecha de creacion -->
          <div v-if="subtarea.fecha_hora_creacion" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha y hora de creación</label>
            <q-input
              v-model="subtarea.fecha_hora_creacion"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <div v-if="subtarea.fecha_hora_asignacion" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha y hora de asignación</label>
            <q-input
              v-model="subtarea.fecha_hora_asignacion"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <!-- Fecha de inicio -->
          <div v-if="subtarea.fecha_hora_inicio" class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Fecha y hora de inicio de trabajo</label
            >
            <q-input
              v-model="subtarea.fecha_hora_inicio"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <!-- Fecha de finalizacion -->
          <div v-if="subtarea.fecha_hora_finalizacion" class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Fecha y hora de finalización de trabajo</label
            >
            <q-input
              v-model="subtarea.fecha_hora_finalizacion"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <!-- Técnico responsable -->
          <div v-if="subtarea.cantidad_dias" class="col-12 col-md-3">
            <label class="q-mb-sm block">Cantidad de días</label>
            <q-input
              v-model="subtarea.cantidad_dias"
              outlined
              disable
              dense
            ></q-input>
          </div>

          <!-- Fecha y hora de estado realizado -->
          <div v-if="subtarea.fecha_hora_realizado" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha y hora realizado</label>
            <q-input
              v-model="subtarea.fecha_hora_realizado"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <!-- Fecha y hora de estado suspendido -->
          <div v-if="subtarea.fecha_hora_suspendido" class="col-12 col-md-3">
            <label class="q-mb-sm block"
              >Fecha y hora de estado suspendido</label
            >
            <q-input
              v-model="subtarea.fecha_hora_suspendido"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <!-- Causa de la suspencion -->
          <div v-if="subtarea.causa_suspencion" class="col-12 col-md-3">
            <label class="q-mb-sm block">Causa de la suspención</label>
            <q-input
              v-model="subtarea.causa_suspencion"
              placeholder="Opcional"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Fecha y hora de estado cancelacion -->
          <div v-if="subtarea.fecha_hora_cancelado" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha y hora de cancelación</label>
            <q-input
              v-model="subtarea.fecha_hora_cancelado"
              outlined
              dense
              disable
            >
            </q-input>
          </div>

          <!-- Causa de la suspencion -->
          <div
            v-if="subtarea.fecha_hora_estado_cancelado"
            class="col-12 col-md-3"
          >
            <label class="q-mb-sm block">Causa de la cancelación</label>
            <q-input
              v-model="subtarea.causa_cancelacion"
              placeholder="Opcional"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Es dependiente -->
          <div class="col-12 col-md-3">
            <br />
            <q-checkbox
              v-model="subtarea.es_dependiente"
              label="Es dependiente"
              :disable="disable"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!--  Subtarea de la q depende -->
          <div v-if="subtarea.es_dependiente" class="col-12 col-md-3">
            <label class="q-mb-sm block">Subtarea de la que depende</label>
            <q-select
              v-model="subtarea.subtarea_dependiente"
              :options="subtareas"
              @filter="filtrarSubtareas"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.codigo_subtarea"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              :disable="disable"
              emit-value
              map-options
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" class="q-my-sm">
                  <q-item-section>
                    <q-item-label class="text-bold text-primary">{{
                      scope.opt.codigo_subtarea
                    }}</q-item-label>
                    <q-item-label caption
                      >{{ scope.opt.detalle }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
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

          <!-- Es ventana -->
          <div class="col-12 col-md-3 q-mb-md">
            <br />
            <q-checkbox
              v-model="subtarea.es_ventana"
              label="Es ventana de trabajo"
              :disable="disable"
              outlined
              dense
            ></q-checkbox>
          </div>

          <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de ventana</label>
            <q-input v-model="subtarea.fecha_ventana" outlined dense>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="subtarea.fecha_ventana" mask="DD-MM-YYYY">
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

          <!-- Hora inicio de ventana -->
          <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
            <label class="q-mb-sm block">Hora inicio de ventana (24H)</label>
            <q-input
              v-model="subtarea.hora_inicio_ventana"
              :disable="disable"
              mask="time"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="bi-clock" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="subtarea.hora_inicio_ventana"
                      format24h
                      now-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!-- Hora fin de ventana -->
          <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
            <label class="q-mb-sm block">Hora fin de ventana (24H)</label>
            <q-input
              v-model="subtarea.hora_fin_ventana"
              :disable="disable"
              mask="time"
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="bi-clock" class="cursor-pointer">
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time
                      v-model="subtarea.hora_fin_ventana"
                      format24h
                      now-btn
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Cerrar"
                          color="primary"
                          flat
                        />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!-- Descripción completa del trabajo a realizar -->
          <div class="col-12">
            <label class="q-mb-sm block"
              >Descripción completa del trabajo a realizar</label
            >
            <q-input
              v-model="subtarea.descripcion_completa"
              placeholder="Opcional"
              :disable="disable"
              autogrow
              outlined
              dense
            ></q-input>
          </div>

          <!-- Técnicos del grupo principal -->
          <div v-if="subtarea.tecnicos_grupo_principal" class="col-12">
            <essential-table
              titulo="Técnicos del grupo principal"
              :configuracionColumnas="columnas"
              :datos="subtarea.tecnicos_grupo_principal"
              :mostrarBotones="false"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :alto-fijo="false"
              :mostrar-header="false"
              :mostrar-footer="false"
              :accion1="eliminarTecnico"
            >
              <!--:datos="tecnicosGrupoPrincipal"-->
            </essential-table>
          </div>
        </div>
      </q-expansion-item>

      <!-- Asignar técnicos de otros grupos -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Asignar técnicos de otros grupos"
        header-class="bg-grey-1"
        default-opened
      >
        <!-- Toggle -->
        <div class="row q-col-gutter-sm q-pa-md">
          <div class="col-12">
            <q-btn-toggle
              v-model="seleccionBusqueda"
              spread
              class="my-custom-toggle"
              no-caps
              rounded
              unelevated
              toggle-color="primary"
              color="white"
              text-color="primary"
              :disable="disable"
              :options="[
                { label: 'Buscar un técnico a la vez', value: 'por_tecnico' },
                { label: 'Buscar por grupo', value: 'por_grupo' },
              ]"
            />
          </div>
        </div>

        <!-- Busqueda por tecnico -->
        <div
          v-if="seleccionBusqueda === 'por_tecnico'"
          class="row q-col-gutter-sm q-pa-md"
        >
          <!-- Busqueda -->
          <div class="col-12 col-md-10">
            <label class="q-mb-sm block">Buscar</label>
            <q-input
              v-model="busqueda"
              placeholder="Ingrese Nombres o Apellidos o Identificación"
              hint="Ingrese los datos del técnico y presione Enter"
              @update:model-value="
                (v) => (criterioBusquedaTecnico = v.toUpperCase())
              "
              @keydown.enter="listarTecnicos()"
              @blur="criterioBusquedaTecnico === '' ? limpiarTecnico() : null"
              type="search"
              :disable="disable"
              outlined
              dense
            ></q-input>
          </div>

          <div class="col-12 col-md-2 q-pt-md">
            <br />
            <q-btn
              color="positive"
              class="full-width"
              :disable="disable"
              no-caps
              push
              @click="listarTecnicos()"
            >
              <q-icon name="bi-search" class="q-pr-sm" size="xs"></q-icon>
              <div>Buscar</div>
            </q-btn>
          </div>
        </div>

        <!-- Busqueda por grupo -->
        <div v-else class="row q-col-gutter-sm q-pa-md">
          <div class="col-12 col-md-10">
            <label class="q-mb-sm block">Grupo</label>
            <q-select
              v-model="busqueda"
              :options="grupos"
              @filter="filtrarGrupos"
              hint="Seleccione un grupo y presione en Listar técnicos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              :disable="disable"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :error="!!v$.grupo.$errors.length"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.grupo.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-2 q-pt-md">
            <br />
            <q-btn
              color="positive"
              class="full-width"
              :disable="disable"
              no-caps
              push
            >
              <q-icon name="bi-search" class="q-pr-sm" size="xs"></q-icon>
              <div>Listar técnicos</div>
            </q-btn>
          </div>
        </div>

        <!-- Listado -->
        <div class="row q-col-gutter-sm q-pa-md">
          <!-- Tecnicos temporales -->
          <div class="col-12">
            <essential-table
              titulo="Técnicos temporales de otros grupos"
              :configuracionColumnas="columnas"
              :datos="subtarea.tecnicos_otros_grupos"
              :mostrarBotones="false"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :alto-fijo="false"
              :mostrar-header="false"
              :mostrar-footer="false"
              :accion1="eliminarTecnicoOtroGrupo"
            >
            </essential-table>
          </div>
        </div>
      </q-expansion-item>

      <button-submits
        :accion="accion"
        @cancelar="reestablecerDatos()"
        @editar="editarDatos(subtarea)"
        @guardar="guardarDatos(subtarea)"
      />
    </q-form>

    <essential-selectable-table
      ref="refListadoSeleccionableTecnicos"
      :configuracion-columnas="configuracionColumnasTecnico"
      :datos="listadoTecnicos"
      tipo-seleccion="multiple"
      @selected="seleccionarTecnico"
    ></essential-selectable-table>
  </q-page>
</template>

<script src="./SubtareaPage.ts"></script>
