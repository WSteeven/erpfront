<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas">
    <template #formulario>
      <q-form @submit.prevent>
        <b>Información general</b>
        <div class="row q-col-gutter-sm q-py-md">
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Código</label>
            <q-input v-model="activo.codigo" disable outlined dense> </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Descripción</label>
            <q-input
              v-model="activo.detalle_producto.descripcion"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Tipo</label>
            <q-input
              v-model="activo.detalle_producto.tipo"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Marca</label>
            <q-input
              v-model="activo.detalle_producto.nombre_marca"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Modelo</label>
            <q-input
              v-model="activo.detalle_producto.nombre_modelo"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Serie</label>
            <q-input
              v-model="activo.detalle_producto.serial"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Calibre</label>
            <q-input
              v-model="activo.detalle_producto.calibre"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Unidad de medida</label>
            <q-input
              v-model="activo.detalle_producto.unidad_medida"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha de caducidad del producto</label>
            <q-input
              v-model="activo.detalle_producto.fecha_caducidad"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Salidas (Egresos)</label>
            <q-input v-model="sumaCantidadesEntregadas" disable outlined dense>
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

          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fotografía detallada</label>
            <selector-imagen
              file_extensiones=".jpg, image/*"
              :imagen="activo.fotografia_detallada"
              disable
              :alto="'200px'"
              @update:model-value="
                (data) => (activo.fotografia_detallada = data)
              "
            ></selector-imagen>
          </div>
        </div>

        <b v-if="activo.permiso_arma?.id"
          >Detalles del permiso</b
        >
        <formulario-permiso-arma
          v-if="activo.permiso_arma?.id"
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
            :name="opcionesConsultasActivosFijos.ENTREGAS"
            :label="opcionesConsultasActivosFijos.ENTREGAS"
            :class="{
              'tab-inactive':
                tabsOpcionesConsultas !==
                opcionesConsultasActivosFijos.ENTREGAS,
            }"
            no-caps
            @click="listarEntregas(filtros)"
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
            @click="listarAsignacionesProductos({ ...filtros, resumen: 1 })"
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
          <q-tab-panel :name="opcionesConsultasActivosFijos.ENTREGAS">
            <essential-table
              titulo="Egresos del activo seleccionado"
              :configuracionColumnas="[
                ...configuracionColumnasEntregasActivosFijos,
                accionesTabla,
              ]"
              :datos="entregas"
              :permitirConsultar="false"
              :permitirEditar="false"
              :permitirEliminar="false"
              :permitirFiltrar="false"
              :mostrarExportar="true"
              :ajustarCeldas="true"
              :accion1="btnSubirActaEntregaRecepcion"
              :accion2="btnSubirJustificativoUso"
            ></essential-table>
          </q-tab-panel>

          <q-tab-panel :name="opcionesConsultasActivosFijos.STOCK_RESPONSABLES">
            <essential-table
              titulo="Stock de los responsables"
              :configuracionColumnas="configuracionColumnasStockResponsables"
              :datos="asignacionesProductos"
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
