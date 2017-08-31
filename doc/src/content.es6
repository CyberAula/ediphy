export const WIKI_BASE_URL = "https://raw.githubusercontent.com/wiki/ging/dali_editor/";
export const tree = {
    1: {
        title: "Home",
        children: {},
        self: true,
    },
    2: {
        title: "About",
        children: {},
        self: true,
    },
    3: {
        title: "Manual de usuario",
        children: {},
        pages: {},
        self: true,
    },
    4: {
        title: "Docs",
        children: {
            1: {
                title: "Dalí Editor",
                children: {},
                pages:
                    {
                        1: {
                            title: "Introducción",
                            md: true,
                            fromURL: true,
                            src: (WIKI_BASE_URL + "Home.md"),
                            hideTitle: true,
                        },
                        2: {
                            title: "Herramientas",
                            md: true,
                            fromURL: true,
                            src: (WIKI_BASE_URL + "Herramientas.md"),
                        },
                        3: {
                            title: "React",
                            md: true,
                            fromURL: true,
                            src: (WIKI_BASE_URL + "React.md"),
                            subpages: {
                                1: {
                                    title: "Componentes",
                                    md: true,
                                    fromURL: true,
                                    src: (WIKI_BASE_URL + "Componentes.md"),
                                },
                            },
                        },
                        4: {
                            title: "Redux",
                            md: true,
                            fromURL: true,
                            src: (WIKI_BASE_URL + "Redux.md"),
                            subpages: {
                                1: {
                                    title: "Estado de la aplicación",
                                    md: true,
                                    fromURL: true,
                                    src: (WIKI_BASE_URL + "Estado-de-la-aplicación.md"),
                                },
                                2: {
                                    title: "Acciones",
                                    md: true,
                                    fromURL: true,
                                    src: (WIKI_BASE_URL + "Acciones.md"),
                                },
                                3: {
                                    title: "Reductores",
                                    md: true,
                                    fromURL: true,
                                    src: (WIKI_BASE_URL + "Reductores.md"),
                                },

                            },
                        },
                        5: {
                            title: "Configuración global",
                            md: true,
                            fromURL: true,
                            src: (WIKI_BASE_URL + "GlobalConfig.md"),
                        },
                        6: {
                            title: "Plugins",
                            md: true,
                            fromURL: true,
                            src: (WIKI_BASE_URL + "PluginDev.md"),
                            subpages: {
                                1: {
                                    title: "Comunicación con Plugin API",
                                    md: true,
                                    fromURL: true,
                                    src: (WIKI_BASE_URL + "API.md"),
                                },
                                2: {
                                    title: "Uso de plugins",
                                    md: true,
                                    fromURL: true,
                                    src: (WIKI_BASE_URL + "Plugins.md"),
                                },

                            },
                        },

                    },
            },
            2: {
                title: "Plugin API",
                children: {},
                pages:
                    {
                        1: {
                            title: "Introducción",
                            md: true,
                            fromURL: true,
                            src: (WIKI_BASE_URL + "PluginIntro.md"),
                        },
                        2: {
                            title: "Creación de plugins",
                            md: true,
                            fromURL: true,
                            src: (WIKI_BASE_URL + "Creaci%C3%B3n-de-plugins.md"),
                        },
                        3: {
                            title: "BasePlugin",
                            md: true,
                            fromURL: true,
                            src: (WIKI_BASE_URL + "BasePlugin.md"),
                        },
                        4: {
                            title: "BasePluginVisor",
                            md: true,
                            fromURL: true,
                            src: (WIKI_BASE_URL + "BasePluginVisor.md"),
                        },
                        5: {
                            title: "Plugins Enriquecidos",
                            md: true,
                            fromURL: true,
                            src: (WIKI_BASE_URL + "RichPlugins.md"),
                        },

                    },
            },
        },
    },

};

