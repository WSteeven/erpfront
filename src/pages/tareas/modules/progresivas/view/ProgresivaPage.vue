<template>
  <tab-layout
    :configuracionColumnas="configuracionColumnasTiposTareas"
    :datos="datos"
  >
    <template #formulario>
      <q-form @submit.prevent="enviar()">
        <div class="row q-col-gutter-sm q-py-md">
          <!-- Tarea JP -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.codigo_tarea_jp"
              label="Tarea"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Subtarea JP -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.codigo_subtarea_jp"
              label="Código de subtarea"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Técnico -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.tecnico"
              label="Técnico"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Fecha actual -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.fecha"
              label="Fecha actual"
              readonly
              outlined
              dense
            ></q-input>
          </div>

          <!-- Grupo -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.grupo"
              label="Grupo"
              readonly
              outlined
              dense
            ></q-input>
          </div>

          <!-- Tecnico responsable -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.tecnico_responsable"
              label="Técnico responsable"
              readonly
              outlined
              dense
            ></q-input>
          </div>
        </div>

        <div class="row q-col-gutter-sm q-py-md">
          <!-- Codigo bobina -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.codigo_bobina"
              label="Codigo bobina"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Marca inicial -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.marca_inicial"
              label="Marca inicial"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Marca final -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.marca_final"
              label="Marca final"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Tipo elemento -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.tipo_elemento"
              label="Tipo de elemento"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Numero poste -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.numero_poste"
              label="Número de poste"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Propietario del elemento -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.propietario_elemento"
              label="Propietario del elemento"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Estado del elemento -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.estado_elemento"
              label="Estado del elemento"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Progresiva de entrada -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.progresiva_entrada"
              label="Progresiva de entrada"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Progresiva de salida -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.progresiva_salida"
              label="Progresiva de salida"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Herraje instalado -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.herraje_instalado"
              label="Herraje instalado"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Guardacabo -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.guardacabo"
              label="Guardacabo"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Preformado -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.preformado"
              label="Preformado"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Cintas3_4 -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.cintas3_4"
              label="Cintas 3/4"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Hebillas3_4 -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.hebillas3_4"
              label="Hebillas 3/4"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Tiene placas rotulo -->
          <div class="col-12 col-md-3">
            <q-checkbox
              v-model="progresiva.tiene_placas_rotulo"
              label="Tiene placas/rotulo"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Cantidad_placas_rotulo -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.cantidad_placas_rotulo"
              label="Cantidad placas/rotulo"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Amarra15cm -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.amarra15cm"
              label="Amarra 15cm"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Amarra30cm -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.amarra30cm"
              label="Amarra 30cm"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Americano -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.americano"
              label="Americano"
              outlined
              dense
              :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
            ></q-input>
          </div>

          <!-- Se instalo reserva -->
          <div class="col-12 col-md-3">
            <q-checkbox
              v-model="progresiva.se_instalo_reserva"
              label="Se instaló reserva"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Se instalo manga -->
          <div class="col-12 col-md-3">
            <q-checkbox
              v-model="progresiva.se_instalo_manga"
              label="Se instaló manga"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Poste tiene transformador -->
          <div class="col-12 col-md-3">
            <q-checkbox
              v-model="progresiva.poste_tiene_transformador"
              label="Poste tiene transformador"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Cantidad transformadores -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.cantidad_transformadores"
              label="Cantidad transformadores"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Poste tiene retenidas -->
          <div class="col-12 col-md-3">
            <q-checkbox
              v-model="progresiva.poste_tiene_retenidas"
              label="Poste tiene retenidas"
              outlined
              dense
            ></q-checkbox>
          </div>

          <!-- Cantidad retenidas -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.cantidad_retenidas"
              label="Cantidad retenidas"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Observaciones -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.observaciones"
              label="Observaciones"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Hora -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.hora"
              label="Hora"
              type="time"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Imagen -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.imagen"
              label="Imagen"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Latitud -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.latitud"
              label="Latitud"
              outlined
              dense
            ></q-input>
          </div>

          <!-- Longitud -->
          <div class="col-12 col-md-3">
            <q-input
              v-model="progresiva.longitud"
              label="Longitud"
              outlined
              dense
            ></q-input>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>

<script src="./ProgresivaPage.ts"></script>
