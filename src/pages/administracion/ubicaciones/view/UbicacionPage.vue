<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Ubicaciones">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Percha -->
          <div class="col-12 col-md-6 q-mb-md">
            <!-- <label-abrir-modal label="Percha" @click="modalesModelo.abrirModalEntidad('MarcaPage')">
            </label-abrir-modal> -->
            <label class="q-mb-sm block">Percha</label>
            <q-select v-model="ubicacion.percha" :options="opciones.perchas"
              hint="Agregue elementos desde el panel de perchas" transition-show="flip-up" transition-hide="flip-down"
              options-dense dense outlined use-input input-debounce="0"
              @filter="filterPercha"
              :option-label="(item) => item.nombre +' | '+item.sucursal" 
              :option-value="(item) => item.id" emit-value
              map-options>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Piso -->
          <div class="col-12 col-md-6 q-mb-md">
            <!-- <label-abrir-modal label="Marca" @click="modalesModelo.abrirModalEntidad('MarcaPage')">
            </label-abrir-modal> -->
            <label class="q-mb-sm block">Piso</label>
            <q-select v-model="ubicacion.piso" :options="opciones.pisos"
              hint="Agregue elementos desde el panel de pisos" transition-show="flip-up" transition-hide="flip-down"
              options-dense dense outlined use-input input-debounce="0" 
              @filter="filterPiso"
              :option-label="(item) => item.columna ==null?item.fila :item.fila+'-'+item.columna"
              :option-value="(item) => item.id" emit-value map-options>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <!-- Codigo -->
          <!-- <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Codigo</label>
            <q-input v-model="ubicacion.codigo" placeholder="Obligatorio" :readonly="disabled"
              :error="!!v$.codigo.$errors-length" @update:model-value="(v)=>(ubicacion.codigo=v.toUpperCase())" outlined
              dense>
              <template v-slot:error>
                <div v-for="error of v$.codigo.$errors" :key="error.$uid">
                  <div class="error-msg">{{error.$message}}</div>
                </div>
              </template>
            </q-input>
          </div> -->
          <!-- !-- Percha --
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Percha</label>
              <q-input v-model="criterioBusquedaPercha" placeholder="Obligatorio"
                @update:model-value="(v)=>(criterioBusquedaPercha=v.toUpperCase())" :readonly="disabled"
                hint="Presiona Enter para seleccionar una percha" @keydown.enter="listarPerchas()"
                @blur="criterioBusquedaPercha ===''? limpiarPercha() : null" autofocus outlined dense
                :error="!!v$.percha.$errors-length">
                <template v-slot:error>
                  <div v-for="error of v$.percha.$errors" :key="error.$uid">
                    <div class="error-msg">{{error.$message}}</div>
                  </div>
                </template>
              </q-input>
            </div> -->
          <!-- Piso -->
          <!-- <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Piso</label>
              <q-input v-model="criterioBusquedaPiso" placeholder="Obligatorio"
                @update:model-value="(v)=>(criterioBusquedaPiso=v.toUpperCase())" :readonly="disabled"
                hint="Presiona Enter para seleccionar un piso" @keydown.enter="listarPisos()"
                @blur="criterioBusquedaPiso ===''? limpiarPiso() : null" autofocus outlined dense
                :error="!!v$.piso.$errors-length">
                <template v-slot:error>
                  <div v-for="error of v$.piso.$errors" :key="error.$uid">
                    <div class="error-msg">{{error.$message}}</div>
                  </div>
                </template>
              </q-input>
            </div> -->
        </div>
      </q-form>



      <!-- <essential-selectable-table ref="refListadoSeleccionablePisos"
        :configuracion-columnas="configuracionColumnasPisos" :datos="listadoPisos" @selected="seleccionarPisos">
      </essential-selectable-table> -->

      <!-- <essential-selectable-table
          ref="refListadoSeleccionablePerchas"
          :configuracion-columnas="configuracionColumnasPerchas"
          :datos="listadoPerchas"
          @selected="seleccionarPercha"
          ></essential-selectable-table> -->

    </template>
    <template>
      <modales-entidad :comportamiento="modalesUbicacion" />
    </template>
  </tab-layout>
</template>
  
<script src="./UbicacionPage.ts"></script>