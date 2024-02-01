<template>
  <q-page>
    <div class="row bg-body q-pa-md">
      <div class="col-12 text-center text-bold q-mb-md">
        <div class="q-mb-md">{{ categoria?.nombre }}</div>
        <essential-table
          :configuracionColumnas="configuracionColumnasCampos"
          :datos="campos"
          :alto-fijo="false"
          :permitirConsultar="false"
          :permitirEditar="false"
          :permitirEliminar="false"
          :mostrar-footer="false"
        ></essential-table>
      </div>

      <div class="col-12">
        <label class="q-mb-sm block">Observación</label>
        <q-input v-model="observacion" outlined dense></q-input>
      </div>

      <!-- Manejo de archivos -->
      <div class="col-12 q-mb-md">
        <gestor-archivos
          ref="refArchivo"
          label="Adjuntar archivos"
          :mixin="mixin"
          :listarAlGuardar="false"
          :idModelo="idTransferencia"
        >
          <template #boton-subir>
            <q-btn
              v-if="false"
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
        </gestor-archivos>
      </div>
    </div>
  </q-page>
</template>

<script src="./ResultadosExamenPage.ts"></script>
