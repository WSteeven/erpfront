<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnasTiposTrabajos"
    titulo-pagina="Tipos de trabajos"
    :permitir-eliminar="false"
    :permitir-editar="true"
    :permitir-consultar="true"
    :initial-search="searchTable"
    :tab-options="tabOptions"
    :tab-defecto="currentTab"
    :filtrar="filtrarTiposTrabajos"
        :mostrarButtonSubmits="false"

  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Cliente -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Cliente corporativo</label>
            <q-select
              v-model="tipoTrabajo.cliente"
              :options="clientes"
              @filter="filtrarClientes"
              transition-show="scale"
              transition-hide="scale"
              :disable="disabled"
              options-dense
              dense
              outlined
              :option-label="item => item.razon_social"
              :option-value="item => item.id"
              use-input
              input-debounce="0"
              emit-value
              map-options
              :error="!!v$.cliente.$errors.length"
            >
              <template v-slot:no-option>
                <no-option-component />
              </template>

              <template v-slot:error>
                <error-component clave="cliente" :v$="v$" />
              </template>
            </q-select>
          </div>

          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre del trabajo</label>
            <q-input
              v-model="tipoTrabajo.descripcion"
              placeholder="Obligatorio"
              @update:model-value="
                v => (tipoTrabajo.descripcion = v.toUpperCase())
              "
              :disable="disabled"
              autofocus
              outlined
              dense
              :error="!!v$.descripcion.$errors.length"
            >
              <template v-slot:error>
                <error-component clave="descripcion" :v$="v$" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Plantilla</label>
            <file-component
              v-model="tipoTrabajo.url_plantilla"
              clave="url_plantilla"
              :v$="v$"
              :disable="disabled"
              :accion="accion"
            />
          </div>
          <div class="col-12 col-md-3">
            <br />
            <q-toggle
              v-model="tipoTrabajo.activo"
              checked-icon="check"
              :disable="disabled"
              label="Activo"
              color="positive"
            />
        </div>
    </div>
        <div class="col-12">
            <div class="row justify-end q-col-gutter-x-xs">
              <button-submits
                :accion="accion"
                :permitirGuardar="true"
                :disabled="cargando.estaCargando.value"
                @cancelar="reestablecer()"
                @editar="
                  guardar(
                    tipoTrabajo,
                    false,
                    {},
                    {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    }
                  )
                "
                @eliminar="eliminar(tipoTrabajo)"
                @guardar="
                  guardar(
                    tipoTrabajo,
                    true,
                    {},
                    {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    }
                  )
                "
              />
            </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./TipoTrabajoPage.ts"></script>
