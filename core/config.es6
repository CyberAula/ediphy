export default {
    // PATHS
    version: "4",
    xml_path: "ediphy/add_xml",
    xml_fake_path: "exercises/ua2_ue10_ejer7.xml",
    exercise_render_template_iframe_src: "./exercises/index.html",
    dist_index: "dist/index.html",
    dist_visor_bundle: "dist/visor-bundle.js",
    visor_bundle: "visor-bundle.js",
    image_placeholder: "images/placeholder.svg",
    default_mark: "images/mark.svg",
    broken_link: "images/broken_link.png",
    image_mark: "images/flower_mark.png",
    scorm_ejs: "/lib/scorm/scorm_nav.ejs",
    visor_ejs: "./lib/visor/index",
    scorm_zip_2004: "./lib/scorm/scorm2004.zip",
    scorm_zip_12: "./lib/scorm/scorm1.2.zip",
    visor_zip: "./lib/visor/dist.zip",
    export_url: "http://127.0.0.1:8081/saveConfig",
    import_url: "http://127.0.0.1:8081/getConfig",
    search_vish_url: "https://vishub.org/apis/search/",
    // search_vish_url: "https://localhost:3000/apis/search/",
    upload_vish_url: "https://127.0.0.1:8081/upload",
    profile_vish_url: ()=>`https://localhost:3000/users/demo/all_resources.json`,
    // includeVishProfile: true,
    // OPTIONS
    transitions_url: "/transitions/",
    themes_url: "./themes/",
    // themes_absolute_url: "themes/",
    theme_css_url: './theme.css',
    theme_css_absolute_url: 'theme.css',
    externalProviders: {
        enable_search: true,
        enable_external_upload: false,
        enable_catalog_modal: false,
    },
    defaultAspectRatio: 16 / 9,
    publish_button: false,
    debug_scorm: false,
    show_numbers_before_navitems: false,
    api_editor_url_change: false,
    open_button_enabled: true,
    sections_have_content: false,
    autosave_time: 0, // Any value below 1000 will not autosave
    zip_files_forbidden: true,
    pluginList: [
        'EnrichedAudio',
        // 'BasicImage',
        'EnrichedPDF',
        'BasicText',
        // 'BasicPlayer',
        'DataTable',
        'EnrichedPlayer',
        'VirtualTour',
        'Webpage',
        'HotspotImages',
        // 'ContainerReact',
        'MultipleChoice',
        'MultipleAnswer',
        'FreeResponse',
        'InputText',
        // 'ContainerJS',
        'GraficaD3',
        'Ordering',
        'TrueFalse',
        'ScormPackage',
        // 'Visor3D',
        'FlashObject',
        // 'Rating',
        'AudioCue',
        // 'Google3DPolyObject',
    ],
    themeList: [
        'default',
        // 'ging',
        // 'orange',
        'basic',
        'polygon',
        'upm',
        'etsit',
        'urban',
        'paint',
        'purple',
        'natural',
        'desktop',
        'laptop',
        'code',
        'blackboard',
        'vish1',
        'vish2',
        'vish3',
        'vish4',
        'vish5',
        'vish6',
        'vish7',
        'vish8',
        'vish9',
        'vish10',
        'vish11',
        'vish12',
    ],
    availableLanguages: [
        'en',
        'es',
    ],
};
