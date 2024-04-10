<template>
  <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" :mostrarListado="false"
    :mostrarButtonSubmits="false">
    <template #formulario>

      <q-form @submit.prevent>
        <div class="row q-col-gutter-sm q-mb-md">
          <!-- Usuarios Reciben -->
          <div class="col-12 col-md-3 q-mb-md" v-if="!transferencia.es_devolucion">
            <label class="q-mb-sm block">Destinatario:</label>
            <q-input v-model="transferencia.usuario_recibe_info" placeholder="Obligatorio" disable
              outlined dense>
            </q-input>
          </div>
          <!-- Monto  -->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Monto:</label>
            <q-input v-model="transferencia.monto" placeholder="Obligatorio" disable
              outlined dense>
            </q-input>
          </div>
          <!-- cuenta bancarea-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Cuenta:</label>
            <q-input v-model="transferencia.cuenta" placeholder="Obligatorio" disable
              outlined dense>
              <template v-slot:error>
                <div v-for="error of v$.cuenta.$errors" :key="error.$uid">
                  <div class="error-msg">{{ error.$message }}</div>
                </div>
              </template>
            </q-input>
          </div>
          <!-- Tareas -->
          <div class="col-12 col-md-3"  v-if="!transferencia.es_devolucion">
            <label class="q-mb-sm block">Tareas</label>
            <q-input v-model="transferencia.tarea_info" placeholder="Obligatorio" disable
              outlined dense>
            </q-input>
          </div>
          <!--Comprobante-->
          <div class="col-12 col-md-3">
            <label class="q-mb-sm block">Comprobante </label>
            <selector-imagen :imagen="transferencia.comprobante"
              @update:modelValue="(data) => (transferencia.comprobante = data)">
            </selector-imagen>
          </div>
          <!--Es devolucion-->
          <div class="col-12 col-md-3 q-mb-xl">
          <q-checkbox class="q-mt-lg q-pt-md" v-model="transferencia.es_devolucion" label="¿Es devolucion?" disable
            outlined dense></q-checkbox>
        </div>
        </div>

      </q-form>
      <div class="q-pa-md q-gutter-sm flex flex-center" v-if="usuario.id == transferencia.usuario_recibe && transferencia.estado_info=='POR APROBAR'">
        <q-btn color="positive" @click="aprobar_transferencia(transferencia, 'aprobar')">
          <q-icon name="bi-check-circle" size="xs"></q-icon>Aceptar</q-btn>
        <q-btn color="negative" @click="aprobar_transferencia(transferencia, 'rechazar')">
          <q-icon name="bi-x-circle" size="xs"></q-icon>Rechazar</q-btn>
      </div>
      <div class="q-pa-md q-gutter-sm flex flex-center" v-if="usuario.id == transferencia.usuario_recibe && transferencia.estado_info=='APROBADO'">
        <q-btn color="negative" @click="aprobar_transferencia(transferencia, 'anular')">
          <q-icon name="bi-x-circle" size="xs"></q-icon>Anular</q-btn>
      </div>
    </template>
  </tab-layout>
</template>
<script src="./VisualizarTransferenciaPage.ts"></script>
