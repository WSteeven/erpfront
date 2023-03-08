<template>
  <div class="q-pa-sm">
    <q-expansion-item
      class="overflow-hidden q-mb-md expansion"
      label="Información general"
      header-class="text-bold bg-header-collapse"
      default-opened
    >
      <div class="row q-col-gutter-sm q-pa-md">
        <!-- Titulo -->
        <div class="col-12">
          <label class="q-mb-sm block">Título de la subtarea</label>
          <q-input
            v-model="subtarea.titulo"
            placeholder="Obligatorio"
            :disable="disabled"
            autofocus
            outlined
            dense
            :error="!!v$.titulo.$errors.length"
            @blur="v$.titulo.$touch"
          >
            <template v-slot:error>
              <div v-for="error of v$.titulo.$errors" :key="error.$uid">
                <div>{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Descripcion completa -->
        <div class="col-12">
          <label class="q-mb-sm block"
            >Descripción completa del trabajo a realizar</label
          >
          <q-input
            v-model="subtarea.descripcion_completa"
            placeholder="Obligatorio"
            outlined
            :disable="disabled"
            dense
            autogrow
            type="textarea"
            :error="!!v$.descripcion_completa.$errors.length"
            @blur="v$.descripcion_completa.$touch"
          >
            <template v-slot:error>
              <div
                v-for="error of v$.descripcion_completa.$errors"
                :key="error.$uid"
              >
                <div>{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Observacion -->
        <div class="col-12">
          <label class="q-mb-sm block">Observación</label>
          <q-input
            v-model="subtarea.observacion"
            placeholder="Opcional"
            outlined
            :disable="disabled"
            dense
            autogrow
            type="textarea"
          >
          </q-input>
        </div>

        <!-- Codigo tarea JP -->
        <div v-if="subtarea.codigo_trabajo" class="col-12 col-md-3">
          <label class="q-mb-sm block">Código de trabajo</label>
          <q-input
            v-model="subtarea.codigo_trabajo"
            outlined
            dense
            disable
          ></q-input>
        </div>

        <!-- Tarea -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Tarea</label>
          <q-input v-model="subtarea.tarea" outlined dense disable></q-input>
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
            hint="Seleccione primero una tarea"
            options-dense
            dense
            outlined
            :disable="disabled"
            :option-label="(item) => item.descripcion"
            :option-value="(item) => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
            :error="!!v$.tipo_trabajo.$errors.length"
            @blur="v$.tipo_trabajo.$touch"
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

        <!-- Es dependiente -->
        <div class="col-12 col-md-3">
          <br />
          <q-checkbox
            v-model="subtarea.es_dependiente"
            label="Es dependiente"
            outlined
            :disable="disabled"
            dense
          ></q-checkbox>
        </div>

        <!--  Trabajo del que depende -->
        <div v-if="subtarea.es_dependiente" class="col-12 col-md-3">
          <label class="q-mb-sm block">Subtarea de la que depende</label>
          <q-select
            v-model="subtarea.subtarea_dependiente"
            :options="listado"
            :error="!!v$.subtarea_dependiente.$errors.length"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :disable="disabled"
            :option-label="(item) => item.codigo_subtarea"
            :option-value="(item) => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" class="q-my-sm">
                <q-item-section>
                  <q-item-label class="text-bold text-primary">{{
                    scope.opt.codigo_subtarea
                  }}</q-item-label>
                  <q-item-label caption>{{ scope.opt.titulo }} </q-item-label>
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
            @blur="verificarEsVentana()"
            outlined
            :disable="disabled"
            dense
          ></q-checkbox>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fecha de inicio de trabajo</label>
          <q-input
            v-model="subtarea.fecha_inicio_trabajo"
            placeholder="Obligatorio"
            :error="!!v$.fecha_inicio_trabajo.$errors.length"
            @blur="v$.fecha_inicio_trabajo.$touch"
            outlined
            :disable="disabled"
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
                    v-model="subtarea.fecha_inicio_trabajo"
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
              <div
                v-for="error of v$.fecha_inicio_trabajo.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Hora inicio de agendamiento -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Hora inicio de trabajo (24 horas)</label>
          <q-input
            v-model="subtarea.hora_inicio_trabajo"
            :error="!!v$.hora_inicio_trabajo.$errors.length"
            type="time"
            :disable="disabled"
            stack-label
            outlined
            dense
          >
            <template v-slot:error>
              <div
                v-for="error of v$.hora_inicio_trabajo.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- Hora fin de agendamiento -->
        <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
          <label class="q-mb-sm block">Hora fin de trabajo (24 horas)</label>
          <q-input
            v-model="subtarea.hora_fin_trabajo"
            :error="!!v$.hora_fin_trabajo.$errors.length"
            type="time"
            stack-label
            outlined
            :disable="disabled"
            dense
          >
            <template v-slot:error>
              <div
                v-for="error of v$.hora_fin_trabajo.$errors"
                :key="error.$uid"
              >
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>
      </div>
    </q-expansion-item>

    <q-expansion-item
      class="overflow-hidden q-mb-md expansion"
      label="Designación de trabajo"
      header-class="text-bold bg-header-collapse"
      default-opened
    >
      <div class="row q-col-gutter-xs q-pa-md q-mb-md">
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Trabajo designado</label>
          <q-btn-toggle
            v-model="subtarea.modo_asignacion_trabajo"
            class="toggle-button"
            :disable="disabled"
            spread
            no-caps
            rounded
            glossy
            toggle-color="positive"
            unelevated
            :options="[
              {
                label: 'Para un grupo',
                value: modosAsignacionTrabajo.por_grupo,
              },
              {
                label: 'Para un empleado',
                value: modosAsignacionTrabajo.por_empleado,
              },
            ]"
          />
        </div>

        <div
          v-if="
            subtarea.modo_asignacion_trabajo ===
            modosAsignacionTrabajo.por_grupo
          "
          class="col-12 col-md-3"
        >
          <label class="q-mb-sm block">Grupo seleccionado</label>
          <q-select
            v-model="subtarea.grupo"
            :options="grupos"
            @filter="filtrarGrupos"
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
            :disable="disabled"
            :error="!!v$.grupo.$errors.length"
            @blur="v$.grupo.$touch"
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

        <div
          v-if="
            subtarea.modo_asignacion_trabajo ===
            modosAsignacionTrabajo.por_empleado
          "
          class="col-12 col-md-3"
        >
          <label class="q-mb-sm block">Empleado seleccionado</label>
          <q-select
            v-model="subtarea.empleado"
            :options="empleados"
            @filter="filtrarEmpleados"
            transition-show="scale"
            transition-hide="scale"
            options-dense
            dense
            outlined
            :option-label="(item) => item.nombres + ' ' + item.apellidos"
            :option-value="(item) => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
            :disable="disabled"
            :error="!!v$.empleado.$errors.length"
            @blur="v$.empleado.$touch"
          >
            <template v-slot:no-option>
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
    </q-expansion-item>

    <q-expansion-item
      v-if="accion !== acciones.nuevo"
      class="overflow-hidden q-mb-md expansion"
      label="Tiempos"
      header-class="text-bold bg-header-collapse"
      default-opened
    >
      <div class="row q-col-gutter-sm q-pa-md">
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
        <div v-if="subtarea.fecha_hora_ejecucion" class="col-12 col-md-3">
          <label class="q-mb-sm block"
            >Fecha y hora de ejecución del trabajo</label
          >
          <q-input
            v-model="subtarea.fecha_hora_ejecucion"
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
      </div>
    </q-expansion-item>

    <b v-if="accion === acciones.nuevo" class="block q-mb-md"
      >Compartir archivos</b
    >
    <div v-if="accion === acciones.nuevo" class="col-12 q-mb-md">
      <q-uploader
        ref="refUploader"
        label="Selecciona o arrastra tus archivos aquí"
        multiple
        style="width: 100%"
        flat
        :factory="factoryFn"
        color="white"
        text-color="black"
        class="bg-header-collapse expansion"
        hide-upload-btn
      />
    </div>

    <div v-if="archivos.length && accion !== acciones.nuevo" class="col-12">
      <essential-table
        titulo="Archivos compartidos"
        :configuracionColumnas="columnasArchivos"
        :datos="archivos"
        :alto-fijo="false"
        :permitirConsultar="false"
        :permitirEditar="false"
        :permitirEliminar="false"
        :mostrar-footer="false"
        :mostrar-botones="false"
        :permitir-buscar="false"
        :accion1="btnDescargarArchivo"
      ></essential-table>
    </div>

    <button-submits
      :accion="accion"
      label-guardar="Guardar y agendar"
      @cancelar="reestablecerDatos()"
      @guardar="guardarDatos(subtarea)"
    />

    <!--<essential-selectable-table
          ref="refListadoSeleccionableTecnicos"
          :configuracion-columnas="configuracionColumnasEmpleadoGrupo"
          :datos="listadoTecnicos"
          tipo-seleccion="multiple"
          @selected="seleccionarEmpleado"
        ></essential-selectable-table> -->
  </div>

  <modales-entidad :comportamiento="modales" />
</template>

<script src="./SubtareaPage.ts"></script>
