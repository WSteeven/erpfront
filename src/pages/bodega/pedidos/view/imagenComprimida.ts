import { ref, watch } from 'vue';
import { computed } from 'vue';
import SelectorImagen from 'components/SelectorImagen.vue';
import { defineComponent } from 'vue';

export default defineComponent({
components:{SelectorImagen},
emits: ['update:modelValue'],
setup(props, {emit}){
  const imagen = ref()
  const imagenCodificada = computed(()=>imagen)
  function limpiar(){
    emit('update:modelValue', null)
  }
  const comprimir = (file: File)=>{
    if(file!==null && file!==undefined){
      const reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = () =>emit('update:modelValue', reader.result)
    }
  }
  watch(imagenCodificada, ()=>{
    if(!imagenCodificada.value) imagen.value=null
  })

  return {
    imagen,
    imagenCodificada,
    comprimir,
    limpiar,
  }
}
})
