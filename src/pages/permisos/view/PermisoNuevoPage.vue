<template>
  <q-form @submit.prevent>
    <div class="row q-col-gutter-sm q-mb-md">
      <!-- Nombre -->
      <div class="col-12 col-md-3 q-mb-md">
        <label class="q-mb-sm block">Nombre</label>
        <q-input v-model="permiso.name" placeholder="Obligatorio" :error="!!v$.name.$errors.length" :disable="disabled"
          outlined dense type="text">
          <template v-slot:error>
            <div v-for="error of v$.name.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>
      <!-- Roles-->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Roles</label>
        <q-select v-model="permiso.roles" :options="roles" transition-show="jump-up" transition-hide="jump-down"
          :disable="disabled" options-dense multiple dense use-chips outlined @blur="v$.roles.$touch"
          :error="!!v$.roles.$errors.length" error-message="Debes seleccionar uno o varios roles"
          :option-value="(v) => v.id" :option-label="(v) => v.name" emit-value map-options>
          <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
            <q-item v-bind="itemProps">
              <q-item-section>
                {{ opt.name }}
                <q-item-label v-bind:inner-h-t-m-l="opt.name" />
              </q-item-section>
              <q-item-section side>
                <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
              </q-item-section>
            </q-item>
          </template>
          <template v-slot:error>
            <div v-for="error of v$.roles.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>
    </div>
    <button-submits accion="NUEVO" :permitirCancelar="false" @guardar="crear(entidad)" />
  </q-form>
</template>
<script src="./PermisoNuevoPage.ts"></script>
