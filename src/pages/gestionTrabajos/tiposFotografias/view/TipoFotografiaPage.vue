<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Tipos de Fotografías"
    :tab-options="tabOptions"
    :tabDefecto="tabDefecto"
    :filtrar="filtrarListadoTipoFotografias"
    :initial-search="searchTable"
    :puedeFiltrar="false"
    ajustarCeldas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-pa-sm">
          <!-- Tipo de Trabajo -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Tipo de Trabajo</label>
            <q-select
              v-model="tipoFotografia.tipo_trabajo"
              :options="tipos_trabajos"
              option-value="id"
              option-label="descripcion"
              emit-value
              map-options
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.tipo_trabajo.$errors.length"
              @filter="filtrarTiposTrabajos"
              use-input
              debounce="0"
              outlined
              dense
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                  <q-item-label>{{ scope.opt.descripcion }}</q-item-label>
                  <q-item-label caption>Cliente: {{ scope.opt.cliente }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <no-option-component />
              </template>
              <template v-slot:error>
                <error-component clave="tipo_trabajo" :v$="v$" />
              </template>
            </q-select>
          </div>

          <!-- Nombre -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Nombre</label>
            <q-input
              v-model="tipoFotografia.nombre"
              placeholder="Obligatorio"
              :disable="disabled"
              :error="!!v$.nombre.$errors.length"
              @blur="v$.nombre.$touch"
              outlined
              dense
            >
              <template v-slot:error>
                <error-component clave="nombre" :v$="v$" />
              </template>
            </q-input>
          </div>

          <!-- Estado -->
          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Estado</label>
            <q-toggle
              :label="tipoFotografia.activo ? 'ACTIVO' : 'INACTIVO'"
              v-model="tipoFotografia.activo"
              color="primary"
              keep-color
              icon="bi-check2-circle"
              unchecked-icon="clear"
              :disable="disabled"
            />
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>

<script src="./TipoFotografiaPage.ts"></script>
