<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnas"
    titulo-pagina="Progresivas"
    :accion1="btnImprimirOT"
    :accion2="btnImprimirProgresiva"
    :accion3="btnImprimirKML"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Filename -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="progresiva.filename"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              autogrow
              dense
            />
          </div>

          <!-- Ciudad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Ciudad</label>
            <q-input
              v-model="progresiva.ciudad"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- Proyecto -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Proyecto</label>
            <q-input
              v-model="progresiva.proyecto"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- Enlace -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Enlace</label>
            <q-input
              v-model="progresiva.enlace"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- fecha_instalacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha Instalación</label>
            <q-input
              v-model="progresiva.fecha_instalacion"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- N° Tarea -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">N° Tarea</label>
            <q-input
              v-model="progresiva.num_tarea"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- cod_bobina -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cod. Bobina</label>
            <q-input
              v-model="progresiva.cod_bobina"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- Responsable -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Responsable</label>
            <q-input
              v-model="progresiva.responsable"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- fo instalada -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">FO Instalada</label>
            <q-input
              v-model="progresiva.fo_instalada"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- mt_inicial -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Mt Inicial</label>
            <q-input
              v-model="progresiva.mt_inicial"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- mt_final -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Mt Final</label>
            <q-input
              v-model="progresiva.mt_final"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- hilos -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Hilos</label>
            <q-input
              v-model="progresiva.hilos"
              placeholder="Obligatorio"
              :disable="disabled"
              outlined
              dense
            />
          </div>

          <!-- registros de progresivas -->
          <div
            class="col-12"
            v-if="[acciones.consultar, acciones.editar].includes(accion)"
          >
            <essential-table
              :datos="progresiva.registros_progresivas"
              :configuracion-columnas="configuracionColumnasPostesProgresivas"
              ajustar-celdas :alto-fijo="false"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ProgresivaPage.ts" />
