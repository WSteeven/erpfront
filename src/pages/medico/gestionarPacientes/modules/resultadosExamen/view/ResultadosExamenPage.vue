<template>
  <tab-layout :mixin="mixin" :mostrar-listado="false">
    <template #formulario>
      <div class="text-center q-mb-md">{{ categoriaExamen }}</div>
      <div class="text-center text-primary q-mb-md">{{ examen }}</div>

      <div class="row bg-body-table q-pa-md">
        <div
          v-for="categoria in resultadosExamenes"
          :key="categoria.id"
          class="col-12 text-center text-bold q-mb-md"
        >
          <essential-table
            :titulo="categoria.categoria"
            :configuracionColumnas="configuracionColumnasCampos"
            :datos="categoria.campos"
            :alto-fijo="false"
            :permitirConsultar="false"
            :permitirEditar="false"
            :permitirEliminar="false"
            :mostrar-footer="false"
            separador="cell"
            :permitirEditarCeldas="true"
            :permitir-buscar="false"
          ></essential-table>
        </div>

        <div class="col-12">
          <label class="q-mb-sm block">Observación</label>
          <q-input
            v-model="resultadoExamen.observacion"
            outlined
            dense
          ></q-input>
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
    </template>
  </tab-layout>
</template>

<script src="./ResultadosExamenPage.ts"></script>
