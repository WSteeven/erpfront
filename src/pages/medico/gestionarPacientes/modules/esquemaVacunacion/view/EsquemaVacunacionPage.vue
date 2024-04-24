<template>
  <simple-layout :mixin="mixin">
    <template #formulario>
      <div class="bg-desenfoque rounded q-pa-md row q-mb-md q-col-gutter-x-sm">
        <div class="col-12 col-md-6 q-mb-md">
          <label class="q-mb-md block">Tipo de vacuna</label>
          <q-select
            v-model="esquema.tipo_vacuna"
            :options="tiposVacunas"
            @filter="filtrarTiposVacunas"
            @update:model-value="seleccionarTipoVacuna(esquema.tipo_vacuna)"
            transition-show="scale"
            transition-hide="scale"
            :disable="!habilitarTipoVacuna"
            options-dense
            dense
            outlined
            :option-label="(item) => item.nombre"
            :option-value="(item) => item.id"
            use-input
            input-debounce="0"
            emit-value
            map-options
          >
          </q-select>
        </div>

        <div class="col-12 col-md-6 q-mb-md">
          <label class="q-mb-sm block">Dosis administradas</label>
          <div class="q-gutter-sm">
            <q-radio
              v-for="dosis in totalDosis"
              :key="dosis"
              v-model="esquema.dosis_aplicadas"
              :val="dosis"
              :label="`Dosis ${dosis}`"
            />
          </div>
        </div>

        <div class="col-12 q-mb-md">
          <label class="q-mb-sm block">Observación</label>
          <q-input
            v-model="esquema.observacion"
            placeholder="Opcional"
            outlined
            dense
            autogrow
            type="textarea"
          >
          </q-input>
        </div>

        <!-- Manejo de archivos -->
        <div class="col-12 q-mb-md">
          <gestor-archivos
            ref="refArchivo"
            label="Adjuntar archivos"
            :mixin="mixin"
            :disable="disabled"
            :listarAlGuardar="false"
            :permitir-eliminar="
              accion == acciones.nuevo || accion == acciones.editar
            "
            :idModelo="idEsquema"
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
  </simple-layout>
</template>

<script src="./EsquemaVacunacionPage.ts"></script>
