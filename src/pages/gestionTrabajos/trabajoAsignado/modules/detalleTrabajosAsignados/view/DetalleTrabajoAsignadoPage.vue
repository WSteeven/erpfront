<template>
  <q-expansion-item
    class="overflow-hidden q-mb-md expansion"
    label="Información general"
    header-class="bg-header-collapse text-bold"
    default-opened
  >
    <div class="row q-col-gutter-sm q-pa-md">
      <!-- Codigo -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Código del trabajo</label>
        <q-input
          v-model="trabajo.codigo_subtarea"
          disable
          outlined
          dense
        ></q-input>
      </div>

      <!-- Tipo trabajo -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Tipo de trabajo</label>
        <q-select
          v-model="trabajo.tipo_trabajo"
          :options="listadosAuxiliares.tiposTrabajos"
          transition-show="scale"
          transition-hide="scale"
          options-dense
          dense
          outlined
          disable
          :option-label="(item) => item.descripcion"
          :option-value="(item) => item.id"
          emit-value
          map-options
        >
        </q-select>
      </div>

      <!-- Titulo -->
      <div class="col-12 col-md-6">
        <label class="q-mb-sm block">Título del trabajo a realizar</label>
        <q-input
          v-model="trabajo.titulo"
          outlined
          disable
          dense
          autogrow
          type="textarea"
        ></q-input>
      </div>

      <div class="col-12 col-md-6 q-mb-md">
        <label class="q-mb-sm block"
          >Descripción completa del trabajo a realizar</label
        >
        <q-input
          v-model="trabajo.descripcion_completa"
          autogrow
          disable
          outlined
          dense
        ></q-input>
      </div>

      <!-- Observacion -->
      <div class="col-12 col-md-6">
        <label class="q-mb-sm block">Observación</label>
        <q-input
          v-model="trabajo.observacion"
          outlined
          disable
          dense
          autogrow
          type="textarea"
        ></q-input>
      </div>

      <!-- Es ventana -->
      <div v-if="trabajo.es_ventana" class="col-12 col-md-3 q-mb-md">
        <q-icon
          name="bi-check-circle-fill"
          color="positive"
          class="q-mr-sm"
        ></q-icon
        >Es ventana de trabajo
      </div>

      <div v-if="trabajo.fecha_agendado" class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de agendamiento</label>
        <q-input v-model="trabajo.fecha_agendado" outlined dense disable>
        </q-input>
      </div>

      <!-- Hora inicio de ventana -->
      <div v-if="trabajo.hora_inicio_agendado" class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora inicio de agendamiento</label>
        <q-input
          v-model="trabajo.hora_inicio_agendado"
          outlined
          dense
          disable
        />
      </div>

      <!-- Hora fin de ventana -->
      <div v-if="trabajo.es_ventana" class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora fin de agendamiento</label>
        <q-input v-model="trabajo.hora_fin_agendado" outlined dense disable />
      </div>

      <!--<div class="col-12">
          <essential-table
            v-if="
              trabajo.modo_asignacion_trabajo ===
              modosAsignacionTrabajo.por_grupo
            "
            titulo="Grupos asignados"
            estilos="margin-bottom: 14px;"
            :configuracionColumnas="configuracionColumnasGrupoSeleccionado"
            :datos="trabajo.grupos_seleccionados"
            :mostrarBotones="false"
            :permitirConsultar="false"
            :permitirEditar="false"
            :permitirEliminar="false"
            :alto-fijo="false"
            :mostrar-header="true"
            :permitir-buscar="false"
            :mostrar-footer="!trabajo.grupos_seleccionados.length"
          >
          </essential-table>

          <essential-table
            v-if="
              trabajo.modo_asignacion_trabajo ===
              modosAsignacionTrabajo.por_grupo
            "
            titulo="Empleados que ejecutarán el trabajo"
            :configuracionColumnas="configuracionColumnasEmpleadoGrupo"
            :datos="trabajo.empleados_seleccionados"
            :mostrarBotones="false"
            :permitirConsultar="false"
            :permitirEditar="false"
            :alto-fijo="false"
            :mostrar-footer="false"
            :permitir-buscar="false"
          >
          </essential-table>

          <essential-table
            v-if="
              trabajo.modo_asignacion_trabajo ===
              modosAsignacionTrabajo.por_trabajador
            "
            titulo="Empleados que ejecutarán el trabajo"
            :configuracionColumnas="configuracionColumnasEmpleadoSeleccionado"
            :datos="trabajo.empleados_seleccionados"
            :mostrarBotones="false"
            :permitirConsultar="false"
            :permitirEditar="false"
            :alto-fijo="false"
            :mostrar-footer="false"
            :permitir-buscar="false"
          >
          </essential-table>
        </div> -->
    </div>
  </q-expansion-item>

  <q-expansion-item
    v-if="trabajo.cliente_final"
    class="overflow-hidden q-mb-md expansion"
    label="Ubicación del trabajo"
    header-class="bg-header-collapse"
    default-opened
  >
    <div class="row q-col-gutter-sm q-pa-md">
      <!-- Nombre -->
      <div class="col-12 col-md-6">
        <label class="q-mb-sm block">Cliente final</label>
        <q-input v-model="nombresClienteFinal" disable outlined dense></q-input>
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
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Canton</label>
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

  <div v-if="archivos.length" class="col-12">
    <div class="text-bold q-mb-md">
      <q-icon name="bi-folder" size="xs" class="q-mr-xs"></q-icon>
      Archivos compartidos
    </div>
    <essential-table
      titulo="Archivos compartidos para el trabajo"
      :configuracionColumnas="columnasGestor"
      :datos="archivos"
      :alto-fijo="false"
      :permitirEliminar="false"
      :permitirConsultar="false"
      :permitirEditar="false"
      :mostrar-header="false"
      :mostrar-footer="false"
      :mostrar-botones="false"
      :accion1="botonDescargar"
    ></essential-table>
  </div>
</template>

<script src="./DetalleTrabajoAsignadoPage.ts"></script>
