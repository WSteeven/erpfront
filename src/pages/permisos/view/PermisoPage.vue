<template>
  <q-page padding class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h6">
          <label class="q-mb-sm block">Roles</label>
          <q-select v-model="rol"
          :options="roles"
          transition-show="jump-up"
          transition-hide="jump-down"
          options-dense
            dense outlined
            @update:model-value="obtenerPermisoRol(rol)"
            :disable="disabled" :readonly="disabled" error-message="Debes seleccionar un rol" use-input
            input-debounce="0"
             @filter="filtrarDetalles"
             :option-value="(v) => v.id"
             :option-label="(v) => v.name"
            emit-value map-options>
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No hay resultados
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="row q-col-gutter-sm q-mb-md q-mt-xs">
          <div class="col-12 col-md-5 q-gutter-y-sm">
            <q-card>
              <q-card-section>
                <div class="text-h6">No Asignados</div>
                <essential-table :configuracionColumnas="configuracionColumnasPermisos"
                  :datos="permisosSinAsignar"
                  :permitirConsultar="false"
                  :permitirEditar="false"
                  :permitirEliminar="false"
                  ref="refPermisosSinAsignar"
                  @selected = "asignarPermiso"
                  tipo-seleccion="multiple">
                </essential-table>
              </q-card-section>
            </q-card>
          </div>

        <col-12 class="col-md-2 column justify-center q-gutter-y-md">
          <q-btn class="full-width block" color="secondary" @click="crear_permiso()"><q-icon name="bi-plus"></q-icon></q-btn>
          <q-btn v-if="rol !== undefined" class="full-width block" color="primary" @click="botonAsignarPermisos()"><q-icon name="bi-arrow-right"></q-icon></q-btn>
          <q-btn v-if="rol !== undefined" class="full-width block" color="accent" @click="botonEliminarPermisos()"><q-icon name="bi-arrow-left"></q-icon></q-btn>
        </col-12>

          <div class="col-12 col-md-5 q-mb-md">
            <q-card>
              <q-card-section>
                <div class="text-h6">Asignados</div>
                <essential-table :configuracionColumnas="configuracionColumnasPermisos"
                  :datos="listado"
                  :permitirConsultar="false"
                  :permitirEditar="false"
                  :permitirEliminar="false"
                  ref="refPermisosAsignados"
                  @selected = "eliminarPermiso"
                  tipo-seleccion="multiple">
                </essential-table>
              </q-card-section>
            </q-card>
          </div>

        </div>
      </q-card-section>
    </q-card>
    <modal-entidad :comportamiento="modales"></modal-entidad>
  </q-page>
</template>

<script src="./PermisoPage.ts"></script>
