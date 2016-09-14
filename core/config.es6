export default {
    xml_path: "dali_documents/add_xml", //"http://lamas.dit.upm.es:3000/dali_documents/add_xml",
    xml_fake_path: "exercises/ua2_ue10_ejer7.xml",
    exercise_render_template_iframe_src: "./exercises/index.html",
    scorm_ejs: "/lib/scorm/scorm_nav.ejs",
    visor_ejs: "./lib/visor/index.ejs",
    scorm_zip: "./lib/scorm/scorm.zip",
    visor_zip: "./lib/visor/dist.zip",
    export_url: "http://127.0.0.1:8081/saveConfig",
    import_url: "http://127.0.0.1:8081/getConfig",
    search_vish_url: "http://vishub.org/apis/search/",
    pluginList: [
        'BasicImage',
        'BasicText',
        'BasicVideo',
        'Youtube',
        'Webpage',
        'CajasColorBis',
        'Container',
        'ListaNumerada',
        'RelacionaAll'
    ],
    availableLanguages:[
        'en',
        'es'
    ]
};
