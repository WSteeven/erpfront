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
          <error-component :v$="v$" clave="tipo" />
        </template>

        <template v-slot:no-option>
          <no-option-component />
        </template>
      </q-select>
    </div>

    <!-- numero_pisos -->
    <div class="col-12 col-md-3 col-sm-3">
      <label class="q-mb-sm block">Cantidad Plantas</label>
      <q-select
        v-model="vivienda.numero_plantas"
        :options="numero_plantas"
        transition-show="jump-up"
        transition-hide="jump-down"
        :disable="disable"
        options-dense
        dense
        outlined
        :error="!!v$.numero_plantas.$errors.length"
        @blur="v$.numero_plantas.$touch"
        error-message="Debes seleccionar un nivel de plantas para la vivienda"
      >
        <template v-slot:error>
          <error-component :v$="v$" clave="numero_plantas" />
        </template>

        <template v-slot:no-option>
          <no-option-component />
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
          <error-component :v$="v$" clave="material_paredes" />
        </template>

        <template v-slot:no-option>
          <no-option-component />
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
          <error-component :v$="v$" clave="material_techo" />
        </template>

        <template v-slot:no-option>
          <no-option-component />
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
          <error-component :v$="v$" clave="material_piso" />
        </template>

        <template v-slot:no-option>
          <no-option-component />
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
          <error-component :v$="v$" clave="distribucion_vivienda" />
        </template>

        <template v-slot:no-option>
          <no-option-component />
        </template>
      </q-select>
    </div>

    <!-- Numero de dormitorios -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block"
        >Cantidad Personas que viven en la vivienda?</label
      >
      <q-input
        v-model="vivienda.numero_personas"
        placeholder="Obligatorio"
        type="number"
        min="0"
        :disable="disable"
        :error="!!v$.numero_personas.$errors.length"
        @blur="v$.numero_personas.$touch"
        outlined
        dense
      >
        <template v-slot:error>
          <error-component :v$="v$" clave="numero_personas" />
        </template>
      </q-input>
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
          <error-component :v$="v$" clave="numero_dormitorios" />
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
          <error-component :v$="v$" clave="comodidad_espacio_familiar" />
        </template>

        <template v-slot:no-option>
          <no-option-component />
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
    <div class="col-12">

    <q-expansion-item
      class="overflow-hidden q-mb-md expansion"
      label="POSIBLES AMENAZAS EN EL SECTOR"
      header-class="text-bold bg-header-collapse"
      default-opened
    >
      <div class="row q-col-gutter-sm q-pa-md">
        <!-- amenazas de inundacion -->
        <div class="col-12 col-md-3 q-mb-md col-sm-3">
          <label class="q-mb-sm block">¿Inundación?</label>
          <q-select
            v-model="vivienda.amenaza_inundacion"
            :options="tipos_amenazas_inundaciones"
            transition-show="jump-up"
            transition-hide="jump-down"
            :disable="disable"
            options-dense
            dense
            outlined
            :error="!!v$.amenaza_inundacion.$errors.length"
            @blur="v$.amenaza_inundacion.$touch"
            error-message="Debes seleccionar al menos una opción"
            multiple
            use-chips
           >
            <template v-slot:error>
              <error-component :v$="v$" clave="amenaza_inundacion" />
            </template>

            <template v-slot:no-option>
              <no-option-component />
            </template>
          </q-select>
        </div>

        <!-- amenazas de deslaves -->
        <div class="col-12 col-md-3 q-mb-md col-sm-3">
          <label class="q-mb-sm block">¿Deslaves/Derrumbes?</label>
          <q-select
            v-model="vivienda.amenaza_deslaves"
            :options="tipos_amenazas_deslaves"
            transition-show="jump-up"
            transition-hide="jump-down"
            :disable="disable"
            options-dense
            dense
            outlined
            :error="!!v$.amenaza_deslaves.$errors.length"
            @blur="v$.amenaza_deslaves.$touch"
            error-message="Debes seleccionar al menos una opción"
            multiple
            use-chips
          >
            <template v-slot:error>
              <error-component :v$="v$" clave="amenaza_deslaves" />
            </template>

            <template v-slot:no-option>
              <no-option-component />
            </template>
          </q-select>
        </div>

        <!-- En caso de terremoto? -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block"
          >¿En caso de terremoto podría ocurrir TSUNAMI?</label
          >
          <option-group-component
            v-model="vivienda.existe_peligro_tsunami"
            :disable="disable"
            :error="!!v$.existe_peligro_tsunami.$errors.length"
            clave="existe_peligro_tsunami"
            :v$="v$"
          />
        </div>

        <!-- En caso de erupcion volcanica? -->
        <div class="col-12 col-md-3">
          <label class="q-mb-sm block"
          >¿En caso de erupción volcanica existe peligro de LAHARES?</label
          >
          <option-group-component
            v-model="vivienda.existe_peligro_lahares"
            :disable="disable"
            :error="!!v$.existe_peligro_lahares.$errors.length"
            clave="existe_peligro_lahares"
            :v$="v$"
          />
        </div>

        <!-- mas amenazas -->
        <div class="col-12 col-md-12">
          <label class="q-mb-sm block"
          >Indique si el sector es propenso a alguna de las siguientes amenazas (Puede seleccionar varios)</label
          >
          <option-group-component
            v-model="vivienda.otras_amenazas_previstas"
            type="checkbox"
            :options="optionsAmenazasPrevistas"
            :disable="disable"
            clave="otras_amenazas_previstas"
            :v$="v$"
            :error="!!v$.otras_amenazas_previstas.$errors.length"
          />
        </div>

        <!-- Otras amenazas redactadas -->
        <div class="col-12 col-md-12 q-mb-md col-sm-12">
          <label class="q-mb-sm block">¿Otras amenazas que quiera especificar?</label>
          <q-input
            v-model="vivienda.otras_amenazas"
            placeholder="Opcional"
            :disable="disable"
            autogrow
            outlined
            dense
          />
        </div>

      </div>
    </q-expansion-item>
    </div>
    <!-- En caso de evacuacion tiene donde ir? -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block"
        >¿En caso de evacuación tiene a donde acudir?</label
      >
      <option-group-component
        v-model="vivienda.tiene_donde_evacuar"
        :disable="disable"
        @update:model-value="checkTieneDondeEvacuar"
      />
    </div>
  </div>
  <div
    class="row q-col-gutter-sm border-grey rounded-4 q-pa-xs q-ma-sm"
    v-if="vivienda.tiene_donde_evacuar"
  >
    <div class="col-12 text-center text-h6">
      <b>DATOS DE LA FAMILIA ACOGIENTE</b>
    </div>
    <!--Provincia -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Provincia</label>
      <q-select
        v-model="vivienda.familia_acogiente.provincia"
        :options="provincias"
        transition-show="jump-up"
        transition-hide="jump-down"
        :disable="disable"
        options-dense
        dense
        outlined
        use-input
        input-debounce="0"
        @filter="filtrarProvincias"
        @update:model-value="obtenerCantones"
        :option-value="v => v.id"
        :option-label="v => v.provincia"
        emit-value
        map-options
      >
        <template v-slot:no-option>
          <no-option-component />
        </template>
      </q-select>
    </div>

    <!--Canton -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Cantón</label>
      <q-select
        v-model="vivienda.familia_acogiente.canton"
        :options="cantones"
        transition-show="jump-up"
        transition-hide="jump-down"
        :disable="disable"
        options-dense
        dense
        outlined
        use-input
        input-debounce="0"
        @filter="filtrarCantones"
        @update:model-value="obtenerParroquias"
        :option-value="v => v.id"
        :option-label="v => v.canton"
        emit-value
        map-options
      >
        <template v-slot:no-option>
          <no-option-component />
        </template>
      </q-select>
    </div>

    <!--Parroquia -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Parroquia</label>
      <q-select
        v-model="vivienda.familia_acogiente.parroquia"
        :options="parroquias"
        transition-show="jump-up"
        transition-hide="jump-down"
        :disable="disable"
        options-dense
        dense
        outlined
        use-input
        input-debounce="0"
        @filter="filtrarParroquias"
        :error="!!v$.familia_acogiente.parroquia.$errors.length"
        error-message="Debes seleccionar una parroquia"
        :option-value="v => v.id"
        :option-label="v => v.parroquia"
        emit-value
        map-options
      >
        <template v-slot:error>
          <error-component clave="familia_acogiente.parroquia" :v$="v$" />
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.parroquia }}</q-item-label>
              <q-item-label caption
                >Cantón {{ scope.opt.canton }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:no-option>
          <no-option-component message="Debes seleccionar primero un cantón" />
        </template>
      </q-select>
    </div>

    <!-- La parroquia es -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">¿La parroquia es?</label>
      <option-group-component
        v-model="vivienda.familia_acogiente.tipo_parroquia"
        :options="optionsTiposParroquias"
        :disable="disable"
      />
    </div>

    <!--     Nombres y Apellidos-->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Nombres y Apellidos</label>
      <q-input
        v-model="vivienda.familia_acogiente.nombres_apellidos"
        placeholder="Obligatorio"
        :disable="disable"
        :error="!!v$.familia_acogiente.nombres_apellidos.$errors.length"
        @blur="v$.familia_acogiente.nombres_apellidos.$touch"
        outlined
        dense
      >
        <template v-slot:error>
          <error-component clave="familia_acogiente.nombres_apellidos" :v$="v$" />
        </template>
      </q-input>
    </div>

    <!-- Telefono -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Telefono/Celular</label>
      <q-input
        type="tel"
        v-model="vivienda.familia_acogiente.telefono"
        hint="Separe con comas para registrar varios telefonos"
        placeholder="Obligatorio"
        :error="!!v$.familia_acogiente.telefono.$errors.length"
        @blur="v$.familia_acogiente.telefono.$touch"
        :disable="disable"
        outlined
        dense
      >
        <template v-slot:error>
          <error-component :v$="v$" clave="familia_acogiente.telefono" />
        </template>
      </q-input>
    </div>
    <!-- Dirección -->
    <div class="col-12 col-md-6">
      <label class="q-mb-sm block">Dirección</label>
      <q-input
        v-model="vivienda.familia_acogiente.direccion"
        placeholder="Obligatorio"
        autogrow
        :error="!!v$.familia_acogiente.direccion.$errors.length"
        @blur="v$.familia_acogiente.direccion.$touch"
        outlined
        :disable="disable"
        dense
      >
        <template v-slot:error>
          <error-component clave="familia_acogiente.direccion" :v$="v$" />
        </template>
      </q-input>
    </div>

    <!-- Referenecia -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Referencia</label>
      <q-input
        v-model="vivienda.familia_acogiente.referencia"
        placeholder="Obligatorio"
        :error="!!v$.familia_acogiente.referencia.$errors.length"
        @blur="v$.familia_acogiente.referencia.$touch"
        outlined
        :disable="disable"
        dense
      >
        <template v-slot:error>
          <error-component clave="familia_acogiente.referencia" :v$="v$" />
        </template>
      </q-input>
    </div>

    <!-- Coordenadas -->
    <div class="col-12 col-md-3">
      <label class="q-mb-sm block">Coordenadas</label>
      <q-input
        v-model="vivienda.familia_acogiente.coordenadas"
        placeholder="Obligatorio"
        :error="!!v$.familia_acogiente.coordenadas.$errors.length"
        @blur="v$.familia_acogiente.coordenadas.$touch"
        outlined
        :disable="disable"
        dense
      >
        <template v-slot:error>
          <error-component clave="familia_acogiente.coordenadas" :v$="v$" />
        </template>
      </q-input>
    </div>
  </div>
  <div class="row border-grey rounded-4 q-pa-xs q-ma-sm">
    <div class="col-12 text-center text-h6">
      <b>SERVICIOS BASICOS</b>
    </div>
    <servicios-basicos :servicio_basico="vivienda.servicios_basicos" />
    <!--              <q-btn @click="v$.$validate()">Validar</q-btn>-->
  </div>
</template>

<script src="./InformacionVivienda.ts" />
