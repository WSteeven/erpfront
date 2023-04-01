<template>
  <q-page>
    <div class="q-mb-md">
      Código de subtarea: <b>{{ codigoSubtarea }}</b>
    </div>
    <!-- <div
      v-if="esLider"
      class="col-12 rounded-card q-py-md text-center text-white bg-warning q-mb-sm"
    >
      <div class="q-mb-md text-shadow">
        Ésta entrada aún no se ha sincronizado.
      </div>
      <div class="q-mb-md text-bold">Modo offline.</div>
      <q-btn color="white" outline no-caps>
        <q-icon name="bi-cloud-upload-fill" class="q-mr-sm"></q-icon>
        Sincronizar ahora</q-btn
      >
    </div> -->

    <q-card class="rounded-card custom-shadow q-pa-md">
      <!-- <div
        class="col-12 rounded-card q-py-sm q-mb-md text-center text-primary bg-blue-2"
      >
        <div>
          <q-icon name="bi-info-circle-fill" class="q-mr-sm"></q-icon>
          <div>
            Espere a que el responsable de la subtarea la marque como REALIZADO
            para proceder a editar el seguimiento.
          </div>
          <b>Acceso de sólo lectura</b>
        </div>
      </div> -->
      <div class="row">
        <div class="col-12 q-mb-md">
          <trabajo-realizado
            :listado="emergencia.trabajo_realizado"
            @actualizar="(data) => (emergencia.trabajo_realizado = data)"
          ></trabajo-realizado>
        </div>

        <div class="col-12 q-mb-md">
          <br />
          <q-checkbox
            v-model="usarMaterialTarea"
            label="Utilizar material de la tarea"
            dense
          ></q-checkbox>
        </div>

        <div v-if="usarMaterialTarea" class="col-12 q-mb-md">
          <essential-table
            titulo="Materiales designados para la tarea"
            :configuracionColumnas="columnasMaterial"
            :datos="materiales"
            :alto-fijo="false"
            :permitirConsultar="false"
            :permitirEliminar="false"
            :permitirEditar="false"
            :permitir-buscar="false"
            :permitirEditarModal="true"
            separador="cell"
            :accion1="botonEditarCantidad"
          ></essential-table>
        </div>

        <div class="col-12 q-mb-md">
          <br />
          <q-checkbox
            v-model="usarStock"
            label="Utilizar material del stock personal"
            dense
          ></q-checkbox>
        </div>

        <div v-if="usarStock" class="col-12 q-mb-md">
          <essential-table
            titulo="Materiales del stock personal"
            :configuracionColumnas="columnasMaterial"
            :datos="materialesStock"
            :alto-fijo="false"
            :permitirConsultar="false"
            :permitirEliminar="false"
            :permitirEditar="false"
            :permitir-buscar="false"
            :permitirEditarModal="true"
            separador="cell"
            :accion1="botonEditarCantidadStock"
          ></essential-table>
        </div>

        <div class="col-12 q-mb-md">
          <br />
          <q-checkbox
            v-model="existeObservaciones"
            label="Agregar observaciones"
            dense
          ></q-checkbox>
        </div>

        <div v-if="existeObservaciones" class="col-12 q-mb-md">
          <tabla-observaciones
            :listado="emergencia.observaciones"
            @actualizar="(data) => (emergencia.observaciones = data)"
          ></tabla-observaciones>
        </div>

        <div class="col-12 q-mb-md">
          <br />
          <q-checkbox
            v-model="existeMaterialesDevolucion"
            label="Seleccionar materiales para devolución (Desmontaje)"
            dense
          ></q-checkbox>
        </div>

        <div v-if="existeMaterialesDevolucion" class="col-12 q-mb-md">
          <tabla-devolucion-producto
            :listado="emergencia.materiales_devolucion"
            :listadoProductos="listadosAuxiliares.productos"
            @actualizar="(data) => (emergencia.materiales_devolucion = data)"
            :alto-fijo="false"
            :mostrarFooter="!emergencia.materiales_devolucion.length"
          >
          </tabla-devolucion-producto>
        </div>
      </div>

      <div class="row justify-end q-col-gutter-x-xs">
        <q-btn
          v-if="esCoordinador"
          color="positive"
          no-caps
          push
          class="q-mr-sm"
          @click="descargarExcel()"
        >
          <q-icon name="bi-file-spreadsheet" size="xs" class="q-pr-sm"></q-icon>
          <span>Descargar Excel</span>
        </q-btn>

        <button-submits
          :accion="accion"
          @cerrar-modal="emit('cerrar-modal')"
          @cancelar="reestablecer()"
          @editar="editarSeguimiento()"
          @guardar="guardarSeguimiento()"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script src="./EmergenciaPage.ts"></script>
