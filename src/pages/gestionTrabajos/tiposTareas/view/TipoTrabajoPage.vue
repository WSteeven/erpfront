<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasTiposTareas"
    titulo-pagina="Tipo de tareas"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Cliente -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cliente corporativo</label>
            <q-select
              v-model="tipoTarea.cliente"
              :options="clientes"
              @filter="filtrarClientes"
              transition-show="scale"
              transition-hide="scale"
              :disable="disabled"
              options-dense
              dense
              outlined
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :error="!!v$.cliente.$errors.length"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>

              <template v-slot:error>
                <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-select>
          </div>

          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre del trabajo</label>
            <q-input
              v-model="tipoTarea.descripcion"
              placeholder="Obligatorio"
              @update:model-value="
                (v) => (tipoTarea.descripcion = v.toUpperCase())
              "
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.descripcion.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.descripcion.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!--<div class="col-12 col-md-6">
            <br />
            <q-checkbox
              v-model="tipoTarea.requiere_imagenes"
              label="Requiere imágenes adicionales"
              outlined
              dense
            ></q-checkbox>
          </div>

          <div class="col-12 col-md-6">
            <br />
            <q-checkbox
              v-model="tipoTarea.requiere_campos_adicionales"
              label="Requiere información adicional"
              outlined
              dense
            ></q-checkbox>
          </div> -->
        </div>

        <!--<div v-if="tipoTarea.requiere_imagenes" class="q-mb-md">
          <essential-table
            titulo="Imágenes adicionales"
            :configuracionColumnas="configuracionColumnasImagenes"
            :datos="tipoTarea.imagenes_adicionales"
            :alto-fijo="false"
            :permitirConsultar="false"
            :permitirEditarModal="true"
            :mostrar-footer="false"
            separador="cell"
            :mostrar-botones="false"
            :accion1Header="agregarImagenAdicional"
            :accion1="botonHabilitarFormulario"
            :accion2="botonDeshabilitarFormulario"
            @eliminar="eliminarImagenAdicional"
            :entidad="ImagenesAdicionales"
          ></essential-table>
        </div>

        <div v-if="tipoTarea.requiere_campos_adicionales" class="q-mb-md">
          <essential-table
            titulo="Información adicional"
            :configuracionColumnas="configuracionColumnasCampos"
            :datos="tipoTarea.campos_adicionales"
            :alto-fijo="false"
            :permitirConsultar="false"
            :permitirEditarModal="true"
            :mostrar-footer="false"
            separador="cell"
            :mostrar-botones="false"
            :accion1Header="agregarCampoAdicional"
            :accion1="botonActivarCampo"
            :accion2="botonDesactivarCampo"
            @eliminar="eliminarCampoAdicional"
            :entidad="CamposAdicionales"
          ></essential-table>
        </div> -->
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./TipoTrabajoPage.ts"></script>
