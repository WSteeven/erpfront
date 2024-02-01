<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="CIE"
    :mostrarButtonSubmits="!enviar_masivo"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md q-mt-md q-mx-md q-py-sm">
          <div class="col-12 col-md-12">
            <archivo-seguimiento
              ref="refArchivoCie"
              :mixin="mixinCie"
              :endpoint="endpoint"
              :disable="!esNuevo"
              :permitir-eliminar="false"
              :listar-al-guardar="false"
              :esMultiple="false"
              label="Archivo Masivo"
            >
            <template #boton-subir>
              <q-btn
                v-if="mostrarBotonSubir"
                color="positive"
                push
                no-caps
                class="full-width q-mb-lg"
                @click="subirArchivos()"
              >
                <q-icon name="bi-upload" class="q-mr-sm" size="xs"></q-icon>
                Subir archivos seleccionados</q-btn
              >
            </template>
            </archivo-seguimiento>
          </div>
          <div class="col-12 col-md-6" v-if="!enviar_masivo">
            <label class="q-mb-sm block">Codigo</label>
            <q-input v-model="cie.codigo" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
          <div class="col-12 col-md-6" v-if="!enviar_masivo">
            <label class="q-mb-sm block">Nombre</label>
            <q-input v-model="cie.nombre" :disable="!esNuevo" outlined dense>
            </q-input>
          </div>
        </div>
      </q-form>

    </template>
  </tab-layout>
</template>
<script src="./CiePage.ts" />
