<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    :mostrarListado="false"
    :mostrarButtonSubmits="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Lugar -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Lugar</label>
            <q-input
              v-model="gasto.lugar_info"
              placeholder=""
              type="textarea"
              autogrow
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input
              v-model="gasto.fecha_viat"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="gasto.fecha_viat" :mask="maskFecha" today-btn>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>

          <!-- Proyectos -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Proyectos</label>
            <q-input
              v-model="gasto.proyecto_info"
              placeholder=""
              type="textarea"
              autogrow
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Tareas -->
          <div class="col-12 col-md-3" v-if="gasto.proyecto >= 0">
            <label class="q-mb-sm block">Tareas</label>
            <q-input
              v-model="gasto.tarea_info"
              placeholder=""
              disable
              type="textarea"
              autogrow
              outlined
              dense
            >
            </q-input>
          </div>
          <!--SubTareas-->
          <div class="col-12 col-md-3" v-if="gasto.proyecto >= 0">
            <label class="q-mb-sm block">Sub Tareas</label>
            <q-input
              v-model="gasto.subTarea_info"
              placeholder=""
              type="textarea"
              autogrow
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!--Tiene Factura-->
          <div class="col-12 col-md-3 q-mb-xl">
            <q-checkbox
              class="q-mt-lg q-pt-md"
              v-model="esFactura"
              label="¿Tiene Factura?"
              disable
              @update:model-value="existeComprobante()"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Factura -->
          <div class="col-12 col-md-3" v-if="esFactura">
            <label class="q-mb-sm block">#Factura</label>
            <q-input
              v-model="gasto.factura"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Numero de Comprobante -->
          <div class="col-12 col-md-3" v-if="esFactura == false">
            <label class="q-mb-sm block">Numero de Comprobante</label>
            <q-input
              v-model="gasto.num_comprobante"
              placeholder="Opcional"
              type="number"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- RUC -->
          <div class="col-12 col-md-3" v-if="esFactura">
            <label class="q-mb-sm block">RUC</label>
            <q-input
              v-model="gasto.ruc"
              placeholder="Obligatorio"
              type="number"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Cantidad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cantidad</label>
            <q-input
              v-model="gasto.cantidad"
              placeholder="Obligatorio"
              type="number"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Valor Unitario -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Valor Unitario</label>
            <q-input
              v-model="gasto.valor_u"
              placeholder="Obligatorio"
              type="number"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Total -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Total</label>
            <q-input
              v-model="gasto.total"
              placeholder="Obligatorio"
              type="number"
              disable
              outlined
              dense
            >
            </q-input>
          </div>

          <!-- Autorizacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Autorizaciòn Especial</label>
            <q-input
              v-model="gasto.aut_especial_user"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Detalle -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Detalle</label>
            <q-input
              v-model="gasto.detalle_info"
              placeholder="Obligatorio"
              type="textarea"
              autogrow
              disable
              outlined
              dense
            ></q-input>
          </div>
          <!-- Subdetalle-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Subdetalle</label>
            <q-input
              v-model="gasto.sub_detalle_info"
              placeholder="Obligatorio"
              type="textarea"
              autogrow
              disable
              outlined
              dense
            ></q-input>
          </div>
          <!-- Placa -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Placa</label>
            <q-input
              v-model="gasto.placa"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Kilometraje -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Kilometraje</label>
            <q-input
              v-model="gasto.kilometraje"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Observacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Observación</label>
            <q-input
              v-model="gasto.observacion"
              placeholder="Opcional"
              type="textarea"
              disable
              autogrow
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Estado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <q-input v-model="gasto.estado_info" placeholder="" disable outlined dense>
            </q-input>
          </div>
          <!-- Empleado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Empleado</label>
            <q-input
              v-model="gasto.empleado_info"
              placeholder="Obligatorio"
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!--SubTareas-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Beneficiarios</label>
            <q-input
              v-model="gasto.beneficiarios_info"
              placeholder=""
              type="textarea"
              autogrow
              disable
              outlined
              dense
            >
            </q-input>
          </div>
          <!-- Comprobante 1 Archivo -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Comprobante 1</label>
            <imagen-comprimida-component
              :imagen="gasto.comprobante1"
              :texto1="'R.U.C.: ' + gasto.ruc"
              :texto2="'Factura: ' + gasto.factura"
              :texto3="
                'Comprobante: ' + gasto.num_comprobante != null
                  ? gasto.num_comprobante
                  : ''
              "
              :texto4="'Empleado: ' + gasto.empleado_info"
              @update:modelValue="(data) => (gasto.comprobante1 = data)"
            >
            </imagen-comprimida-component>
          </div>

          <!-- Comprobante 2 Archivo -->
          <div class="col-6 col-md-3">
            <label class="q-mb-sm block">Comprobante 2</label>
            <imagen-comprimida-component
              :imagen="gasto.comprobante2"
              :texto1="'R.U.C.: ' + gasto.ruc"
              :texto2="'Factura: ' + gasto.factura"
              :texto3="
                'Comprobante: ' + gasto.num_comprobante != null
                  ? gasto.num_comprobante
                  : ''
              "
              :texto4="'Empleado: ' + gasto.empleado_info"
              @update:modelValue="(data) => (gasto.comprobante2 = data)"
            >
            </imagen-comprimida-component>
          </div>
        </div>
      </q-form>
      <div
        class="q-pa-md q-gutter-sm flex flex-center"
        v-if="usuario.id == gasto.aut_especial && gasto.estado_info == 'POR APROBAR'"
      >
        <q-btn color="positive" @click="aprobar_gasto(gasto, 'aprobar')" v-if="issubmit">
          <q-icon name="bi-check-circle" size="xs"></q-icon>Aprobar</q-btn
        >
        <q-btn color="negative" @click="aprobar_gasto(gasto, 'rechazar')" v-if="issubmit">
          <q-icon name="bi-x-circle" size="xs"></q-icon>Rechazar</q-btn
        >
      </div>
      <div
        class="q-pa-md q-gutter-sm flex flex-center"
        v-if="
          usuario.id == gasto.aut_especial &&
          gasto.estado_info == 'APROBADO' &&
          estaSemanAC == true &&
          issubmit == true
        "
      >
        <q-btn color="negative" @click="aprobar_gasto(gasto, 'anular')">
          <q-icon name="bi-x-circle" size="xs"></q-icon>Anular</q-btn
        >
      </div>
    </template>
  </tab-layout>
</template>
<script src="./VisualizarGastoPage.ts"></script>
