import {Endpoint} from 'shared/http/domain/Endpoint';

export const appenate = {
    progresivas: new Endpoint('appenate/progresivas'),
    imprimir_ot: new Endpoint('appenate/imprimir-ot-progresiva/'),
    imprimir_kml: new Endpoint('appenate/imprimir-kml-progresiva/')
}