<template>
  <q-page padding>
    <b>Detalles del elemento</b>
    <div class="row q-col-gutter-sm q-py-md">
      <!-- Tipo elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Tipo de elemento</label>
        <q-select
          v-model="progresiva.tipo_elemento"
          :options="tiposElementos"
          options-dense
          dense
          outlined
        />
      </div>

      <!-- Numero poste -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Número de poste</label>
        <q-input v-model="progresiva.numero_poste" outlined dense></q-input>
      </div>

      <!-- Propietario del elemento -->
      <div class="col-12 col-md-3">
        <label-abrir-modal
          label="Propietario del elemento"
          @click="modalesProgresiva.abrirModalEntidad('TipoTareaPage')"
        ></label-abrir-modal>
        <!-- <label class="q-mb-sm block">Propietario del elemento</label> -->
        <q-select
          v-model="progresiva.propietario_elemento"
          :options="propietariosElementos"
          options-dense
          dense
          outlined
        >
        </q-select>
      </div>

      <!-- Estado del elemento -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Estado del elemento</label>
        <q-select
          v-model="progresiva.estado_elemento"
          :options="estadoElementos"
          options-dense
          dense
          outlined
          :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
        />
      </div>

      <!-- Progresiva de entrada -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Progresiva de entrada (metros)</label>
        <q-input
          v-model="progresiva.progresiva_entrada"
          outlined
          dense
          :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
        ></q-input>
      </div>

      <!-- Progresiva de salida -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Progresiva de salida (metros)</label>
        <q-input
          v-model="progresiva.progresiva_salida"
          outlined
          dense
          :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
        ></q-input>
      </div>

      <!-- Herraje instalado -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Tipo de herraje instalado</label>
        <q-input
          v-model="progresiva.herraje_instalado"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Guardacabo -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Cantidad de guardacabo (unidad)</label>
        <q-input v-model="progresiva.guardacabo" outlined dense></q-input>
      </div>

      <!-- Preformado -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Cantidad de preformado (unidad)</label>
        <q-input v-model="progresiva.preformado" outlined dense></q-input>
      </div>

      <!-- Cintas3_4 -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Cantidad de cintas 3/4 (metros)</label>
        <q-input
          v-model="progresiva.cintas3_4"
          outlined
          dense
          :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
        ></q-input>
      </div>

      <!-- Hebillas3_4 -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Cantidad de hebillas 3/4 (metros)</label>
        <q-input
          v-model="progresiva.hebillas3_4"
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
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Cantidad_placas_rotulo -->
      <div v-if="progresiva.tiene_placas_rotulo" class="col-12 col-md-3">
        <label class="q-mb-sm block">Cantidad de placas/rotulo (unidad)</label>
        <q-input
          v-model="progresiva.cantidad_placas_rotulo"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Amarra15cm -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Cantidad de amarras 15cm (unidad)</label>
        <q-input v-model="progresiva.amarra15cm" outlined dense></q-input>
      </div>

      <!-- Amarra30cm -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Cantidad de amarras 30cm (unidad)</label>
        <q-input v-model="progresiva.amarra30cm" outlined dense></q-input>
      </div>

      <!-- Americano -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Americano</label>
        <q-input
          v-model="progresiva.americano"
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
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Se instalo manga -->
      <div class="col-12 col-md-3">
        <q-checkbox
          v-model="progresiva.se_instalo_manga"
          label="Se instaló manga"
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Latitud -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Latitud</label>
        <q-input
          v-model="progresiva.latitud"
          outlined
          dense
          :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
        ></q-input>
      </div>

      <!-- Longitud -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Longitud</label>
        <q-input
          v-model="progresiva.longitud"
          outlined
          dense
          :rules="[(val) => (val && val.length > 0) || 'Campo requerido']"
        ></q-input>
      </div>

      <!-- Poste tiene transformador -->
      <div class="col-12 col-md-3">
        <q-checkbox
          v-model="progresiva.poste_tiene_transformador"
          label="Poste tiene transformador"
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Cantidad transformadores -->
      <div v-if="progresiva.poste_tiene_transformador" class="col-12 col-md-3">
        <label class="q-mb-sm block">Cantidad transformadores</label>
        <q-input
          v-model="progresiva.cantidad_transformadores"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Poste tiene retenidas -->
      <div class="col-12 col-md-3">
        <q-checkbox
          v-model="progresiva.poste_tiene_retenidas"
          label="Poste tiene retenidas"
          class="q-pt-lg"
          outlined
          dense
        ></q-checkbox>
      </div>

      <!-- Cantidad retenidas -->
      <div v-if="progresiva.poste_tiene_retenidas" class="col-12 col-md-3">
        <label class="q-mb-sm block">Cantidad retenidas</label>
        <q-input
          v-model="progresiva.cantidad_retenidas"
          type="number"
          placeholder="Obligatorio"
          min="0"
          outlined
          dense
        ></q-input>
      </div>

      <!-- Observaciones -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Observaciones</label>
        <q-input v-model="progresiva.observaciones" outlined dense></q-input>
      </div>

      <!-- Hora -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Hora</label>
        <q-input v-model="progresiva.hora" type="time" outlined dense></q-input>
      </div>

      <!-- Imagen -->
      <div class="col-12 col-md-3">
        <label class="q-mb-sm block">Imagen</label>
        <selector-imagen
          :modelValue="progresiva.imagen"
          @update:modelValue="(data) => (progresiva.imagen = data)"
        ></selector-imagen>
      </div>
    </div>
  </q-page>
</template>

<script src="./RegistroProgresivaPage.ts"></script>
