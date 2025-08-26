// src/pages/intranet/composables/useNoticiasIntranet.ts
import { ref } from 'vue'
import { NoticiaController } from 'pages/intranet/noticias/infraestructure/NoticiaController'
import { useAuthenticationStore } from 'stores/authentication'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { maskFecha } from 'src/config/utils'
import { obtenerFechaActual } from 'shared/utils'

export function useNoticiasIntranet() {
  const noticias = ref<any[]>([])
  const noticiaCompleta = ref<any | null>(null)
  const modalNoticia = ref(false)
  const carousel_noticias = ref(0)
  const cargando = new StatusEssentialLoading()
  const store = useAuthenticationStore()

  function getShortDescription(description: string): string {
    const maxLength = 275
    return description.length > maxLength
      ? description.substring(0, maxLength) + '...'
      : description
  }

  function verNoticiaCompleta(id: number): void {
    const n = noticias.value.find(x => x.id === id) || null
    if (n) {
      noticiaCompleta.value = n
      modalNoticia.value = true
    } else {
      console.error(`Noticia con ID ${id} no encontrada.`)
    }
  }

  // Alias por compatibilidad si tu template llama a `verNoticiaCompletaHandler`
  function verNoticiaCompletaHandler(id: number): void {
    verNoticiaCompleta(id)
  }

  async function obtenerNoticias() {
    cargando.activar()
    try {
      const dep = store.user?.departamento
      const resp = await new NoticiaController().listar({
        'fecha_vencimiento[operator]': '>',
        'fecha_vencimiento[value]': obtenerFechaActual(maskFecha)
      })

      noticias.value = resp.result.filter((n: any) =>
        n.departamentos_destinatarios === null ||
        n.departamentos_destinatarios?.includes(dep)
      )
    } catch (error) {
      console.error('Error obteniendo noticias:', error)
    } finally {
      cargando.desactivar()
    }
  }

  function cerrarModal() {
    modalNoticia.value = false
  }

  // inicializa al montar la página (mismo comportamiento que antes)
  obtenerNoticias()

  return {
    noticias,
    noticiaCompleta,
    modalNoticia,
    carousel_noticias,
    getShortDescription,
    acortarDescripcion: getShortDescription,
    verNoticiaCompleta,
    verNoticiaCompletaHandler, 
    obtenerNoticias,
    cerrarModal
  }
}
