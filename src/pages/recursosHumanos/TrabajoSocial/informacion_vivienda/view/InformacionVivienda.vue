<template>
  <div class="row q-col-gutter-sm q-pa-sm">
    <!-- tipo de vivienda -->
    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block">Tipo de Vivienda</label>
      <q-select
        v-model="vivienda.tipo"
        :options="tipos_viviendas"
        transition-show="jump-up"
        transition-hide="jump-down"
        :disable="disable"
        options-dense
        dense
        outlined
        :error="!!v$.tipo.$errors.length"
        @blur="v$.tipo.$touch"
        error-message="Debes seleccionar un tipo de vivienda"
      >
        <template v-slot:error>
          <error-component  :v$="v$" clave="tipo"/>
        </template>

        <template v-slot:no-option>
          <no-option-component/>
        </template>
      </q-select>
    </div>

    <!-- Material predominante paredes -->
    <div class="col-12 col-md-3 q-mb-md col-sm-3">
      <label class="q-mb-sm block">Material Predominante Paredes</label>
      <q-select
        v-model="vivienda.material_paredes"
        :options="
          obtenerListadoMaterialesPredominantes(tipos_predominantes.PAREDES)
        "
        transition-show="jump-up"
        transition-hide="jump-down"
        :disable="disable"
        options-dense
        dense
        outlined
        :error="!!v$.material_paredes.$errors.length"
        @blur="v$.material_paredes.$touch"
        error-message="Debes seleccionar un material predominante en paredes"
        use-input
        input-debounce="0"
        :option-value="v => v.value"
        :option-label="v => v.label"
        emit-value
        map-options
      >
        <template v-slot:error>
          <error-component  :v$="v$" clave="material_paredes"/>
        </template>

        <template v-slot:no-option>
         <no-option-component/>
        </template>
      </q-select>
    </div>

    <!-- Material predominante techo -->
    <div class="col-12 col-md-3 q-mb-md col-sm-3">
      <label class="q-mb-sm block">Material Predominante Techo</label>
      <q-select
        v-model="vivienda.material_techo"
        :options="
          obtenerListadoMaterialesPredominantes(tipos_predominantes.TECHO)
        "
        transition-show="jump-up"
        transition-hide="jump-down"
        :disable="disable"
        options-dense
        dense
        outlined
        :error="!!v$.material_techo.$errors.length"
        @blur="v$.material_techo.$touch"
        error-message="Debes seleccionar un material predominante en techo"
        use-input
        input-debounce="0"
        :option-value="v => v.value"
        :option-label="v => v.label"
        emit-value
        map-options
      >
        <template v-slot:error>
          <error-component  :v$="v$" clave="material_techo"/>
        </template>

        <template v-slot:no-option>
          <no-option-component/>
        </template>
      </q-select>
    </div>

    <!-- Material predominante piso -->
    <div class="col-12 col-md-3 q-mb-md col-sm-3">
      <label class="q-mb-sm block">Material Predominante Piso</label>
      <q-select
        v-model="vivienda.material_piso"
        :options="
          obtenerListadoMaterialesPredominantes(tipos_predominantes.PISO)
        "
        transition-show="jump-up"
        transition-hide="jump-down"
        :disable="disable"
        options-dense
        dense
        outlined
        :error="!!v$.material_piso.$errors.length"
        @blur="v$.material_piso.$touch"
        error-message="Debes seleccionar un material predominante en el piso"
        use-input
        input-debounce="0"
        :option-value="v => v.value"
        :option-label="v => v.label"
        emit-value
        map-options
      >
        <template v-slot:error>
          <error-component  :v$="v$" clave="material_piso"/>
        </template>

        <template v-slot:no-option>
          <no-option-component/>
        </template>
      </q-select>
    </div>

    <!-- Distribucion de la vivienda -->
    <div class="col-12 col-md-3 q-mb-md col-sm-3">
      <label class="q-mb-sm block">Distribución de la vivienda</label>
      <q-select
        v-model="vivienda.distribucion_vivienda"
        :options="opcionesDistribucion"
        transition-show="jump-up"
        transition-hide="jump-down"
        :disable="disable"
        options-dense
        dense
        outlined
        :error="!!v$.distribucion_vivienda.$errors.length"
        @blur="v$.distribucion_vivienda.$touch"
        error-message="Debes seleccionar al menos una opción"
        multiple
        use-chips
        :option-value="v => v.value"
        :option-label="v => v.label"
        emit-value
        map-options
      >
        <template v-slot:error>
          <error-component  :v$="v$" clave="distribucion_vivienda"/>
        </template>

        <template v-slot:no-option>
         <no-option-component/>
        </template>
      </q-select>
    </div>

    <!-- Numero de dormitorios -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Cantidad Dormitorios</label>
      <q-input
        v-model="vivienda.numero_dormitorios"
        placeholder="Obligatorio"
        type="number"
        min="0"
        :disable="disable"
        :error="!!v$.numero_dormitorios.$errors.length"
        @blur="v$.numero_dormitorios.$touch"
        outlined
        dense
      >
        <template v-slot:error>
          <error-component  :v$="v$" clave="numero_dormitorios"/>
        </template>
      </q-input>
    </div>

    <!-- Existe hacinamiento -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Existe Hacinamiento</label>
      <option-group-component
        v-model="vivienda.existe_hacinamiento"
        :disable="disable"
      />
    </div>

    <!-- comodidad espacio familiar -->
    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block"
        >Considera que el espacio donde convive con su grupo familiar es</label
      >
      <q-select
        v-model="vivienda.comodidad_espacio_familiar"
        :options="likertEspaciosFamiliares"
        transition-show="jump-up"
        transition-hide="jump-down"
        :disable="disable"
        options-dense
        dense
        outlined
        :error="!!v$.comodidad_espacio_familiar.$errors.length"
        @blur="v$.comodidad_espacio_familiar.$touch"
        error-message="Debes seleccionar una opción"
      >
        <template v-slot:error>
          <error-component  :v$="v$" clave="comodidad_espacio_familiar"/>
        </template>

        <template v-slot:no-option>
          <no-option-component/>
        </template>
      </q-select>
    </div>

    <!-- Existe UPC cercano -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Existe cerca UPC o vigilancia</label>
      <option-group-component
        v-model="vivienda.existe_upc_cercano"
        :disable="disable"
      />
    </div>

    <!-- Otras consideraciones -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Alguna otra consideración</label>
      <q-input
        v-model="vivienda.otras_consideraciones"
        placeholder="Opcional"
        :disable="disable"
        autogrow
        outlined
        dense
      />
    </div>
  </div>
</template>

<script src="./InformacionVivienda.ts" />
