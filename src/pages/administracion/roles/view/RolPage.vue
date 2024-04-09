<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Motivos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Rol</label>
            <q-input
              v-model="rol.name"
              placeholder="Obligatorio"
              :readonly="disabled"
              :error="!!v$.name.$errors.length"
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.name.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>

          <!-- Listado de usuarios que tienen el rol -->
          <div
            v-if="
              (accion === acciones.consultar || accion === acciones.editar) &&
              rol.empleados
            "
            class="col-12 col-md-12 q-mt-xl"
          >
            <essential-table
              titulo="Empleados que tienen el rol actual"
              :configuracionColumnas="columnasEmpleados"
              :datos="rol.empleados"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :mostrarBotones="false"
              :ajustarCeldas="true"
              :altoFijo="false"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./RolPage.ts"></script>
