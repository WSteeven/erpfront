<template>
  <q-page>
    <div class="q-mb-md text-secondary">
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
      <div class="row">
        <div class="col-12 q-mb-md">
          <trabajo-realizado
            :listado="emergencia.trabajo_realizado"
            @actualizar="(data) => (emergencia.trabajo_realizado = data)"
          ></trabajo-realizado>
        </div>

        <div class="col-12 q-mb-md">
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
            label="Seleccionar materiales para devolución"
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

      <div class="full-width text-bold q-my-md">Evidencia fotográfica</div>
      <div class="row q-col-gutter-sm q-mb-md">
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block"
            >Lecturas del OTDR antes de iniciar los trabajos</label
          >
          <selector-imagen
            :imagen="emergencia.imagen_lectura_antes"
            @update:modelValue="
              (data) => (emergencia.imagen_lectura_antes = data)
            "
          >
          </selector-imagen>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block"
            >Fotografía del incidente o lugar de afectación</label
          >
          <selector-imagen :imagen="emergencia.imagen_incidente">
          </selector-imagen>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Fotografía lecturas de reparación</label>
          <selector-imagen :imagen="emergencia.imagen_reparacion">
          </selector-imagen>
        </div>
      </div>

      <div class="full-width text-bold q-mb-md">Fotográfia del cableado</div>
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Punta inicial</label>
          <selector-imagen :imagen="emergencia.imagen_punta_inicial">
          </selector-imagen>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Punta final</label>
          <selector-imagen :imagen="emergencia.imagen_punta_final">
          </selector-imagen>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Evidencia del cableado</label>
          <selector-imagen :imagen="emergencia.imagen_evidencia_cableado">
          </selector-imagen>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Mangas tejidas</label>
          <selector-imagen :imagen="emergencia.imagen_mangas_tejidas">
          </selector-imagen>
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
          @editar="editar(emergencia)"
          @guardar="guardar(emergencia)"
        />
      </div>
    </q-card>
  </q-page>
</template>

<script src="./EmergenciaPage.ts"></script>
