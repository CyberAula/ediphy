import { Module } from 'react-360-web';

export default class ConexionModule extends Module {
    constructor(ctx) {
        super('ConexionModule'); // Makes this module available at NativeModules.MyModule
        this._rnctx = ctx;
    }

    // This method will be exposed to the React app

    conexionIframe(cb) {
        const result = new Promise((resolve, reject) => {
            window.addEventListener("message", function(event) {
                // console.log(event);
                let winSource = event.source;
                if(event.data.conexion) {
                    // console.log("(iframe) ha llegado esto: " + event.data.conexion);
                    winSource.postMessage("Conexión establecida correctamente", event.origin);
                }
                else if(event.data.imagenBack) {
                    // console.log("(iframe) ha llegado esto: " + event.data.imagenBack);
                    winSource.postMessage("Imagen Back recibida correctamente", event.origin);
                }else{console.log("(iframe) No ha llegado una data reconocible");}

                resolve(event.data);
            }),
            function e() {console.log("Problemas con la promesa");};
        });
        result.then(datos => {
        // console.log(datos);
            if (this._rnctx) {
                this._rnctx.invokeCallback(cb, [datos]);
            }
        });
    }
}
