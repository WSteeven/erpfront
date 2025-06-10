import {LocalStorage} from 'quasar';

export function cargarDesdeLocalStorage(clave:string):any[] {
    const item = LocalStorage.getItem(clave)
    return item != null ? JSON.parse(item.toString()) : []
}