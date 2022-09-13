<template>
    <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Modelos">
      <template #formulario>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md">
            <!-- Marca -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Marca</label>
              <q-input v-model="criterioBusquedaMarca" placeholder="=Obligatorio"
                @update:model-value="(v)=>(criterioBusquedaMarca=v.toUpperCase())" :readonly="disabled"
                hint="Presiona Enter para seleccionar una marca" @keydown.enter="listarMarcas()"
                @blur="criterioBusquedaMarca ===''? limpiarMarca() : null" autofocus outlined dense
                :error="!!v$.marca.$errors-length">
                <template v-slot:error>
                  <div v-for="error of v$.marca.$errors" :key="error.$uid">
                    <div class="error-msg">{{error.$message}}</div>
                  </div>
                </template>
              </q-input>
            </div>
            <!-- Nombre -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Modelo</label>
              <q-input v-model="modelo.nombre" placeholder="=Obligatorio" :readonly="disabled"
                :error="!!v$.nombre.$errors-length"
                @update:model-value="(v)=>(modelo.nombre=v.toUpperCase())" outlined dense>
                <template v-slot:error>
                  <div v-for="error of v$.nombre.$errors" :key="error.$uid">
                    <div class="error-msg">{{error.$message}}</div>
                  </div>
                </template>
              </q-input>
            </div>
          </div>
        </q-form>
  
        <essential-selectable-table
          ref="refListadoSeleccionableMarcas"
          :configuracion-columnas="configuracionColumnasMarcas"
          :datos="listadoMarcas"
          @selected="seleccionarMarca"
          ></essential-selectable-table>
      </template>
    </tab-layout>
  </template>

  <script src="./ModeloPage.ts"></script>