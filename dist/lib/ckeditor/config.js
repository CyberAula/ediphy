CKEDITOR.editorConfig = function( config ) {
	config.toolbarGroups = [
		{ name: 'document', groups: [ 'document', 'mode', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		'/',
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'about', groups: [ 'about' ] }
	];
	
	config.skin = 'bootstrapck';
	config.linkJavaScriptLinksAllowed = true;
	config.linkShowAdvancedTab = false;
	config.dialog_noConfirmCancel = true;
	config.stylesSet = [	
    	{ name: 'negrita', element: 'strong' },
    	{ name: 'cursiva', element: 'em' },
		{ name: 'sinespacio', element: 'span' , attributes: { 'class': 'sinespacio' } },
		{ name: 'titulo_cm', element: 'span', attributes: { 'class': 'titulo_cm' }  },
		{ name: 'excepcion', element: 'span', attributes: { 'class': 'excepcion' }  },
		{ name: 'importante', element: 'span', attributes: { 'class': 'importante' }  },
		{ name: 'novedad', element: 'span', attributes: { 'class': 'novedad' }  },
		{ name: 'nota', element: 'span', attributes: { 'class': 'nota' }  },
		{ name: 'definicion', element: 'span', attributes: { 'class': 'definicion' }  },
		{ name: 'ejercicio', element: 'span', attributes: { 'class': 'ejercicio' }  },
		{ name: 'masinfo', element: 'span', attributes: { 'class': 'masinfo' }  },
		{ name: 'marcolegal', element: 'span', attributes: { 'class': 'marcolegal' }  },
		{ name: 'recuerda', element: 'span', attributes: { 'class': 'recuerda' }  },
		{ name: 'cm', element: 'span', attributes: { 'class': 'cm' }  },
		{ name: 'ptablas', element: 'span', attributes: { 'class': 'ptablas' }  },
		{ name: 'texto_tutor', element: 'span', attributes: { 'class': 'texto_tutor' }  },
		{ name: 'demo', element: 'span', attributes: { 'class': 'demo' }  },
		{ name: 'demopractica', element: 'span', attributes: { 'class': 'demopractica' }  },
		{ name: 'ejpractica', element: 'span', attributes: { 'class': 'ejpractica' }  },
		{ name: 'titulo_img', element: 'span', attributes: { 'class': 'titulo_img' } },
		{ name: 'titulo', element: 'span', attributes: { 'class': 'titulo' } },
		
		{ name: 'enlaceWeb', element: 'a', attributes: { 'class': 'enlaceWeb' } },
		{ name: 'enlaceBlanco', element: 'a', attributes: { 'class': 'enlaceBlanco' } },
		{ name: 'enlacePdf', element: 'a', attributes: { 'class': 'enlacePdf' } },
		{ name: 'enlaceWord', element: 'a', attributes: { 'class': 'enlaceWord' } },
		{ name: 'enlaceExcel', element: 'a', attributes: { 'class': 'enlaceExcel' } },
		{ name: 'enlaceGlosario', element: 'a', attributes: { 'class': 'enlaceGlosario' } },
		{ name: 'enlaceZip', element: 'a', attributes: { 'class': 'enlaceZip' } },
		{ name: 'enlaceCapa', element: 'a', attributes: { 'class': 'enlaceCapa' } },
		{ name: 'enlacePopup', element: 'a', attributes: { 'class': 'enlacePopup' } },
		{ name: 'enlacePopup_blanco', element: 'a', attributes: { 'class': 'enlacePopup_blanco' } },
		{ name: 'enlace traduccion', element: 'a', attributes: { 'class': 'text_violeta' } },
		{ name: 'enlace ejemplo', element: 'a', attributes: { 'class': 'ejemplo' } },
		{ name: 'masinfo_capa', element: 'a', attributes: { 'class': 'masinfo_capa' } },
		{ name: 'nota_capa', element: 'a', attributes: { 'class': 'nota_capa' } },
		{ name: 'capa_gris', element: 'a', attributes: { 'class': 'capa_gris' } },
		
		{ name: 'bolo_flecha', element: 'ul', attributes: { 'class': 'bolo_flecha' } },
		{ name: 'boliche', element: 'ul', attributes: { 'class': 'boliche' } },
		{ name: 'guion', element: 'ul', attributes: { 'class': 'guion' } },
		{ name: 'bolo', element: 'ul', attributes: { 'class': 'bolo' } },
		{ name: 'letra', element: 'ol', attributes: { 'class': 'letra' } },
		{ name: 'bolo_flecha', element: 'ul', attributes: { 'class': 'bolo_flecha' } },
		{ name: 'metido', element: 'li', attributes: { 'class': 'metido' } },
		{ name: 'sinbolo', element: 'li', attributes: { 'class': 'sinbolo' } },
		{ name: 'sinbolo_sinespacio', element: 'li', attributes: { 'class': 'sinbolo_sinespacio' } },
		{ name: 'celdas', element: 'li', attributes: { 'class': 'celdas' } },
		
		{ name: 'capa_ejemplo', element: 'div', attributes: { 'class': 'capa_ejemplo' } },
		{ name: 'capa_ejemplolista', element: 'div', attributes: { 'class': 'capa_ejemplolista' } },
		{ name: 'capa_ejemplo_pli', element: 'div', attributes: { 'class': 'capa_ejemplo_pli' } },
		{ name: 'resaltado2', element: 'div', attributes: { 'class': 'resaltado2' } },
		{ name: 'resaltado', element: 'div', attributes: { 'class': 'resaltado' } },
		{ name: 'resaltado_li', element: 'div', attributes: { 'class': 'resaltado_li' } },
		{ name: 'resaltado_pli', element: 'div', attributes: { 'class': 'resaltado_pli' } },
		{ name: 'resaltadolista_li', element: 'div', attributes: { 'class': 'resaltadolista_li' } },
		{ name: 'resaltadolista_p', element: 'div', attributes: { 'class': 'resaltadolista_p' } },
		{ name: 'resaltadolista_pli', element: 'div', attributes: { 'class': 'resaltadolista_pli' } },
		{ name: 'marco', element: 'div', attributes: { 'class': 'marco' } },
		{ name: 'marco_li', element: 'div', attributes: { 'class': 'marco_li' } },
		{ name: 'marco_pli', element: 'div', attributes: { 'class': 'marco_pli' } },
		{ name: 'marcolista_p', element: 'div', attributes: { 'class': 'marcolista_p' } },
		{ name: 'marcolista_li', element: 'div', attributes: { 'class': 'marcolista_li' } },
		{ name: 'marcolista_pli', element: 'div', attributes: { 'class': 'marcolista_pli' } },
		{ name: 'marcolista_lip', element: 'div', attributes: { 'class': 'marcolista_lip' } },
		{ name: 'transparente_li', element: 'div', attributes: { 'class': 'transparente_li' } },
		{ name: 'transparente_p', element: 'div', attributes: { 'class': 'transparente_p' } },
		{ name: 'transparente_pli', element: 'div', attributes: { 'class': 'transparente_pli' } },
		{ name: 'opcion_ley', element: 'div', attributes: { 'class': 'opcion_ley' } },
		{ name: 'texto_ley', element: 'div', attributes: { 'class': 'texto_ley' } },
		{ name: 'letra_ley', element: 'div', attributes: { 'class': 'letra_ley' } },
		{ name: 'pie', element: 'div', attributes: { 'class': 'pie' } },
		{ name: 'tablaDiv', element: 'div', attributes: { 'class': 'tablaDiv' } },
		{ name: 'fila_tablaDiv', element: 'div', attributes: { 'class': 'fila_tablaDiv' } },
		{ name: 'col_tablaDiv', element: 'div', attributes: { 'class': 'col_tablaDiv' } },
		{ name: 'cont_capa_gris', element: 'div', attributes: { 'class': 'cont_capa_gris' } },
		{ name: 'iconohover', element: 'div', attributes: { 'class': 'iconohover' } },
		{ name: 'iconopie', element: 'div', attributes: { 'class': 'iconopie' } },
		{ name: 'capacidad', element: 'div', attributes: { 'class': 'capacidad' } },
		{ name: 'actividad_individual', element: 'div', attributes: { 'class': 'actividad_individual' } },
		{ name: 'actividad_colaborativa', element: 'div', attributes: { 'class': 'actividad_colaborativa' } },
		{ name: 'actividad_presencial', element: 'div', attributes: { 'class': 'actividad_presencial' } },
		{ name: 'practica', element: 'div', attributes: { 'class': 'practica' } },
		{ name: 'repaso_teoria', element: 'div', attributes: { 'class': 'repaso_teoria' } },
		{ name: 'margenes_mapas', element: 'div', attributes: { 'class': 'margenes_mapas' } },
		{ name: 'masseparacion', element: 'div', attributes: { 'class': 'masseparacion' } },
		{ name: 'finalizacion', element: 'div', attributes: { 'class': 'finalizacion' } },
		{ name: 'titulo', element: 'div', attributes: { 'class': 'titulo' } },
		{ name: 'caja_AplicacionPractica', element: 'div', attributes: { 'class': 'caja_AplicacionPractica' } },
		{ name: 'mapa_imagen', element: 'div', attributes: { 'class': 'mapa_imagen' } },
		{ name: 'rounded', element: 'div', attributes: { 'class': 'rounded' } },
		{ name: 'roundedTop', element: 'div', attributes: { 'class': 'roundedTop' } },
		{ name: 'roundedBottom', element: 'div', attributes: { 'class': 'roundedBottom' } },
		{ name: 'roundedLeft', element: 'div', attributes: { 'class': 'roundedLeft' } },
		{ name: 'roundedRight', element: 'div', attributes: { 'class': 'roundedRight' } },
		{ name: 'degraded', element: 'div', attributes: { 'class': 'degraded' } },

		//Falta meter los AP
		
		{ name: 'tabla', element: 'table', attributes: { 'class': 'tabla' } },
		{ name: 'tablavideo', element: 'table', attributes: { 'class': 'tablavideo' } },
		{ name: 'tabla_blanca', element: 'table', attributes: { 'class': 'tabla_blanca' } },
		{ name: 'lineainferior', element: 'td', attributes: { 'class': 'lineainferior' } },
		{ name: 'lineaderecha', element: 'td', attributes: { 'class': 'lineaderecha' } },
		{ name: 'fraccion', element: 'table', attributes: { 'class': 'fraccion' } },
		{ name: 'verde', element: 'td', attributes: { 'class': 'verde' } },
		{ name: 'rojo', element: 'td', attributes: { 'class': 'rojo' } },
		{ name: 'tabla_finalizacion', element: 'table', attributes: { 'class': 'tabla_finalizacion' } },
		{ name: 'transversal', element: 'td', attributes: { 'class': 'transversal' } },
		{ name: 'pasado', element: 'td', attributes: { 'class': 'pasado' } },
		{ name: 'fondo_pastel', element: 'td', attributes: { 'class': 'fondo_pastel' } },
		
		{ name: 'img_derecha', element: 'img', attributes: { 'class': 'img_derecha' } },
		{ name: 'img_izquierda', element: 'img', attributes: { 'class': 'img_izquierda' } },
		{ name: 'images_escalable', element: 'img', attributes: { 'class': 'images_escalable' } },
		{ name: 'sombraparalela', element: 'img', attributes: { 'class': 'sombraparalela' } },
		{ name: 'sombraparalela_sin', element: 'img', attributes: { 'class': 'sombraparalela_sin' } },
	];

	config.removeButtons = 
		'Source,' + 
		'Templates,' + 
		'Save,' + 
		'NewPage,' + 
		'Preview,' + 
		'Print,' + 
		'Replace,' + 
		'Find,' + 
		'SelectAll,' + 
		'Form,' + 
		'Checkbox,' + 
		'Radio,' + 
		'TextField,' + 
		'Textarea,' + 
		'Select,' + 
		'Button,' + 
		'ImageButton,' + 
		'HiddenField,' + 
		'CreateDiv,' + 
		'Bold,' + 
		'Italic,' + 
		'Underline,' + 
		'Strike,' + 
		'Subscript,' + 
		'Superscript,' + 
		'Blockquote,' +
		'BidiLtr,' + 
		'BidiRtl,' + 
		'Language,' + 
		'Anchor,' + 
		'Flash,' + 
		'HorizontalRule,' + 
		'Smiley,' + 
		'PageBreak,' + 
		'Iframe,' + 
		'SpecialChar,' + 
		'About,' + 
		'Maximize,' + 
		'ShowBlocks,' + 
		'TextColor,' + 
		'BGColor,' + 
		'Format,' + 
		'Font,' + 
		'FontSize,' + 
		'Unlink';	
	
	config.plugins =
		'about,' +
		'a11yhelp,' +
		'basicstyles,' +
		'bidi,' +
		'blockquote,' +
		'clipboard,' +
		'colorbutton,' +
		'colordialog,' +
		'contextmenu,' +
		'dialogadvtab,' +
		'div,' +
		'elementspath,' +
		'enterkey,' +
		'entities,' +
		'filebrowser,' +
		'find,' +
		'flash,' +
		'floatingspace,' +
		'font,' +
		'format,' +
		'forms,' +
		'horizontalrule,' +
		'htmlwriter,' +
		'image,' +
		'iframe,' +
		'indentlist,' +
		'indentblock,' +
		'justify,' +
		'language,' +
		'link,' +
		'list,' +
		'liststyle,' +
		'magicline,' +
		'maximize,' +
		'newpage,' +
		'pagebreak,' +
		'pastefromword,' +
		'pastetext,' +
		'preview,' +
		'print,' +
		'removeformat,' +
		'resize,' +
		'save,' +
		'selectall,' +
		'showblocks,' +
		'showborders,' +
		'smiley,' +
		'sourcearea,' +
		'specialchar,' +
		'stylescombo,' +
		'tab,' +
		'table,' +
		'tabletools,' +
		'templates,' +
		'toolbar,' +
		'undo,' +
		'wysiwygarea';					
};