<template>
  <div class="row q-col-gutter-sm q-pa-sm">
    <div class="col col-md-4">
    <q-file
      v-model="imagen"
      dense
      outlined
      clearable
      @update:model-value="comprimir"
      @clear="limpiar"
      accept=".jpg, image/*"
    >
      <template #prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>
    <q-img
      v-show="imagenCodificada"
      :src="imagenCodificada"
      width="100%"
      height="50%"
      fit="contain"
    >
    </q-img>
    <q-dialog v-model="opened" maximized>
      <q-card class="bg-black rounded-card no-border" flat>
        <!-- <q-toolbar class="rounded-header" rounded>
        <q-avatar square>
          <q-icon name="bi-image" color="white"></q-icon>
        </q-avatar>

        <q-toolbar-title class="text-grey-4"
          ><span>Vista previa</span></q-toolbar-title
        >

        <q-btn
          round
          push
          color="negative"
          glossy
          dense
          icon="bi-x"
          v-close-popup
        />
      </q-toolbar> -->

        <q-btn
          round
          push
          color="negative"
          glossy
          icon="bi-x"
          @click="() => (opened = false)"
          class="closeButton"
        />

        <q-card-section class="rounded-footer text-center q-pa-none">
          <q-img
            v-show="imagenCodificada"
            :src="imagenCodificada"
            fit="contain"
            width="80%"
            height="100vh"
          >
          </q-img>
        </q-card-section>
      </q-card>
    </q-dialog>

    <small v-if="imagenCodificada" class="block text-center q-py-sm">
      <q-btn
        outline
        glossy
        color="primary"
        @click="opened = true"
        label="Ver en pantalla completa"
        no-caps
      />
    </small>
  </div>
  </div>
</template>
<script src="./imagenComprimida.ts"></script>
