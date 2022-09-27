<template>
    <tab-layout :mixin="mixin" :configuracionColumnas="configuracionColumnas" titulo-pagina="Transacciones">
        <template #formulario>
            <q-form @submit.prevent>
                <div class="row q-col-gutter-sm q-py-md">
                    <!-- N° transaccion -->
                    <div v-if="transaccion.id" class="col-12 col-md-3">
                        <label class="q-mb-sm block">Transacción N°</label>
                        <q-input v-model="transaccion.id" placeholder="Obligatorio" :readonly="true" outlined dense>
                        </q-input>
                    </div>
                    <!-- Fecha de transaccion -->
                    <div class="col-12 col-md-3">
                        <label class="q-mb-sm block">Fecha</label>
                        <q-input 
                            v-model="transaccion.created_at" 
                            mask="date" 
                            :rules="['date']"
                            :readonly="true" 
                            outlined dense 
                        />
                    </div>
                    <!-- Select tipo -->
                    <div class="col-12 col-md-3 q-mb-md">
                        <label class="q-mb-sm block">Tipo</label>
                        <q-select v-model="tipo" :options="opciones_tipos"
                            transition-show="jum-up" transition-hide="jump-down" options-dense dense outlined
                            :option-value="(v)=>v.id" 
                            :option-label="(v) => v.nombre" 
                            emit-value map-options>
                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                        No hay resultados
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                    </div>
                    <!-- Select subtipo -->
                    <div class="col-12 col-md-3 q-mb-md">
                        <label class="q-mb-sm block">Subtipo</label>
                        <q-select v-model="transaccion.subtipo" :options="opciones_subtipos.subtipos"
                            transition-show="jum-up" transition-hide="jump-down" options-dense dense outlined
                            :error="!!v$.subtipo.$errors.length" error-message="Debes seleccionar un subtipo"
                            :option-value="(v)=>v.id" :option-label="(v) => v.nombre" emit-value map-options>
                            <template v-slot:error>
                                <div v-for="error of v$.subtipo.$errors" :key="error.$uid">
                                    <div class="error-msg">{{error.$message}}</div>
                                </div>
                            </template>
                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                        No hay resultados
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                    </div>
                    <!-- Select sucursal -->
                    <div class="col-12 col-md-3 q-mb-md">
                        <label class="q-mb-sm block">Sucursal</label>
                        <q-select v-model="transaccion.sucursal" :options="opciones_sucursales.sucursales"
                            transition-show="jum-up" transition-hide="jump-down" options-dense dense outlined
                            :error="!!v$.sucursal.$errors.length" error-message="Debes seleccionar una sucursal"
                            :option-value="(v)=>v.id" :option-label="(v) => v.lugar" emit-value map-options>
                            <template v-slot:error>
                                <div v-for="error of v$.sucursal.$errors" :key="error.$uid">
                                    <div class="error-msg">{{error.$message}}</div>
                                </div>
                            </template>
                            <template v-slot:no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                        No hay resultados
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                    </div>
                    <!-- Justificacion -->
                    <div class="col-12 col-md-3">
                        <label class="q-mb-sm block">Justificación</label>
                        <q-input v-model="transaccion.justificacion" placeholder="Obligatorio" :readonly="disabled"
                            :error="!!v$.justificacion.$errors.length"
                            @update:model-value="(v)=>(transaccion.justificacion=v.toUpperCase())" outlined dense>
                            <template v-slot:error>
                                <div v-for="error of v$.justificacion.$errors" :key="error.$uid">
                                    <div class="error-msg">{{error.$message}}</div>
                                </div>
                            </template>
                        </q-input>
                    </div>
                </div>
            </q-form>
        </template>
    </tab-layout>
</template>
  
  
  <script src="./TransaccionPage.ts"/>
  