<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-sm q-mb-md">
      <!-- Vendeedor -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Vendedor</label>
        <q-input
          v-model="ventas.vendedor_info"
          placeholder="Obligatorio"
          type="textarea"
          disable
          autogrow
          outlined
          dense
        >
        </q-input>
      </div>

      <!-- Orden -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">#Orden</label>
        <q-input
          v-model="ventas.orden_id"
          placeholder="Obligatorio"
          type="textarea"
          disable
          autogrow
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Orden Interna -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Orden Interna</label>
        <q-input
          v-model="ventas.orden_interna"
          placeholder="Obligatorio"
          type="textarea"
          disable
          autogrow
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Forma de Pago -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Forma de Pago</label>
        <q-input
          v-model="ventas.forma_pago"
          placeholder="Obligatorio"
          type="textarea"
          disable
          autogrow
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Producto -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Producto</label>
        <q-input
          v-model="ventas.producto_info"
          placeholder="Obligatorio"
          type="textarea"
          disable
          autogrow
          outlined
          dense
        >
        </q-input>
      </div>
      <!--Plan -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Plan</label>
        <q-input
          v-model="ventas.plan"
          placeholder="Opcional"
          type="textarea"
          disable
          autogrow
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Precio -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Precio</label>
        <q-input
          v-model="precio_producto"
          placeholder="Opcional"
          type="textarea"
          disable
          autogrow
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Estado Activacion -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Estado Activacion</label>
        <q-input
          v-model="ventas.estado_activacion"
          placeholder="Obligatorio"
          type="textarea"
          disable
          autogrow
          outlined
          dense
        >
        </q-input>
      </div>
      <!-- Fecha -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Fecha de Activacion</label>
        <q-input
          v-model="ventas.fecha_activacion"
          placeholder="Opcional"
          disable
          readonly
          outlined
          dense
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="ventas.fecha_activacion" :mask="maskFecha" today-btn disable>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Cerrar" color="primary" flat disable />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <!-- Comision -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Comision</label>
        <q-input
          v-model="comision_vendedor"
          placeholder="Opcional"
          type="textarea"
          disable
          autogrow
          outlined
          dense
        >
        </q-input>
      </div>
    </div>
  </div>
</template>

<script src="./DetalleCompletoVentas.ts"></script>
