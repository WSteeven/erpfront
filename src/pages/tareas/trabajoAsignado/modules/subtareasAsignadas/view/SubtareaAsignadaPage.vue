<template>
  <q-page padding>
    <q-form @submit.prevent="enviar()">
      <!-- Datos de la subtarea -->
      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        icon="bi-paperclip"
        label="Información general"
        header-class="bg-grey-1"
        default-opened
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <!-- Subtarea -->
          <div class="col-12 col-md-3">
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
              outlined
              disable
              dense
              autogrow
              autofocus
              type="textarea"
            ></q-input>
          </div>

          <!-- Grupo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Grupo asignado</label>
            <q-select
              v-model="subtarea.grupo"
              :options="grupos"
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
              disable
            >
            </q-select>
          </div>

          <!-- Tipo trabajo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo de trabajo</label>
            <q-select
              v-model="subtarea.tipo_trabajo"
              :options="tiposTrabajos"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              disable
              :option-label="(item) => item.nombre"
              :option-value="(item) => item.id"
              emit-value
              map-options
            >
            </q-select>
          </div>

          <div class="col-12 col-md-9">
            <label class="q-mb-sm block"
              >Descripción completa del trabajo a realizar</label
            >
            <q-input
              v-model="subtarea.descripcion_completa"
              autogrow
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Es ventana -->
          <div class="col-12 col-md-3">
            <br />
            <q-checkbox
              v-model="subtarea.es_ventana"
              label="Es ventana de trabajo"
              outlined
              dense
              disable
            ></q-checkbox>
          </div>

          <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de ventana</label>
            <q-input v-model="subtarea.fecha_ventana" outlined dense disable>
            </q-input>
          </div>

          <!-- Hora inicio de ventana -->
          <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
            <label class="q-mb-sm block">Hora inicio de ventana</label>
            <q-input
              v-model="subtarea.hora_inicio_ventana"
              outlined
              dense
              disable
            />
          </div>

          <!-- Hora fin de ventana -->
          <div v-if="subtarea.es_ventana" class="col-12 col-md-3">
            <label class="q-mb-sm block">Hora fin de ventana</label>
            <q-input
              v-model="subtarea.hora_fin_ventana"
              outlined
              dense
              disable
            />
          </div>

          <div class="col-12">
            <essential-table
              titulo="Técnicos asignados"
              :configuracionColumnas="configuracionColumnasTecnico"
              :datos="
                [
                  ...subtarea.tecnicos_grupo_principal,
                  ...subtarea.tecnicos_otros_grupos,
                ] ?? []
              "
              :mostrarBotones="false"
              :permitirConsultar="false"
              :permitirEditar="false"
              :alto-fijo="false"
              :mostrar-header="false"
              :mostrar-footer="false"
            >
            </essential-table>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        label="Ubicación del trabajo"
        header-class="bg-grey-1"
        default-opened
      >
        <div
          v-if="tipoUbicacionTrabajo === 'ubicacion_manual'"
          class="row q-col-gutter-sm q-pa-md"
        >
          <!-- Provincia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Provincias</label>
            <q-select
              v-model="subtarea.ubicacion_tarea.provincia"
              :options="provincias"
              @filter="filtrarProvincias"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.provincia"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              disable
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
              v-model="subtarea.ubicacion_tarea.canton"
              :options="cantonesPorProvincia"
              @filter="filtrarCantones"
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
              disable
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
              v-model="subtarea.ubicacion_tarea.parroquia"
              @update:model-value="
                (v) => (subtarea.ubicacion_tarea.parroquia = v.toUpperCase())
              "
              outlined
              dense
              disable
            ></q-input>
          </div>

          <!-- Direccion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dirección</label>
            <q-input
              v-model="subtarea.ubicacion_tarea.direccion"
              @update:model-value="
                (v) => (subtarea.ubicacion_tarea.direccion = v.toUpperCase())
              "
              outlined
              dense
              disable
            ></q-input>
          </div>

          <!-- Referencias -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Referencias</label>
            <q-input
              v-model="subtarea.ubicacion_tarea.referencias"
              @update:model-value="
                (v) => (subtarea.ubicacion_tarea.referencias = v.toUpperCase())
              "
              outlined
              dense
              disable
            ></q-input>
          </div>

          <!-- Coordenadas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Coordenadas</label>
            <q-input
              v-model="subtarea.ubicacion_tarea.coordenadas"
              @update:model-value="
                (v) => (subtarea.ubicacion_tarea.coordenadas = v.toUpperCase())
              "
              outlined
              dense
              disable
            >
            </q-input>
          </div>
        </div>

        <div
          v-if="tipoUbicacionTrabajo === 'cliente_final'"
          class="row q-col-gutter-sm q-pa-md"
        >
          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cliente final</label>
            <q-select
              v-model="subtarea.cliente_final"
              :options="clientesFinales"
              @filter="filtrarClientesFinales"
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
              @update:model-value="
                (v) => obtenerClienteFinal(subtarea.cliente_final)
              "
              disable
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

          <!-- Id de cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">ID Cliente</label>
            <q-input
              v-model="clienteFinal.id_cliente"
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
            <label class="q-mb-sm block">Referencias</label>
            <q-input
              v-model="clienteFinal.referencias"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Coordenadas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Coordenadas</label>
            <q-input v-model="clienteFinal.coordenadas" disable outlined dense>
            </q-input>
          </div>
        </div>
      </q-expansion-item>
    </q-form>
  </q-page>
</template>

<script src="./SubtareaAsignadaPage.ts"></script>
