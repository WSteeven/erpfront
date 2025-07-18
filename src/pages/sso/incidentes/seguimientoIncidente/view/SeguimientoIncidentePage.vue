<template>
  <multiple-page-layout :mixin="mixin" regresar-principio>
    <template #tab1>
      <simple-layout
        :mixin="mixin"
        :permitir-cancelar="false"
        forzar-editar
        label-editar="Actualizar el seguimiento del incidente seleccionado"
      >
        <template #formulario>
          <div class="row">
            <div
              v-if="incidente.tipo_incidente === tiposIncidentes.CAMBIO_EPP"
              class="col-12 q-mb-md"
            >
              <label class="block q-mb-sm">Gestión del pedido</label>
              <q-btn
                :color="colorPedido"
                :icon="iconoPedido"
                :label="labelPedido"
                @click="irPedido()"
                square
                unelevated
                no-caps
              ></q-btn>
            </div>

            <div
              v-if="incidente.tipo_incidente === tiposIncidentes.CAMBIO_EPP"
              class="col-12 q-mb-md"
            >
              <label class="block q-mb-sm">Gestión de la devolución</label>
              <q-btn
                :color="colorDevolucion"
                :icon="iconoDevolucion"
                :label="labelDevolucion"
                @click="irDevolucion()"
                square
                unelevated
                no-caps
              ></q-btn>
            </div>

            <div
              v-if="incidente.tipo_incidente === tiposIncidentes.CAMBIO_EPP"
              class="col-12 q-mb-xl"
            >
              <label class="block q-mb-sm"
                >Solicitud de descuento de EPPs</label
              >
              <q-btn
                :color="colorSolicitudDescuento"
                :icon="iconoSolicitudDescuento"
                :label="labelSolicitudDescuento"
                @click="irSolicitudDescuento()"
                square
                unelevated
                no-caps
              ></q-btn>
            </div>

            <!-- Causa raiz -->
            <div class="col-12 q-mb-md">
              <div class="row justify-between">
                <label class="q-mb-sm block">Causa raiz</label>
                <b class="text-italic">*No enviar imágenes demasiado grandes</b>
              </div>
              <essential-editor
                v-model="seguimiento.causa_raiz"
                :disable="disable"
              >
              </essential-editor>
            </div>

            <!-- Acciones correctivas -->
            <div class="col-12">
              <div class="row justify-between">
                <label class="q-mb-sm block">Acciones correctivas</label>
                <b class="text-italic">*No enviar imágenes demasiado grandes</b>
              </div>
              <essential-editor
                v-model="seguimiento.acciones_correctivas"
                :disable="disable"
              >
              </essential-editor>
            </div>
          </div>
        </template>
      </simple-layout>
    </template>

    <template #tab2>
      <div class="q-my-lg text-grey-8 text-right">
        <q-icon name="bi-cash-stack" class="q-mr-sm"></q-icon>
        Solicitud de descuento
      </div>
      <solicitud-descuento-page
        ref="refSolicitudDescuento"
        @guardado="onGuardadoSolicitudDescuento"
      ></solicitud-descuento-page>
    </template>

    <template #tab3>
      <div class="q-my-lg text-grey-8 text-right">
        <q-icon name="bi-cart-fill" class="q-mr-sm"></q-icon>
        Pedido
      </div>
      <pedido-page ref="refPedido" @guardado="onGuardadoPedido"></pedido-page>
    </template>

    <template #tab4>
      <div class="q-my-lg text-grey-8 text-right">
        <q-icon name="bi-arrow-repeat" class="q-mr-sm"></q-icon>
        Devolución
      </div>
      <devolucion-page
        ref="refDevolucion"
        @guardado="onGuardadoDevolucion"
      ></devolucion-page>
    </template>
  </multiple-page-layout>
</template>

<script src="./SeguimientoIncidentePage.ts"></script>
