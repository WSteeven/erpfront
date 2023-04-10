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
        <!-- <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Tarea</label>
          <q-input v-model="subtarea.tarea" outlined dense disable></q-input>
        </div> -->

        <!-- Tipo trabajo -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Tipo de trabajo a realizar</label>
          <q-select
            v-model="subtarea.tipo_trabajo"
            :options="tiposTrabajos"
            @filter="filtrarTiposTrabajos"
            transition-show="scale"
            transition-hide="scale"
            hint="Obligatorio"
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
            :hint="subtarea.es_ventana ? 'Obligatorio' : 'Opcional'"
            stack-label
            outlined
            clearable
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
            :hint="subtarea.es_ventana ? 'Obligatorio' : 'Opcional'"
            clearable
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

        <!-- Tiempo estimado del trabajo -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Tiempo estimado del trabajo</label>
          <q-input
            v-model="subtarea.tiempo_estimado"
            type="number"
            :disable="disabled"
            min="0"
            placeholder="Opcional"
            :hint="tiempoFormateado"
            suffix="minutos"
            @update:model-value="convertir()"
            outlined
            clearable
            dense
          >
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
      <designar-responsable-trabajo
        :disable="disabled"
        :accion="accion"
        :v$="v$"
        :subtarea-inicial="subtarea"
        @seleccionarGrupo="seleccionarGrupo"
        @seleccionarEmpleado="seleccionarEmpleado"
        @seleccionarModoDesignacion="seleccionarModoDesignacion"
        @actualizar-empleados="
          (empleados) => (subtarea.empleados_designados = empleados)
        "
      ></designar-responsable-trabajo>
    </q-expansion-item>

    <q-expansion-item
      v-if="accion !== acciones.nuevo"
      class="overflow-hidden q-mb-md expansion"
      label="Ubicación del trabajo"
      header-class="bg-header-collapse"
      default-opened
    >
      <div v-if="subtarea.ruta_tarea" class="row q-pa-md">
        <!-- Ruta de tarea -->
        <div class="col-12">
          <label class="q-mb-sm block">Ruta</label>
          <q-input
            v-model="subtarea.ruta_tarea"
            disable
            autofocus
            outlined
            dense
          >
          </q-input>
        </div>
      </div>

      <div v-if="subtarea.cliente_final" class="row q-col-gutter-sm q-pa-md">
        <!-- Nombre -->
        <div class="col-12 col-md-6">
          <label class="q-mb-sm block">Cliente final</label>
          <q-input
            v-model="nombresClienteFinal"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Id de cliente -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">ID de cliente final</label>
          <q-input
            v-model="clienteFinal.id_cliente_final"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Celular -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Celular</label>
          <q-input
            v-model="clienteFinal.celular"
            outlined
            dense
            disable
          ></q-input>
        </div>

        <!-- Provincia -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Provincia</label>
          <q-input
            v-model="clienteFinal.provincia_nombre"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Provincia -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Cantón</label>
          <q-input
            v-model="clienteFinal.canton_nombre"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Parroquia -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Parroquia/Barrio</label>
          <q-input
            v-model="clienteFinal.parroquia"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Direccion -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Dirección</label>
          <q-input
            v-model="clienteFinal.direccion"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Referencias -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Referencia</label>
          <q-input
            v-model="clienteFinal.referencia"
            disable
            outlined
            dense
          ></q-input>
        </div>

        <!-- Coordenadas -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Coordenada latitud</label>
          <q-input
            v-model="clienteFinal.coordenada_latitud"
            disable
            outlined
            dense
          >
          </q-input>
        </div>

        <!-- Coordenadas -->
        <div class="col-12 col-md-3">
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

    <q-expansion-item
      v-if="accion !== acciones.nuevo"
      class="overflow-hidden q-mb-md expansion"
      label="Ciclo de vida de la subtarea"
      header-class="text-bold bg-header-collapse"
      default-opened
    >
      <div class="q-pa-md q-gutter-y-md">
        <tiempo-subtarea
          :disable="disabled"
          :subtarea="subtarea"
        ></tiempo-subtarea>

        <tabla-subtarea-pausas
          :id-subtarea="subtarea.id"
        ></tabla-subtarea-pausas>

        <tabla-subtarea-suspendida
          :id-subtarea="subtarea.id"
        ></tabla-subtarea-suspendida>
      </div>
    </q-expansion-item>

    <q-expansion-item
      v-if="accion !== acciones.nuevo"
      class="overflow-hidden q-mb-md expansion"
      label="Movilización"
      header-class="text-bold bg-header-collapse"
      default-opened
    >
      <div class="q-pa-md q-gutter-y-md">
        <essential-table
          titulo="Movilizaciones"
          :configuracionColumnas="configuracionColumnasMovilizacionSubtarea"
          :datos="movilizacionesSubtarea"
          :mostrarBotones="false"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :alto-fijo="false"
          :mostrar-header="true"
          :permitir-buscar="false"
        >
        </essential-table>
      </div>
    </q-expansion-item>

    <b v-if="accion === acciones.nuevo" class="block q-mb-md"
      >Compartir archivos</b
    >
    <div v-if="accion === acciones.nuevo" class="col-12 q-mb-md">
      <q-uploader
        ref="refUploader"
        label="Selecciona o arrastra tus archivos aquí (Máximo 10mb)"
        multiple
        style="width: 100%"
        flat
        :factory="factoryFn"
        color="white"
        text-color="black"
        class="bg-header-collapse expansion"
        hide-upload-btn
        max-total-size="10485760"
        @rejected="onRejected"
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

    <div class="row justify-end q-col-gutter-x-xs">
      <button-submits
        :accion="accion"
        label-guardar="Guardar y agendar"
        :permitirCancelar="false"
        @cancelar="reestablecerDatos()"
        @guardar="guardarDatos(subtarea)"
      />
    </div>

    <!--<essential-selectable-table
      ref="refListadoSeleccionableEmpleadosGrupo"
      :configuracion-columnas="configuracionColumnasEmpleadoGrupo"
      :datos="listadoEmpleadosGrupo"
      tipo-seleccion="multiple"
      @selected="seleccionarEmpleadosGrupo"
    ></essential-selectable-table> -->
  </div>

  <modales-entidad :comportamiento="modales" />
</template>

<script src="./SubtareaPage.ts"></script>
