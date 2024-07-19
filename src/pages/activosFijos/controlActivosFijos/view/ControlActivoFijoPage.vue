<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-py-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Código</label>
            <q-input v-model="activo.codigo" disable outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Descripción</label>
            <q-input v-model="activo.descripcion" disable outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo</label>
            <q-input v-model="activo.tipo" disable outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Marca</label>
            <q-input v-model="activo.marca" disable outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Modelo</label>
            <q-input v-model="activo.modelo" disable outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Serie</label>
            <q-input v-model="activo.serie" disable outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Calibre</label>
            <q-input v-model="activo.calibre" disable outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Unidad de medida</label>
            <q-input v-model="activo.unidad_medida" disable outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de caducidad del producto</label>
            <q-input
              v-model="activo.fecha_caducidad_producto"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Entrada (Ingresos)</label>
            <q-input v-model="activo.total_ingresos" disable outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Salidas (Egresos)</label>
            <q-input v-model="activo.total_egresos" disable outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Diferencia (Ingresos-Egresos)</label>
            <q-input v-model="activo.total_egresos" disable outlined dense>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fotografía del artículo</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="activo.fotografia"
              disable
              :alto="'200px'"
              @update:model-value="(data) => (activo.fotografia = data)"
            ></selector-imagen>
          </div>
        </div>

        <formulario-permiso-arma
          v-if="activo.permiso_arma.id"
          :permiso="activo.permiso_arma"
          disable
        />

        <!-- Tabs -->
        <q-tabs
          v-model="tabsOpcionesConsultas"
          align="left"
          switch-indicator
          active-class="tab-active"
          indicator-color="transparent"
          dense
        >
          <q-tab
            :name="opcionesConsultasActivosFijos.EGRESOS"
            :label="opcionesConsultasActivosFijos.EGRESOS"
            :class="{
              'tab-inactive':
                tabsOpcionesConsultas !== opcionesConsultasActivosFijos.EGRESOS,
            }"
            no-caps
            @click="consultar()"
          />

          <q-tab
            :name="opcionesConsultasActivosFijos.INGRESOS"
            :label="opcionesConsultasActivosFijos.INGRESOS"
            :class="{
              'tab-inactive':
                tabsOpcionesConsultas !==
                opcionesConsultasActivosFijos.INGRESOS,
            }"
            no-caps
            @click="consultar()"
          />

          <q-tab
            :name="opcionesConsultasActivosFijos.STOCK_RESPONSABLES"
            :label="opcionesConsultasActivosFijos.STOCK_RESPONSABLES"
            :class="{
              'tab-inactive':
                tabsOpcionesConsultas !==
                opcionesConsultasActivosFijos.STOCK_RESPONSABLES,
            }"
            no-caps
          />

          <q-tab
            :name="opcionesConsultasActivosFijos.SEGUIMIENTO_CONSUMO"
            :label="opcionesConsultasActivosFijos.SEGUIMIENTO_CONSUMO"
            :class="{
              'tab-inactive':
                tabsOpcionesConsultas !==
                opcionesConsultasActivosFijos.SEGUIMIENTO_CONSUMO,
            }"
            no-caps
          />
        </q-tabs>

        <!-- Tab content -->
        <q-tab-panels
          v-model="tabsOpcionesConsultas"
          animated
          transition-prev="scale"
          transition-next="scale"
          class="bg-desenfoque border-white q-mb-md"
          keep-alive
          :class="{ 'rounded-tabpanel': !$q.screen.xs }"
        >
          <q-tab-panel :name="opcionesConsultasActivosFijos.EGRESOS">
            <essential-table
              titulo="Egresos del activo seleccionado"
              :configuracionColumnas="configuracionColumnasTransaccionEgreso"
              :datos="egresos"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :permitirFiltrar="false"
              :mostrarExportar="true"
              :ajustarCeldas="true"
            ></essential-table>
          </q-tab-panel>
        </q-tab-panels>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ControlActivoFijoPage.ts" />
