<template>
  <tab-layout
    :mixin="mixin"
    :configuracion-columnas="configuracionColumnasZona"
    paginate
    full
  >
    <template #formulario>
      <div class="row q-col-gutter-sm q-mb-md">
        <div class="col-12 text-bold q-py-sm q-mb-md">
          <q-icon name="bi-x-diamond" class="q-mr-sm" color="primary"></q-icon>
          Información general
          <!-- <q-separator class="q-my-xs"></q-separator> -->
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Nombre de la zona</label>
          <q-input
            v-model="zona.nombre"
            placeholder="Obligatorio"
            :disable="disabled"
            :error="!!v$.nombre.$errors.length"
            @blur="v$.nombre.$touch"
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

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Descripción</label>
          <q-input
            v-model="zona.descripcion"
            placeholder="Obligatorio"
            :disable="disabled"
            :error="!!v$.descripcion.$errors.length"
            @blur="v$.descripcion.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.descripcion.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <label class="q-mb-sm block">Dirección</label>
          <q-input
            v-model="zona.direccion"
            placeholder="Obligatorio"
            :disable="disabled"
            :error="!!v$.direccion.$errors.length"
            @blur="v$.direccion.$touch"
            outlined
            dense
          >
            <template v-slot:error>
              <div v-for="error of v$.direccion.$errors" :key="error.$uid">
                <div class="error-msg">{{ error.$message }}</div>
              </div>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-3">
          <coordenadas-input
            v-model="zona.coordenadas"
            :disable="disabled"
            :validador="v$"
            placeholder="Opcional"
          />
        </div>

        <div class="col-12 col-md-3 q-mb-lg">
          <q-toggle
            v-model="zona.activo"
            label="Activo"
            :disable="disabled"
            checked-icon="bi-check-fill"
            color="positive"
            outlined
            dense
          ></q-toggle>
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mb-md">
        <div class="col-12 text-bold q-py-sm q-mb-md">
          <q-icon name="bi-x-diamond" class="q-mr-sm" color="primary"></q-icon>
          Empleados asignados a la zona
          <!-- <q-separator class="q-my-xs"></q-separator> -->
        </div>

        <div class="col-12">
          <label class="q-mb-sm block">Agregar empleados a la zona</label>
          <q-input
            v-model="criterioBusqueda"
            placeholder="Escriba y presione enter para buscar y agregar"
            hint="Puede buscar por nombre, apellido o identificación"
            :disable="disabled"
            @keydown.enter="listar"
            clearable
            outlined
            dense
          >
            <template #after>
              <q-btn
                color="primary"
                label="Buscar y agregar"
                :icon="iconos.buscar"
                @click="listar"
                :disable="disabled"
                no-caps
                unelevated
              />
            </template>
          </q-input>
        </div>

        <div class="col-12 q-mb-md">
          <essential-table
            titulo="Empleados asignados"
            :configuracionColumnas="ccEmpleadoDesignado"
            :datos="zona.empleados_asignados"
            ajustar-celdas
            :alto-fijo="false"
            :permitir-consultar="false"
            :permitir-editar="false"
            :permitir-buscar="false"
            @eliminar="btnEliminarEmpleadoDesignado"
          ></essential-table>
        </div>
      </div>

      <!-- <div class="row q-col-gutter-sm q-mb-md bg-desenfoque rounded-card q-pr-sm">
        <div class="col-12 text-bold q-py-sm q-mb-md">
          <q-icon name="bi-x-diamond" class="q-mr-sm" color="primary"></q-icon>
          Prendas asignadas a la zona
        </div>

        <div class="col-12">
          <label class="q-mb-sm block">Agregar empleados a la zona</label>
          <q-input
            v-model="criterioBusqueda"
            placeholder="Escriba y presione enter para buscar y agregar"
            hint="Puede buscar por nombre, apellido o identificación"
            :disable="disabled"
            @keydown.enter="listar"
            clearable
            outlined
            dense
          >
            <template #after>
              <q-btn
                color="primary"
                label="Buscar y agregar"
                :icon="iconos.buscar"
                @click="listar"
                no-caps
                unelevated
              />
            </template>
          </q-input>
        </div>

        <div class="col-12">
          <essential-table
            titulo="Empleados asignados"
            :configuracionColumnas="ccEmpleadoDesignado"
            :datos="zona.empleados_asignados"
            ajustar-celdas
            :alto-fijo="false"
            :permitir-consultar="false"
            :permitir-editar="false"
            :permitir-buscar="false"
            @eliminar="btnEliminarEmpleadoDesignado"
          ></essential-table>
        </div>
      </div> -->
    </template>

    <template #modales>
      <essential-selectable-table
        ref="refListadoSeleccionable"
        :configuracion-columnas="configuracionColumnasEmpleadosLite"
        :datos="listado"
        @selected="seleccionar"
        tipo-seleccion="single"
      ></essential-selectable-table>
    </template>
  </tab-layout>
</template>

<script src="./ZonaPage.ts"></script>
