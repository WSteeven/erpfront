<template>
  <q-page padding>
    <div class="text-h6 q-my-md q-ml-md">Subtarea</div>

    <q-form @submit.prevent="enviar()">
      <!-- Datos de la subtarea -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        icon="map"
        label="Datos de la subtarea"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <!-- Tarea -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Código tarea JP</label>
            <q-input
              v-model="subtarea.codigo_tarea_jp"
              readonly
              outlined
              dense
            ></q-input>
          </div>

          <!-- Detalle de la tarea -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Detalle de la tarea</label>
            <q-input
              v-model="subtarea.detalle_tarea"
              outlined
              dense
              readonly
              autogrow
              type="textarea"
            ></q-input>
          </div>

          <!-- Subtarea -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Código subtarea</label>
            <q-input
              v-model="subtarea.codigo_subtarea"
              placeholder="Obligatorio"
              readonly
              outlined
              dense
            ></q-input>
          </div>

          <!-- Detalle de la subtarea -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Detalle de la subtarea</label>
            <q-input
              v-model="subtarea.detalle_subtarea"
              outlined
              dense
              autogrow
              type="textarea"
            ></q-input>
          </div>

          <!-- Grupo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Grupo</label>
            <q-input
              v-model="subtarea.grupo"
              placeholder="Obligatorio"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Técnico responsable -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Técnico responsable</label>
            <q-input v-model="subtarea.grupo" readonly outlined dense></q-input>
          </div>

          <!-- Cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cliente</label>
            <q-input
              v-model="subtarea.cliente"
              readonly
              outlined
              dense
            ></q-input>
          </div>

          <!-- Tipo tarea -->
          <div class="col-12 col-md-3">
            <label-abrir-modal
              label="Tipo de tarea"
              @click="modalesSubtarea.abrirModalEntidad('TipoTareaPage')"
            ></label-abrir-modal>
            <q-select
              v-model="subtarea.tipo_tarea"
              :options="tiposTareasTelconet"
              options-dense
              dense
              outlined
            />
          </div>

          <!-- Coordinador -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Coordinador</label>
            <q-input
              v-model="subtarea.coordinador"
              outlined
              dense
              readonly
            ></q-input>
          </div>

          <!-- Estado actual -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado actual</label>
            <q-input
              v-model="subtarea.estado"
              outlined
              dense
              readonly
            ></q-input>
          </div>

          <!-- Fiscalizador -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fiscalizador</label>
            <q-input
              v-model="subtarea.fiscalizador"
              placeholder="Opcional"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Ingeniero de soporte -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ingeniero de soporte</label>
            <q-input
              v-model="subtarea.ing_soporte"
              placeholder="Opcional"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Ingeniero de instalacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ingeniero de instalación</label>
            <q-input
              v-model="subtarea.ing_instalacion"
              placeholder="Opcional"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Tipo de instalacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo de instalación</label>
            <q-select
              v-model="subtarea.tipo_instalacion"
              :options="tiposInstalaciones"
              options-dense
              dense
              outlined
            />
          </div>

          <!-- Actividad realizada -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Actividad realizada</label>
            <q-input
              v-model="subtarea.actividad_realizada"
              placeholder="Opcional"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Novedades -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Novedades</label>
            <q-input
              v-model="subtarea.novedades"
              placeholder="Opcional"
              outlined
              dense
            ></q-input>
          </div>
        </div>
      </q-expansion-item>

      <!-- Ubicacion del cliente -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        icon="map"
        label="Ubicación del cliente"
        header-class="bg-grey-1"
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <!-- Provincia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Provincias</label>
            <q-select
              v-model="subtarea.provincia"
              :options="provincias"
              options-dense
              dense
              outlined
            />
          </div>

          <!-- Ciudad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ciudades</label>
            <q-select
              outlined
              v-model="subtarea.ciudad"
              :options="ciudades"
              options-dense
              dense
            />
          </div>

          <!-- Parroquia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Parroquia/Barrio</label>
            <q-input
              v-model="subtarea.parroquia"
              placeholder="Opcional"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Direccion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dirección</label>
            <q-input
              v-model="subtarea.direccion"
              placeholder="Opcional"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Referencias -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Referencias</label>
            <q-input
              v-model="subtarea.referencias"
              placeholder="Opcional"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Georeferencia X -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Georeferencia Y (DMS)</label>
            <q-input
              v-model="subtarea.georeferencia_x"
              placeholder="Opcional"
              outlined
              dense
            >
              <template #append>
                <q-icon name="bi-arrow-repeat" class="q-mr-sm"></q-icon>
                <div class="text-caption">Convertir a UTM</div>
              </template>
            </q-input>
          </div>

          <!-- Georeferencia Y -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Georeferencia Y (DMS)</label>
            <q-input
              v-model="subtarea.georeferencia_y"
              placeholder="Opcional"
              outlined
              dense
            >
              <template #append>
                <q-icon name="bi-arrow-repeat" class="q-mr-sm"></q-icon>
                <div class="text-caption">Convertir a UTM</div>
              </template>
            </q-input>
          </div>
        </div></q-expansion-item
      >

      <!-- Asignar técnicos de otros grupos -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        icon="map"
        label="Asignar técnicos de otros grupos"
        header-class="bg-grey-1"
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
              toggle-color="grey-7"
              color="white"
              text-color="grey-7"
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
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Buscar</label>
            <q-input
              v-model="busqueda"
              placeholder="Nombres / Apellidos / Identificación"
              hint="Ingrese los datos del técnico y presione Enter"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Tecnico seleccionado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Técnico seleccionado</label>
            <q-input
              v-model="tecnicoSeleccionado"
              readonly
              outlined
              dense
            ></q-input>
          </div>

          <div class="col-12 col-md-3 q-pt-md">
            <br />
            <q-btn color="positive" no-caps class="full-width" push>
              <q-icon name="bi-plus" class="q-pr-sm" size="xs"></q-icon>
              <div>Agregar al listado</div>
            </q-btn>
          </div>
        </div>

        <!-- Busqueda por grupo -->
        <div v-else class="row q-col-gutter-sm q-pa-md">
          <!-- Grupo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Grupo</label>
            <q-select
              v-model="busqueda"
              :options="grupos"
              hint="Seleccione un grupo y presione en Listar técnicos"
              options-dense
              dense
              outlined
            />
          </div>

          <div class="col-12 col-md-3 q-pt-md">
            <br />
            <q-btn color="positive" no-caps class="full-width" push>
              <div>Listar técnicos</div>
            </q-btn>
          </div>

          <!-- Tecnico seleccionado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Técnico seleccionado</label>
            <q-input
              v-model="tecnicoSeleccionado"
              readonly
              outlined
              dense
            ></q-input>
          </div>

          <div class="col-12 col-md-3 q-pt-md">
            <br />
            <q-btn color="positive" no-caps class="full-width" push>
              <q-icon name="bi-plus" class="q-pr-sm" size="xs"></q-icon>
              <div>Agregar al listado</div>
            </q-btn>
          </div>
        </div>

        <!-- Listado -->
        <div class="row q-col-gutter-sm q-pa-md">
          <!-- Tecnicos temporales -->
          <div class="col-12">
            <essential-table
              titulo="técnicos temporales de otros grupos"
              :configuracionColumnas="columnas"
              :datos="datos"
              :mostrarBotones="false"
              :permitirConsultar="false"
              :permitirEditar="false"
              @eliminar="eliminarTecnico"
            ></essential-table>
          </div>
        </div>
      </q-expansion-item>

      <!-- Botones formulario -->
      <div class="row q-gutter-md justify-end">
        <q-btn color="grey-7" no-caps @click="aprobar()" push>
          <q-icon name="bi-clock-history" class="q-mr-sm" size="xs"></q-icon>
          <div>Historial de estados</div>
        </q-btn>

        <q-btn color="primary" no-caps @click="rechazar()" push>
          <q-icon name="bi-x-lg" size="xs" class="q-mr-sm"></q-icon>
          <div>Guardar cambios</div>
        </q-btn>
      </div>
    </q-form>

    <modales-entidad :comportamiento="modalesSubtarea" />
  </q-page>
</template>

<script src="./SubtareaPage.ts"></script>

<style lang="scss" scoped>
.my-custom-toggle {
  border: 1px solid #8d8d8d;
}
</style>
