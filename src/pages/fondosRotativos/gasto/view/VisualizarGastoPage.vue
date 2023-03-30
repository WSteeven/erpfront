<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" :mostrarListado="true"
    :mostrarButtonSubmits="false">
    <template #formulario>
      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">

          <!-- Lugar -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Lugar</label>
            <q-input v-model="gasto.lugar_info" placeholder=""  type="textarea" autogrow disable outlined dense>
            </q-input>
          </div>

          <!-- Fecha -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Fecha</label>
            <q-input v-model="gasto.fecha_viat" placeholder="Obligatorio"
              disable  outlined dense>
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
            <q-input v-model="gasto.proyecto_info" placeholder=""  type="textarea" autogrow disable outlined dense>
            </q-input>
          </div>

          <!-- Tareas -->
          <div class="col-12 col-md-3" v-if="gasto.proyecto >= 0">
            <label class="q-mb-sm block">Tareas</label>
            <q-input v-model="gasto.tarea_info" placeholder="" disable   type="textarea" autogrow outlined dense>
            </q-input>
          </div>
          <!--SubTareas-->
          <div class="col-12 col-md-3" v-if="gasto.proyecto >= 0">
            <label class="q-mb-sm block">Sub Tareas</label>
            <q-input v-model="gasto.subTarea_info" placeholder=""  type="textarea" autogrow disable outlined dense>
            </q-input>
          </div>
          <!--Tiene Factura-->
          <div class="col-12 col-md-3 q-mb-xl">
            <q-checkbox class="q-mt-lg q-pt-md" v-model="esFactura" label="¿Tiene Factura?"
            disable
              @update:model-value="existeComprobante()" outlined dense></q-checkbox>
          </div>


          <!-- Factura -->
          <div class="col-12 col-md-3" v-if="esFactura">
            <label class="q-mb-sm block">#Factura</label>
            <q-input v-model="gasto.factura" placeholder="Obligatorio" mask="###-###-#########" fill-mask
              hint="###-###-#########" disable
              outlined dense>
            </q-input>
          </div>
          <!-- Numero de Comprobante -->
          <div class="col-12 col-md-3" v-if="esFactura == false">
            <label class="q-mb-sm block">Numero de Comprobante</label>
            <q-input v-model="gasto.num_comprobante" placeholder="Opcional" type="number" disable
               outlined dense>
            </q-input>
          </div>
          <!-- RUC -->
          <div class="col-12 col-md-3" v-if="esFactura">
            <label class="q-mb-sm block">RUC</label>
            <q-input v-model="gasto.ruc" placeholder="Obligatorio" type="number" disable
               outlined dense>
            </q-input>
          </div>
          <!-- Cantidad -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cantidad</label>
            <q-input v-model="gasto.cantidad" placeholder="Obligatorio" type="number" disable
               outlined dense>
            </q-input>
          </div>

          <!-- Valor Unitario -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Valor Unitario</label>
            <q-input v-model="gasto.valor_u" placeholder="Obligatorio" type="number" disable
              outlined dense>
            </q-input>
          </div>
          <!-- Total -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Total</label>
            <q-input v-model="gasto.total" placeholder="Obligatorio" type="number" disable
               outlined dense>
            </q-input>
          </div>

          <!-- Autorizacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Autorizaciòn Especial</label>
            <q-input v-model="gasto.aut_especial_user" placeholder="Obligatorio" disable
               outlined dense>
            </q-input>
          </div>
          <!-- Detalle -->
          <div class="col-12 col-md-3 q-mb-md">
            <label class="q-mb-sm block">Detalle</label>
            <q-input v-model="gasto.detalle_info" placeholder="Obligatorio"  type="textarea" autogrow  disable
               outlined dense></q-input>
          </div>
          <!-- Subdetalle-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Subdetalle</label>
            <q-input v-model="gasto.sub_detalle_info" placeholder="Obligatorio"  type="textarea" autogrow disable
               outlined dense></q-input>
          </div>

          <!-- Comprobante 1 Archivo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comprobante 1</label>
            <selector-imagen-modal :imagen="gasto.comprobante1"     @update:modelValue="(data) => (gasto.comprobante1 = data)">
            </selector-imagen-modal>
          </div>

          <!-- Comprobante 2 Archivo -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comprobante 2</label>
            <selector-imagen-modal :imagen="gasto.comprobante2"
              @update:modelValue="(data) => (gasto.comprobante2 = data)">
            </selector-imagen-modal>
          </div>

          <!-- Observacion -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Observación</label>
            <q-input v-model="gasto.observacion" placeholder="Opcional" type="textarea" disable
               autogrow outlined dense>
            </q-input>
          </div>
          <!-- Estado -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Estado</label>
            <q-input v-model="gasto.estado_info" placeholder="" disable outlined dense>
            </q-input>
          </div>
        </div>
      </q-form>
      <div class="q-pa-md q-gutter-sm flex flex-center" v-if="usuario.usuario_id == gasto.aut_especial && gasto.estado_info=='POR APROBAR'">
        <q-btn color="positive" @click="aprobar_gasto(gasto, 'aprobar')">
          <q-icon name="bi-check-circle" size="xs"></q-icon>Aprobar</q-btn>
        <q-btn color="negative" @click="aprobar_gasto(gasto, 'rechazar')">
          <q-icon name="bi-x-circle" size="xs"></q-icon>Rechazar</q-btn>
          <q-btn color="negative" @click="aprobar_gasto(gasto, 'anular')">
          <q-icon name="bi-x-circle" size="xs"></q-icon>Anular</q-btn>
      </div>
    </template>
  </tab-layout>
</template>
<script src="./VisualizarGastoPage.ts"></script>
