<template>
  <q-form @submit.prevent>
    <div
      class="col-12 col-md-12 rounded-card q-py-sm text-center text-info bg-light-blue-1"
    >
      <q-icon name="bi-info-circle-fill" class="q-mr-sm" size="1em"></q-icon
      ><b>&nbsp; Información</b>
      <p class="q-mb-xs">
        Tipo de permiso normal: Crea un permiso ingresando el nombre de un
        módulo (mismo nombre que está en el controlador del backend), selecciona las acciones que puede realizar y los roles asociados
        al nuevo permiso.
      </p>
      <p class="q-mb-xs">
        Tipo de permiso personalizado: crea un permiso personalizado en el
        formato "puede.accion.permiso" y los roles asociados a dicho permiso
      </p>
    </div>
    <div class="row q-col-gutter-sm q-mb-md q-mt-md">
      <!-- Estado -->
      <div class="col-12 col-md-2">
        <label class="q-mb-sm block">Tipo de permiso</label>
        <q-toggle
          :label="permiso.permiso_personalizado ? 'PERSONALIZADO' : 'NORMAL'"
          v-model="permiso.permiso_personalizado"
          color="primary"
          keep-color
          icon="bi-check2-circle"
          unchecked-icon="clear"
          :disable="disabled"
        />
      </div>

      <!-- Nombre -->
      <div class="col-12 col-md-2 q-mb-md">
        <label class="q-mb-sm block">Nombre</label>
        <q-input
          hint="Escribe un nombre de un modulo"
          v-model="permiso.name"
          placeholder="Obligatorio"
          :error="!!v$.name.$errors.length"
          :disable="disabled"
          outlined
          dense
          type="text"
        >
          <template v-slot:error>
            <div v-for="error of v$.name.$errors" :key="error.$uid">
              <div class="error-msg">{{ error.$message }}</div>
            </div>
          </template>
        </q-input>
      </div>
      <!-- Checks de permisos -->
      <div v-if="!permiso.permiso_personalizado" class="col-12 col-md-5">
        <label class="block">Acciones</label>
        <div class="row q-pt-md">
          <!-- Ver boton -->
          <q-checkbox
            class=""
            v-model="permiso.boton"
            label="Boton"
            :disable="disabled "
            outlined
            dense
          ></q-checkbox>
          <!-- Autorizar permiso -->
          <q-checkbox
            class="q-ml-lg"
            v-model="permiso.autorizar"
            label="Autorizar"
            :disable="disabled "
            outlined
            dense
          ></q-checkbox>
          <!-- Acceder permiso -->
          <q-checkbox
            class="q-ml-lg"
            v-model="permiso.acceder"
            label="Acceder"
            :disable="disabled "
            outlined
            dense
          ></q-checkbox>
          <!-- Ver permiso -->
          <q-checkbox
            class="q-ml-lg"
            v-model="permiso.ver"
            label="Ver"
            :disable="disabled "
            outlined
            dense
          ></q-checkbox>
          <!-- Crear permiso -->
          <q-checkbox
            class="q-ml-lg"
            v-model="permiso.crear"
            label="Crear"
            :disable="disabled "
            outlined
            dense
          ></q-checkbox>
          <!-- Editar permiso -->
          <q-checkbox
            class="q-ml-lg"
            v-model="permiso.editar"
            label="Editar"
            :disable="disabled "
            outlined
            dense
          ></q-checkbox>
          <!-- Eliminar permiso -->
          <q-checkbox
            class="q-ml-lg"
            v-model="permiso.eliminar"
            label="Eliminar"
            :disable="disabled "
            outlined
            dense
          ></q-checkbox>
        </div>
      </div>
      <!-- End checks de permisos -->
      <!-- Roles-->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Roles</label>
        <q-select
          v-model="permiso.roles"
          :options="roles"
          transition-show="jump-up"
          transition-hide="jump-down"
          :disable="disabled"
          options-dense
          multiple
          dense
          use-chips
          outlined
          @filter="filtrarRoles"
          use-input
          input-debounce="0"
          :error="!!v$.roles.$errors.length"
          error-message="Debes seleccionar uno o varios roles"
          :option-value="(v) => v.id"
          :option-label="(v) => v.name"
          emit-value
          map-options
        >
          <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
            <q-item v-bind="itemProps">
              <q-item-section>
                {{ opt.name }}
                <q-item-label v-bind:inner-h-t-m-l="opt.name" />
              </q-item-section>
              <q-item-section side>
                <q-toggle
                  :model-value="selected"
                  @update:model-value="toggleOption(opt)"
                />
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
    <button-submits
      accion="NUEVO"
      :permitirCancelar="false"
      @guardar="crear()"
    />
  </q-form>
</template>
<script src="./PermisoNuevoPage.ts"></script>
