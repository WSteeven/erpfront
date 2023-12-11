<template>
  <q-expansion-item
    class="overflow-hidden q-mb-md expansion"
    label="Información general"
    header-class="bg-header-collapse text-bold"
    default-opened
  >
    <div class="row q-col-gutter-sm q-pa-md">
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Tarea</label>
        <q-input
          v-model="trabajo.codigo_tarea"
          disable
          outlined
          dense
        ></q-input>
      </div>

      <!-- Codigo -->
      <div v-if="trabajo.codigo_subtarea" class="col-12 col-md-3">
        <label class="q-mb-sm block">Subtarea</label>
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

      <!-- Metraje tendido -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block"
          >Cantidad de fibra óptica a tender (m)</label
        >
        <q-input v-model="trabajo.metraje_tendido" outlined dense disable>
        </q-input>
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

      <div v-if="trabajo.grupo" class="col-12 col-md-3">
        <label class="q-mb-sm block">Grupo</label>
        <q-input v-model="trabajo.grupo_nombre" outlined dense disable>
        </q-input>
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

      <div v-if="trabajo.fecha_inicio_trabajo" class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de inicio de trabajo</label>
        <q-input v-model="trabajo.fecha_inicio_trabajo" outlined dense disable>
        </q-input>
      </div>

      <!-- Hora inicio de ventana -->
      <div v-if="trabajo.hora_inicio_trabajo" class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora inicio de trabajo</label>
        <q-input v-model="trabajo.hora_inicio_trabajo" outlined dense disable />
      </div>

      <!-- Hora fin de ventana -->
      <div v-if="trabajo.es_ventana" class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora fin de trabajo</label>
        <q-input v-model="trabajo.hora_fin_trabajo" outlined dense disable />
      </div>

      <!-- ATS -->
      <div v-if="ats" class="col-12 col-md-3">
        <label class="q-mb-sm block">ATS</label>
        <q-input v-model="ats" disable outlined dense> </q-input>
      </div>

      <div class="col-12">
        <essential-table
          v-if="
            trabajo.modo_asignacion_trabajo === modosAsignacionTrabajo.por_grupo
          "
          :titulo="
            'Se designaron a ' +
            trabajo.empleados_designados.length +
            ' empleados'
          "
          :configuracionColumnas="configuracionColumnasEmpleadoGrupo"
          :datos="trabajo.empleados_designados"
          :mostrarBotones="false"
          :permitirConsultar="false"
          :permitirEditar="false"
          :alto-fijo="false"
          :mostrar-footer="false"
          :permitir-buscar="false"
        >
        </essential-table>
      </div>
    </div>
  </q-expansion-item>

  <q-expansion-item
    class="overflow-hidden q-mb-md expansion"
    label="Ubicación del trabajo"
    header-class="bg-header-collapse"
    default-opened
  >
    <div class="row q-pa-md">
      <!-- Ruta de tarea -->
      <div v-if="trabajo.ruta_tarea" class="col-12">
        <label class="q-mb-sm block">Ruta</label>
        <q-input v-model="trabajo.ruta_tarea" disable autofocus outlined dense>
        </q-input>
      </div>
    </div>

    <div v-if="trabajo.cliente_final" class="row q-col-gutter-sm q-pa-md">
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
        <label class="q-mb-sm block">Latitud</label>
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
        <label class="q-mb-sm block">Longitud</label>
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
