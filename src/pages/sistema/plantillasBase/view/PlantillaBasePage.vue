<template>
  <tab-layout
    :mixin="mixin"
    :configuracionColumnas="configuracionColumnas"
    titulo-pagina="Plantillas Base"
    :mostrarButtonSubmits="false"
  >
    <template #formulario>
      <q-form @submit.prevent>
        <callout-component
          tipo="info"
          mensaje="Sube aquí todas las plantillas que se usarán a lo largo del sistema, para usarlas llamalas por su nombre y estarán disponibles inmediatamente para su descarga."
        />
        <div class="row q-col-gutter-sm q-py-md">
          <!-- nombre -->
          <div
            :class="
              accion == acciones.nuevo ? 'col-12 col-md-6' : 'col-12 col-md-6'
            "
          >
            <label class="q-mb-sm block">Nombre</label>
            <input-component
              v-model="plantilla.nombre"
              :disable="disabled"
              clave="nombre"
              :v$="v$"
            />
          </div>

          <div class="col-12 col-md-6">
            <label class="q-mb-sm block">Url</label>
            <file-component
              v-model="plantilla.url"
              clave="url"
              :v$="v$"
              :disable="disabled"
              :accion="accion"
            />
          </div>
          <!--          <div class="col-12">{{ v$.$errors }} -{{disabled}}- {{ plantilla }}</div>-->

          <div class="col-12">
            <div class="row justify-end q-col-gutter-x-xs">
              <span>
                <slot name="custom-buttons"></slot>
              </span>

              <button-submits
                :accion="accion"
                :permitirGuardar="true"
                :disabled="cargando.estaCargando.value"
                @cancelar="reestablecer()"
                @editar="
                  guardar(
                    plantilla,
                    false,
                    {},
                    {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    }
                  )
                "
                @eliminar="eliminar(plantilla)"
                @guardar="
                  guardar(
                    plantilla,
                    true,
                    {},
                    {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    }
                  )
                "
              />
            </div>
          </div>
        </div>
      </q-form>
    </template>
  </tab-layout>
</template>
<script src="./PlantillaBasePage.ts" />
