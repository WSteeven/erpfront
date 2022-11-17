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
              :datos="subtarea.tecnicos_grupo_principal ?? []"
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

        <!--<div class="row q-gutter-xs q-px-md q-mb-md">
          <div class="col-12">
            <div class="text-bold q-mb-md">Cambiar estado de la subtarea</div>
          </div>

          <q-btn color="negative" no-caps @click="suspender()" push>
            <q-icon name="bi-x-lg" class="q-mr-sm" size="xs"></q-icon>
            <div>Suspender</div>
          </q-btn>

          <q-btn color="primary" no-caps @click="pausar()" push>
            <q-icon
              v-if="!pausado"
              name="bi-pause"
              size="xs"
              class="q-mr-sm"
            ></q-icon>
            <q-icon v-else name="bi-play" size="xs" class="q-mr-sm"></q-icon>
            <span v-if="!pausado">Pausar</span>
            <span v-else>Reanudar</span>
          </q-btn>

          <q-btn color="positive" no-caps @click="realizar()" push>
            <q-icon name="bi-check" size="xs" class="q-mr-sm"></q-icon>
            <div>Realizado</div>
          </q-btn>
        </div> -->
      </q-expansion-item>

      <q-expansion-item
        class="overflow-hidden q-mb-md"
        style="border-radius: 8px; border: 1px solid #ddd"
        :label="subtarea.cliente ? 'Cliente final' : 'Ubicación manual'"
        header-class="bg-grey-1"
        default-opened
      >
        <div class="row q-col-gutter-sm q-pa-md">
          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Contacto</label>
            <q-input
              v-model="subtarea.contacto"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Id de cliente -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">ID Cliente</label>
            <q-input
              v-model="subtarea.id_cliente"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Celular -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Celular</label>
            <q-input
              v-model="subtarea.celular"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Provincia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Provincias</label>
            <q-select
              v-model="subtarea.provincia"
              :options="provincias"
              disable
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
              disable
              options-dense
              dense
            />
          </div>

          <!-- Parroquia -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Parroquia/Barrio</label>
            <q-input
              v-model="subtarea.parroquia"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Direccion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Dirección</label>
            <q-input
              v-model="subtarea.direccion"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Referencias -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Referencias</label>
            <q-input
              v-model="subtarea.referencias"
              disable
              outlined
              dense
            ></q-input>
          </div>

          <!-- Coordenadas -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Coordenadas</label>
            <q-input v-model="subtarea.coordenadas" disable outlined dense>
            </q-input>
          </div>
        </div>
      </q-expansion-item>

      <!-- Botones formulario -->
      <!--<div class="row q-gutter-md justify-end">
        <q-btn color="primary" no-caps :to="{ name: 'trabajo_asignado' }" push>
          <q-icon name="bi-chevron-left" size="xs" class="q-mr-sm"></q-icon>
          <div>Volver</div>
        </q-btn>
      </div> -->
    </q-form>
  </q-page>
</template>

<script src="./SubtareaAsignadaPage.ts"></script>
