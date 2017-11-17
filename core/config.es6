export default {
    // PATHS
    xml_path: "ediphy/add_xml",
    xml_fake_path: "exercises/ua2_ue10_ejer7.xml",
    exercise_render_template_iframe_src: "./exercises/index.html",
    dist_index: "dist/index.html",
    dist_visor_bundle: "dist/visor-bundle.js",
    visor_bundle: "visor-bundle.js",
    image_placeholder: "images/placeholder.png",
    broken_link: "images/broken_link.png",
    scorm_ejs: "/lib/scorm/scorm_nav.ejs",
    visor_ejs: "./lib/visor/index",
    scorm_zip: "./lib/scorm/scorm.zip",
    visor_zip: "./lib/visor/dist.zip",
    export_url: "http://127.0.0.1:8081/saveConfig",
    import_url: "http://127.0.0.1:8081/getConfig",
    search_vish_url: "http://vishub.org/apis/search/",
    upload_vish_url: "http://127.0.0.1:8081/upload",
    // OPTIONS
    external_providers: {
        enable_search: true,
        enable_external_upload: false,
        enable_catalog_modal: false,
    },
    publish_button: false,
    show_numbers_before_navitems: false,
    api_editor_url_change: false,
    open_button_enabled: true,
    sections_have_content: false,
    autosave_time: 0, // Any value below 1000 will not autosave
    pluginList: [
        'BasicImage',
        'BasicText',
        'BasicPlayer',
        'DataTable',
        'EnrichedPlayer',
        'VirtualTour',
        'Webpage',
        'GraficaD3',
        'HotspotImages',

    ],
    availableLanguages: [
        'en',
        'es',
    ],
};
