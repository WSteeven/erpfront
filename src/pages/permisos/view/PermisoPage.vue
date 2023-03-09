<template>
  <q-page padding class="q-pa-lg">
    <q-card>
      <q-card-section>
        <div class="text-h6">
          <label class="q-mb-sm block">Roles</label>
          <q-select v-model="rol" :options="roles" transition-show="jump-up" transition-hide="jump-down" options-dense
            dense outlined :disable="disabled" :readonly="disabled" error-message="Debes seleccionar un rol" use-input
            input-debounce="0" @filter="filtrarDetalles" :option-value="(v) => v.id" :option-label="(v) => v.name"
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

          <div class="col-12 col-md-6 q-mb-md">
            <q-card>
              <q-card-section>
                <div class="text-h6">Asignados</div>
                <essential-table :configuracionColumnas="configuracionColumnasPermisos" :datos="listado"
                  :permitirConsultar="false" :permitirEditar="false" :permitirEliminar="false"></essential-table>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-md-6 q-gutter-y-sm">
            <q-card>
              <q-card-section>
                <div class="text-h6">No Asignados</div>

              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>

  </q-page>
</template>

<script src="./PermisoPage.ts"></script>
