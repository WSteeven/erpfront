<template>
  <q-card class="rounded-card custom-shadow">
    <div class="row">
      <div class="col-9">
        <div class="row q-col-gutter-sm q-pa-md ">
          <!--        Aqui va los campos-->
          <!-- Identificación -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Identificación</label>
            <q-input
              v-model="empleado.identificacion"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            ></q-input>
          </div>
          <!-- Nombres -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Nombres</label>
            <q-input
              v-model="empleado.nombres"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            />
          </div>
          <!-- Apellidos -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Apellidos</label>
            <q-input
              v-model="empleado.apellidos"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            />
          </div>
          <!-- Telefono -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Celular</label>
            <q-input
              type="tel"
              v-model="empleado.telefono"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
              <template v-slot:error>
                <div v-for="error of v$.telefono.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Canton -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Canton</label>
            <q-input v-model="empleado.canton" disable dense outlined />
          </div>

          <!-- Jefe -->
          <div class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Jefe inmediato</label>
            <q-input v-model="empleado.jefe" disable dense outlined />
          </div>

          <!--Cargo -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Cargo</label>
            <q-input v-model="empleado.cargo" disable dense outlined />
          </div>
          <!-- Grupo -->
          <div v-if="empleado.tiene_grupo" class="col-12 col-md-4 q-mb-md">
            <label class="q-mb-sm block">Grupo</label>
            <q-input v-model="empleado.grupo" disable dense outlined />
          </div>
          <!-- Telefono de la empresa -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Teléfono empresa</label>
            <q-input
              type="tel"
              mask="##########"
              v-model="empleado.telefono_empresa"
              placeholder="Opcional"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- fecha_ingreso -->
          <div class="col-12 col-md-4">
            <label class="q-mb-sm block">Fecha Ingreso</label>
            <q-input
              v-model="empleado.fecha_ingreso"
              disable
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer"/>
              </template>
            </q-input>
          </div>
        </div>
      </div>
      <div class="col-3 q-py-md q-pr-md">
        <!--        aqui va la imagen-->
        <!-- Foto de perfil -->
        <div class="col-12 col-md-3 q-mb-md" v-if="empleado.foto_url">
          <label for="q-mb-sm block">Foto de perfil</label>
          <selector-imagen
            :mostrar-campo="false"
            disable
            file_extensiones=".jpg, image/*"
            :imagen="empleado.foto_url"
            :alto="alto"
            @update:model-value="data => (empleado.foto_url = data)"
          ></selector-imagen>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script src="./EmpleadoInfoPage.ts" />
