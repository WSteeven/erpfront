<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Permisos"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- nombre -->
          <div class="col-12 ">
            <label class="q-mb-sm block">Nombre del Permiso</label>
            <q-input
              v-model="permiso.name"
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

          <!-- Roles -->
          <div class="col-12 col-md-6 q-mb-md" v-if="permiso.roles">
            <q-card>
              <q-card-section>
                <div class="text-h6">Roles que tienen el permiso</div>
                <q-scroll-area style="height: 100px">
                  <div class="row">
                    <q-item dense v-for="(rol, index) in permiso.roles" :key="index">
                      <q-item-section avatar>
                        <q-icon
                          name="bi-check-circle-fill"
                          size="xs"
                          color="positive"
                        ></q-icon>
                      </q-item-section>
                      <q-item-section>{{ rol }}</q-item-section>
                    </q-item>
                  </div>
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>

          <!-- Empleados  -->
          <div class="col-12 col-md-6 q-mb-md" v-if="permiso.empleados">
            <q-card>
              <q-card-section>
                <div style="font-size: 19px; font-weight: 500;">Empleados con el permiso asignado directamente</div>
                <q-scroll-area style="height: 100px">
                  <div class="row">
                    <q-item dense v-for="(empleado, index) in permiso.empleados" :key="index">
                      <q-item-section avatar>
                        <q-icon
                          name="bi-check-circle-fill"
                          size="xs"
                          color="positive"
                        ></q-icon>
                      </q-item-section>
                      <q-item-section>{{ empleado }}</q-item-section>
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
<!-- :error="v$.nombre.$errors"  -->

<script src="./PermisoPage.ts"></script>
