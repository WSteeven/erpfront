<template>
  <tab-layout-filter-tabs2
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Proveedores Internacionales"
    :tab-options="tabOptions"
    :filtrar="filtrarProveedores"
    puedeExportar
    ajustarCeldas
  >
    <template #formulario>
      <q-form @submit.prevent>
        <q-expansion-item
          class="overflow-hidden q-mb-md expansion"
          label="Información General"
          header-class="text-bold bg-header-collapse"
          default-opened
        >
          <div class="row q-col-gutter-sm q-pa-sm">
            <!-- Nombre del proveedor -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm-block">Razón Social</label>
              <q-input
                v-model="proveedor.nombre"
                placeholder="Obligatorio"
                :disable="disabled"
                dense
                outlined
              />
            </div>

            <!-- identificacion-->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">Identificacion/RUC</label>
              <q-input
                v-model="proveedor.ruc"
                placeholder="Opcional"
                :disable="disabled"
                outlined
                dense
              >
              </q-input>
            </div>

            <!--Pais -->
            <div class="col-12 col-md-3">
              <label class="q-mb-sm block">País</label>
              <q-select
                v-model="proveedor.pais"
                :options="paises"
                :disable="disabled"
                options-dense
                dense
                outlined
                use-input
                input-debounce="0"
                @filter="filtrarPaises"
                :option-value="v => v.id"
                :option-label="v => v.pais + ' (' + v.abreviatura + ')'"
                emit-value
                map-options
                ><template v-slot:option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>{{ scope.opt.pais }}</q-item-label>
                      <q-item-label caption>{{
                        scope.opt.abreviatura
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
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
        </q-expansion-item>
      </q-form>
    </template>
  </tab-layout-filter-tabs2>
</template>
<script src="./ProveedorInternacionalPage.ts" />
