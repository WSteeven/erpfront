<template>
  <q-page padding>
    <q-form @submit.prevent>
      <div class="text-bold q-mb-lg">1. Información general</div>
      <div class="row q-col-gutter-sm q-mb-lg">
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
          <label class="q-mb-sm block">Título del trabajo a realizar</label>
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

        <!-- Tipo trabajo -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Tipo de trabajo a realizar</label>
          <q-select
            v-model="subtarea.tipo_trabajo"
            :options="tiposTrabajos"
            @filter="filtrarTiposTrabajos"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="(item) => item.descripcion"
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
          <label class="q-mb-sm block">Fecha y hora de inicio de trabajo</label>
          <q-input v-model="subtarea.fecha_hora_inicio" outlined dense disable>
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
          <label class="q-mb-sm block">Fecha y hora de estado suspendido</label>
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
            disable
            outlined
            type="textarea"
            autogrow
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

        <!--  Subtarea de la que depende -->
        <div v-if="subtarea.es_dependiente" class="col-12 col-md-3">
          <label class="q-mb-sm block">Subtarea de la que depende</label>
          <q-select
            v-model="subtarea.subtarea_dependiente"
            :options="subtareas"
            @filter="filtrarSubtareas"
            :error="!!v$.subtarea_dependiente.$errors.length"
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
                  <q-item-label caption>{{ scope.opt.detalle }} </q-item-label>
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

            <template v-slot:error>
              <div
                v-for="error of v$.subtarea_dependiente.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
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
            @blur="verificarEsVentana()"
            outlined
            dense
          ></q-checkbox>
        </div>

        <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de ventana</label>
          <q-input
            v-model="subtarea.fecha_ventana"
            placeholder="Obligatorio"
            :error="!!v$.fecha_ventana.$errors.length"
            :disable="disable"
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
                    v-model="subtarea.fecha_ventana"
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
              <div v-for="error of v$.fecha_ventana.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Hora inicio de ventana -->
        <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
          <label class="q-mb-sm block">Hora inicio de ventana (24H)</label>
          <q-input
            v-model="subtarea.hora_inicio_ventana"
            :disable="disable"
            placeholder="Obligatorio"
            :error="!!v$.hora_inicio_ventana.$errors.length"
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

            <template v-slot:error>
              <div
                v-for="error of v$.hora_inicio_ventana.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Hora fin de ventana -->
        <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
          <label class="q-mb-sm block">Hora fin de ventana (24H)</label>
          <q-input
            v-model="subtarea.hora_fin_ventana"
            :disable="disable"
            placeholder="Obligatorio"
            :error="!!v$.hora_fin_ventana.$errors.length"
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
                  <q-time v-model="subtarea.hora_fin_ventana" format24h now-btn>
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

            <template v-slot:error>
              <div
                v-for="error of v$.hora_fin_ventana.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
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
            placeholder="Obligatorio"
            :disable="disable"
            autogrow
            outlined
            dense
            :error="!!v$.descripcion_completa.$errors.length"
          >
            <template v-slot:error>
              <div
                v-for="error of v$.descripcion_completa.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>
      </div>

      <div class="text-bold q-mb-lg">2. Asignación de trabajo</div>
      <div class="row q-col-gutter-sm">
        <!-- Asignar trabajo -->
        <div class="col-12 q-mb-md">
          <label class="text-center q-mb-sm block"
            >Modo de asignación del trabajo</label
          >
          <q-btn-toggle
            v-model="subtarea.modo_asignacion_trabajo"
            spread
            class="toggle-button"
            no-caps
            unelevated
            :disable="disable"
            rounded
            toggle-color="positive"
            color="bg-body"
            @update:model-value="resetListados()"
            :options="[
              {
                label: 'Por grupo',
                value: opcionesModoAsignacionTrabajo.por_grupo,
              },
              {
                label: 'Por empleado',
                value: opcionesModoAsignacionTrabajo.por_trabajador,
              },
            ]"
          />
        </div>
      </div>

      <!-- Grupo -->
      <div
        v-if="
          subtarea.modo_asignacion_trabajo ===
          opcionesModoAsignacionTrabajo.por_grupo
        "
        class="row q-col-gutter-sm q-mb-md"
      >
        <div class="col-12 col-md-10">
          <label class="q-mb-sm block">Grupo técnico seleccionado</label>
          <q-select
            v-model="subtarea.grupo"
            :options="grupos"
            @filter="filtrarGrupos"
            transition-show="scale"
            transition-hide="scale"
            hint="Seleccione y presione en Agregar"
            options-dense
            dense
            outlined
            :option-label="(item) => item.nombre"
            :option-value="(item) => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
            clearable
            :disable="disable"
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

        <div class="col-12 col-md-2 q-pt-md">
          <br />
          <q-btn
            color="positive"
            class="full-width"
            :disable="disable"
            no-caps
            push
            @click="agregarGrupoSeleccionado(subtarea.grupo)"
          >
            <q-icon name="bi-plus" class="q-pr-sm" size="xs"></q-icon>
            <div>Agregar</div>
          </q-btn>
        </div>
      </div>

      <div class="row q-col-gutter-sm">
        <!-- Técnicos del grupo principal -->
        <div class="col-12">
          <div
            v-if="
              subtarea.asignar_mas_empleados ||
              subtarea.modo_asignacion_trabajo ===
                opcionesModoAsignacionTrabajo.por_trabajador
            "
            class="row q-col-gutter-sm q-mb-md"
          >
            <!-- Busqueda -->
            <div class="col-12 col-md-10">
              <label class="q-mb-sm block">Empleado</label>
              <q-input
                v-model="criterioBusquedaTecnico"
                placeholder="Nombres / Apellidos / Identificación"
                hint="Ingrese los datos del empleado y presione Enter para buscar"
                @keydown.enter="listarTecnicos()"
                @blur="criterioBusquedaTecnico === '' ? limpiarTecnico() : null"
                :disable="disable"
                clearable
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

          <essential-table
            v-if="
              subtarea.modo_asignacion_trabajo ===
              opcionesModoAsignacionTrabajo.por_grupo
            "
            titulo="Grupos seleccionados"
            estilos="margin-bottom: 14px;"
            :configuracionColumnas="columnasGrupo"
            :datos="subtarea.grupos_seleccionados"
            :accion1Header="asignarNuevoTecnicoLider"
            :accion2Header="designarNuevoSecretario"
            :accion3Header="cancelarDesignacion"
            :mostrarBotones="false"
            :permitirConsultar="false"
            :permitirEditar="false"
            :permitirEliminar="false"
            :alto-fijo="false"
            :mostrar-header="true"
            :permitir-buscar="false"
            :mostrar-footer="!subtarea.grupos_seleccionados.length"
            :tipo-seleccion="tipoSeleccion"
            :accion1="quitarGrupo"
            :accion2="designarGrupoPrincipal"
            @selected="entidadSeleccionada"
          >
          </essential-table>

          <essential-table
            ref="refEmpleadosAsignados"
            titulo="Empleados de los grupos seleccionados"
            :configuracionColumnas="columnas"
            :datos="subtarea.empleados_seleccionados"
            :accion1Header="asignarNuevoTecnicoLider"
            :accion2Header="designarNuevoSecretario"
            :accion3Header="cancelarDesignacion"
            :mostrarBotones="false"
            :permitirConsultar="false"
            :permitirEditar="false"
            :permitirEliminar="false"
            :alto-fijo="false"
            :mostrar-header="true"
            :permitir-buscar="false"
            :tipo-seleccion="tipoSeleccion"
            :mostrar-footer="!subtarea.empleados_seleccionados.length"
            @selected="entidadSeleccionada"
            :accion1="eliminarTecnico"
          >
          </essential-table>
        </div>
      </div>

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
      @selected="seleccionarEmpleado"
    ></essential-selectable-table>
  </q-page>
</template>

<script src="./SubtareaPage.ts"></script>
