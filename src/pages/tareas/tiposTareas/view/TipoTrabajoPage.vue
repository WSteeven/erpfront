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
            <label class="q-mb-sm block">Cliente</label>
            <q-select
              v-model="tipoTarea.cliente"
              :options="clientes"
              @filter="filtrarClientes"
              transition-show="scale"
              transition-hide="scale"
              options-dense
              dense
              outlined
              :option-label="(item) => item.razon_social"
              :option-value="(item) => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
            >
              <!-- @update:model-value="obtenerResponsable(subtarea.grupo)" -->
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <!--<q-input
              v-model="criterioBusquedaCliente"
              placeholder="Obligatorio"
              @update:model-value="
                (v) => (criterioBusquedaCliente = v.toUpperCase())
              "
              :readonly="disabled"
              hint="Presiona Enter para seleccionar un cliente"
              @keydown.enter="listarClientes()"
              @blur="criterioBusquedaCliente === '' ? limpiarCliente() : null"
              autofocus
              outlined
              dense
              :error="!!v$.cliente.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.cliente.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input> -->
          </div>

          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="tipoTarea.nombre"
              placeholder="Obligatorio"
              @update:model-value="(v) => (tipoTarea.nombre = v.toUpperCase())"
              :disable="disabled"
              outlined
              dense
              :error="!!v$.nombre.$errors.length"
            >
              <template v-slot:error>
                <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
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
          </div>
        </div>

        <div v-if="tipoTarea.requiere_imagenes" class="q-mb-md">
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
        </div>
        <!--<div class="row q-col-gutter-sm">
          <div class="col-12 q-mb-md">Plantilla</div>
          <div class="col-12 col-md-4 q-mb-md">
            <q-card class="cursor-pointer" bordered>
              <q-item tag="label" v-ripple class="q-pa-md">
                <q-item-section avatar>
                  <q-radio
                    v-model="tipoTarea.plantilla"
                    val="montaje"
                    color="positive"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-center q-mb-md text-bold"
                    >Montajes / Tendidos</q-item-label
                  >
                  <q-btn
                    color="primary"
                    dense
                    no-caps
                    rounded
                    @click="previsualizar('MONTAJE')"
                    >Previsualizar</q-btn
                  >
                </q-item-section>
              </q-item>
            </q-card>
          </div>

          <div class="col-12 col-md-4 q-mb-md">
            <q-card class="cursor-pointer" bordered>
              <q-item tag="label" class="q-pa-md">
                <q-item-section avatar>
                  <q-radio
                    v-model="tipoTarea.plantilla"
                    val="desmontaje"
                    color="positive"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-center q-mb-md text-bold"
                    >Desmontajes</q-item-label
                  >
                  <q-btn
                    color="primary"
                    dense
                    no-caps
                    rounded
                    @click="previsualizar('DESMONTAJE')"
                    >Previsualizar</q-btn
                  >
                </q-item-section>
              </q-item>
            </q-card>
          </div>

          <div class="col-12 col-md-4 q-mb-md">
            <q-card class="cursor-pointer" bordered>
              <q-item tag="label" class="q-pa-md">
                <q-item-section avatar>
                  <q-radio
                    v-model="tipoTarea.plantilla"
                    val="hincado"
                    color="positive"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-center q-mb-md text-bold"
                    >Hincados</q-item-label
                  >
                  <q-btn
                    color="primary"
                    dense
                    no-caps
                    rounded
                    @click="previsualizar('HINCADO')"
                    >Previsualizar</q-btn
                  >
                </q-item-section>
              </q-item>
            </q-card>
          </div>

          <div class="col-12 col-md-4 q-mb-md">
            <q-card class="cursor-pointer" bordered>
              <q-item tag="label" class="q-pa-md">
                <q-item-section avatar>
                  <q-radio
                    v-model="tipoTarea.plantilla"
                    val="recorrido"
                    color="positive"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-center q-mb-md text-bold"
                    >Recorridos</q-item-label
                  >
                  <q-btn
                    color="primary"
                    dense
                    no-caps
                    rounded
                    @click="previsualizar('RECORRIDO')"
                    >Previsualizar</q-btn
                  >
                </q-item-section>
              </q-item>
            </q-card>
          </div>

          <div class="col-12 col-md-4 q-mb-md">
            <q-card class="cursor-pointer" bordered>
              <q-item tag="label" class="q-pa-md">
                <q-item-section avatar>
                  <q-radio
                    v-model="tipoTarea.plantilla"
                    val="otro"
                    color="positive"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-center q-mb-md text-bold"
                    >Otros</q-item-label
                  >
                  <q-btn
                    color="primary"
                    dense
                    no-caps
                    rounded
                    @click="previsualizar('OTRO')"
                    >Previsualizar</q-btn
                  >
                </q-item-section>
              </q-item>
            </q-card>
          </div>
        </div> -->
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./TipoTrabajoPage.ts"></script>
