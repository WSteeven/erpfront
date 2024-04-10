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
          <div class="col-12">
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
          <!-- Empleados  -->
          <div class="col-12 col-md-12 q-mb-md" v-if="rol.empleados">
            <q-card>
              <q-card-section>
                <div style="font-size: 19px; font-weight: 500;">Empleados con el rol asignado</div>
                <q-scroll-area style="height: 200px">
                  <div class="row">
                    <q-item dense v-for="(empleado, index) in rol.empleados" :key="index">
                      <q-item-section avatar>
                        <q-icon
                          name="bi-check-circle-fill"
                          size="xs"
                          color="positive"
                        ></q-icon>
                      </q-item-section>
                      <q-item-section>{{ empleado.nombres }} {{ empleado.apellidos }}</q-item-section>
                    </q-item>
                  </div>
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./RolPage.ts"></script>
