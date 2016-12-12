export function CajasColorBis() {
    return {
        getRenderTemplate: function (state) {

            Element.prototype.setAttributes = function (attrs) {
                for (var idx in attrs) {
                    if ((idx === 'styles' || idx === 'style') && typeof attrs[idx] === 'object') {
                        for (var prop in attrs[idx]){this.style[prop] = attrs[idx][prop];}
                    } else if (idx === 'html') {
                        this.innerHTML = attrs[idx];
                    } else {
                        this.setAttribute(idx, attrs[idx]);
                    }
                }
            };

            var template = document.createElement("div");
            var attrs = {
                'class' : 'cajascolor',
                'style' : {
                    width: '100%',
                    height: '100%',
                    position: 'relative'
                }
            };
            template.setAttributes(attrs);


            var imageTemplate = document.createElement('p');
            attrs = {
                'align' : 'center'
            };
            imageTemplate.setAttributes(attrs);

            var imagePlugin = document.createElement('plugin');
            attrs = {
                'plugin-data-display-name' : Dali.i18n.t('CajasColorBis.image_box_name'),
                'plugin-data-key' : 'image',
                'plugin-data-default' : 'BasicImage'
            };
            imagePlugin.setAttributes(attrs);

            imageTemplate.appendChild(imagePlugin);


            var tablaTemplate = document.createElement('div');
            attrs = {
                'class' : 'tabla_colores'
            };
            tablaTemplate.setAttributes(attrs);

            var filaTemplate = document.createElement('div');
            attrs = {
                'class' : 'fila_colores'
            };
            filaTemplate.setAttributes(attrs);

            var celdasTemplate = [];
            for (let i = 0; i < state.nBoxes; i++) {
                let celda = document.createElement("div");
                attrs = {
                    'class' : 'celda3_colores ' + state['color' + i]
                };
                celda.setAttributes(attrs);

                let link = document.createElement('a');
                attrs = {
                    'href' : 'javascript:void(0)',
                    'onClick' : '$dali$.showDiv()',
                    'data-iddiv' : 'bloque' + i
                };
                link.setAttributes(attrs);

                let title = document.createElement('plugin');
                attrs = {
                    'plugin-data-key' : 'title' + i,
                    'plugin-data-default' : 'BasicText',
                    'plugin-data-resizable' : true
                };
                title.setAttributes(attrs);

                link.appendChild(title);
                celda.appendChild(link);

                celdasTemplate[i] = celda;
            }

            var sepTemplate = document.createElement('div');
            attrs = {
                'class' : 'sep'
            };
            sepTemplate.setAttributes(attrs);


            var bloquesTemplate = [];
            for (let i = 0; i < state.nBoxes; i++) {

                let bloque = document.createElement('div');
                attrs = {
                    'id' : 'bloque' + i,
                    'class' : 'bloque_colores capa_' + state['color' + i],
                    'style' : {
                        'display' : 'none'
                    }
                };
                bloque.setAttributes(attrs);

                let plugin = document.createElement('plugin');
                attrs = {
                    'plugin-data-key' : 'box' + i
                };
                plugin.setAttributes(attrs);

                bloque.appendChild(plugin);
                bloquesTemplate[i] = bloque;
            }


            for (let i = 0; i < state.nBoxes; i++) {

                filaTemplate.appendChild(celdasTemplate[i]);
                if (i !== (state.nBoxes - 1)) {
                    filaTemplate.appendChild(sepTemplate.cloneNode(true));
                }

            }
            tablaTemplate.appendChild(filaTemplate);


            if (state.image){

                template.appendChild(imageTemplate);
            }

            template.appendChild(tablaTemplate);

            for (let i = 0; i < state.nBoxes; i++) {
                template.appendChild(bloquesTemplate[i]);
            }

            var tmp = document.createElement("div");
            tmp.appendChild(template);
            return tmp.innerHTML.replace('onclick', 'onClick');


        },
        showDiv: function (event, element, parent) {
            var _div = element.getAttribute("data-iddiv");
            $( "div[id^='bloque']", parent).slideUp( "fast", function() {});
            if($('#'+_div, parent).is(":visible")){
                $('#'+_div, parent).slideUp( "slow", function() {});
            }else{
                $('#'+_div, parent).slideDown( "slow", function() {});
            }
        }
    };
}
