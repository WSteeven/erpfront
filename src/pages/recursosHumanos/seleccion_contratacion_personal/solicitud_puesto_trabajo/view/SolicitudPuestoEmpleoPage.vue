<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Cargos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre del Puesto</label>
            <q-input
              v-model="solicitudPuestoEmpleo.nombre"
              @update:model-value="
                (v) => (solicitudPuestoEmpleo.nombre = removeAccents(v))
              "
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
           <!-- Manejo de archivos -->
           <div class="col-12 col-md-6 q-mb-md">
            <gestor-archivos
              ref="refArchivo"
              label="Manual de Funciones "
              :mixin="mixin"
              :disable="disabled"
              :listarAlGuardar="false"
              :quiero_subir_archivos ="true"
              :permitir-eliminar="
                accion == acciones.nuevo || accion == acciones.editar
              "
              :idModelo="idDevolucion"
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
          <!-- Descripcion de vacante -->
          <div class="col-12 col-md-6">
            <div class="row justify-between">
              <label class="q-mb-sm block">Descripción de Vacante</label>
              <b class="text-italic">*No enviar imágenes demasiado grandes</b>
            </div>
            <essential-editor
              v-model="solicitudPuestoEmpleo.descripcion_vacante"
              :disable="disabled"
            >
            </essential-editor>
            <div
              v-for="error of v$.descripcion_vacante.$errors"
              :key="error.$uid"
              class="text-negative text-uppercase"
            >
              <small>{{ error.$message }}</small>
            </div>
          </div>

          <!-- años de experiencia -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Años de Experiencia</label>
            <q-input
              v-model="solicitudPuestoEmpleo.anios_experiencia"
              placeholder="Obligatorio"
              type="number"
              :disable="disabled"
              :error="!!v$.anios_experiencia.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.anios_experiencia.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./SolicitudPuestoEmpleoPage.ts"></script>
