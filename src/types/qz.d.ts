// src/types/qz.d.ts
declare global {
    interface Window {
        qz: {
            websocket: {
                connect: () => Promise<void>;
                disconnect: () => Promise<void>;
            };
            configs: {
                create: (printerName: string) => any; // Puedes refinar este tipo si necesitas más precisión
            };
            print: (config: any, data: { type: string; data: string }[]) => Promise<void>;
        };
    }
}

export { }; // Asegura que sea un módulo