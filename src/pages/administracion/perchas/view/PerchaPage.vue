<template>
    <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Perchas">
      <template #formulario>
        <q-form @submit.prevent>
          <div class="row q-col-gutter-sm q-py-md">
            <!-- Sucursal -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Sucursal</label>
              <q-input v-model="criterioBusquedaSucursal" placeholder="Obligatorio"
                @update:model-value="(v)=>(criterioBusquedaSucursal=v.toUpperCase())" :readonly="disabled"
                hint="Presiona Enter para seleccionar una sucursal" @keydown.enter="listarSucursales()"
                @blur="criterioBusquedaSucursal ===''? limpiarSucursal() : null" autofocus outlined dense
                :error="!!v$.sucursal.$errors-length">
                <template v-slot:error>
                  <div v-for="error of v$.sucursal.$errors" :key="error.$uid">
                    <div class="error-msg">{{error.$message}}</div>
                  </div>
                </template>
              </q-input>
            </div>
            <!-- Nombre -->
            <div class="col-12 col-md-6">
              <label class="q-mb-sm block">Nombre</label>
              <q-input v-model="percha.nombre" placeholder="Obligatorio" :readonly="disabled"
                :error="!!v$.nombre.$errors-length"
                @update:model-value="(v)=>(percha.nombre=v.toUpperCase())" outlined dense>
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
          ref="refListadoSeleccionableSucursales"
          :configuracion-columnas="configuracionColumnasSucursales"
          :datos="listadoSucursales"
          @selected="seleccionarSucursal"
          ></essential-selectable-table>
      </template>
    </tab-layout>
</template>
  
  <script src="./PerchaPage.ts"></script>
  