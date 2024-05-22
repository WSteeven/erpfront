<template>
  <simple-layout
    :mixin="mixin"
    :mostrar-listado="false"
    :permitir-guardar="false"
    :permitir-editar="itemsExamenes.length"
  >
    <template #formulario>
      <div v-if="itemsExamenes.length" class="row bg-desenfoque rounded q-px-md">
        <!-- Manejo de archivos -->
        <!-- <div v-if="itemsExamenes.length" class="col-12 q-mb-md">
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
        </div> -->

        <div
          v-for="itemExamen in itemsExamenes"
          :key="itemExamen.examen"
          class="col-12"
        >
          <div
            class="text-bold text-center bg-grey-3 border-grey d-inline rounded q-py-sm q-mb-sm q-mt-xl"
          >
            <q-icon name="bi-table" class="q-mr-sm"></q-icon>
            {{ itemExamen.examen }}
          </div>
          <div
            v-for="categoria in itemExamen.categorias"
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
        </div>

        <!-- <div class="col-12">
          <label class="q-mb-sm block">Observación</label>
          <q-input
            v-model="resultadoExamen.observacion"
            outlined
            dense
          ></q-input>
        </div> -->
      </div>
      <div v-else>Aún no tienes exámenes médicos solicitados.</div>
    </template>

    <template #custom-buttons>
      <!-- <q-btn v-if="mostrarGuardar" color="primary" push no-caps @click="guardarResultadosExamenes()">
        <q-icon name="bi-save" size="xs" class="q-mr-sm"></q-icon>
        Guardar</q-btn
      > -->
      <q-btn v-if="mostrarEditar" color="primary" push no-caps @click="editarResultadosExamenes()">
        <q-icon name="bi-save" size="xs" class="q-mr-sm"></q-icon>
        Guardar cambios</q-btn
      >
    </template>
  </simple-layout>
</template>

<script src="./ResultadosExamenPage.ts"></script>
