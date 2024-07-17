<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Código</label>
            <q-input v-model="activo.codigo" disable outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Descripción</label>
            <q-input v-model="activo.descripcion" disable outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo</label>
            <q-input v-model="activo.tipo" disable outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Marca</label>
            <q-input v-model="activo.marca" disable outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Modelo</label>
            <q-input v-model="activo.modelo" disable outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Serie</label>
            <q-input v-model="activo.serie" disable outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Calibre</label>
            <q-input v-model="activo.calibre" disable outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Doc. Permiso</label>
            <q-input v-model="activo.doc_permiso" disable outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de caducidad del permiso</label>
            <q-input
              v-model="activo.fecha_caducidad_permiso"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Unidad de medida</label>
            <q-input v-model="activo.unidad_medida" disable outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de caducidad del producto</label>
            <q-input
              v-model="activo.fecha_caducidad_producto"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Entrada (Ingresos)</label>
            <q-input v-model="activo.total_ingresos" disable outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Salidas (Egresos)</label>
            <q-input v-model="activo.total_egresos" disable outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Diferencia (Ingresos-Egresos)</label>
            <q-input v-model="activo.total_egresos" disable outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fotografía</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="activo.fotografia"
              disable
              :alto="'200px'"
              @update:model-value="(data) => (activo.fotografia = data)"
            ></selector-imagen>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fotografía del permiso (anverso)</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="activo.fotografia_permiso_anverso"
              disable
              :alto="'200px'"
              @update:model-value="(data) => (activo.fotografia = data)"
            ></selector-imagen>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ControlActivoFijoPage.ts" />
