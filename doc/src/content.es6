// export const WIKI_BASE_URL = "http://localhost:8081/";
export const WIKI_BASE_URL = "https://raw.githubusercontent.com/wiki/ging/dali_editor/";
export const editURL = (src) => {

    return "https://github.com/ging/DALI_EDITOR/wiki/" + src.replace('.md', '') + "/_edit";
};

export const tree = {
    1: {
        path: '/',
        title: "Home",
        children: {},
        self: true,
        componentName: "Home",
    },
    2: {
        path: '/about',
        title: "About",
        children: {},
        self: true,
        componentName: "About",
    },
    3: {
        path: '/manual',
        title: "Manual de usuario",
        children: {},
        pages: {
            1: {
                path: '/manual/intro',
                title: "Manual de usuario",
                md: true,
                fromURL: true,
                src: ("Manual/Manual_Intro.md"),
            },
            2: {
                path: '/manual/estructura',
                title: "Estructura de un curso",
                md: true,
                fromURL: true,
                src: ("Manual/Manual_Estructura.md"),
            },
            3: {
                path: '/manual/plugins',
                title: "Plugins",
                md: true,
                fromURL: true,
                src: ("Manual/Manual_Plugins.md"),
            },
            4: {
                path: '/manual/acciones',
                title: "Acciones adicionales",
                md: true,
                fromURL: true,
                src: ("Manual/Manual_Actions.md"),
            },
        },
    },
    4: {
        title: "Docs",
        children: {
            1: {
                path: '/docs',
                title: "Dalí Editor",
                children: {},
                pages:
                    {
                        1: {
                            path: '/docs/intro',
                            title: "Introducción",
                            md: true,
                            fromURL: true,
                            src: ("DaliDoc.md"),
                            hideTitle: true,
                        },
                        2: {
                            path: '/docs/estructura',
                            title: "Estructura del proyecto",
                            md: true,
                            fromURL: true,
                            src: ("Estructura.md"),
                        },
                        3: {
                            path: '/docs/react',
                            title: "React",
                            md: true,
                            fromURL: true,
                            src: ("React.md"),
                            subpages: {
                                1: {
                                    path: '/docs/react/componentes',
                                    title: "Componentes",
                                    md: true,
                                    fromURL: true,
                                    src: ("Componentes.md"),
                                    react_docgen: true,
                                },
                            },
                        },
                        4: {
                            path: '/docs/redux',
                            title: "Redux",
                            md: true,
                            fromURL: true,
                            src: ("Redux.md"),
                            subpages: {
                                1: {
                                    path: '/docs/redux/estado',
                                    title: "Estado de la aplicación",
                                    md: true,
                                    fromURL: true,
                                    src: ("Estado-de-la-aplicación.md"),
                                },
                                2: {
                                    path: '/docs/redux/acciones',
                                    title: "Acciones",
                                    md: true,
                                    fromURL: true,
                                    src: ("Acciones.md"),
                                },
                                3: {
                                    path: '/docs/redux/reducers',
                                    title: "Reductores",
                                    md: true,
                                    fromURL: true,
                                    src: ("Reductores.md"),
                                },

                            },
                        },
                        /* 5: {
                            title: "Core",
                            md: true,
                            fromURL: true,
                            src: ("Core.md"),
                        }, */
                        6: {
                            path: '/docs/globalconfig',
                            title: "Configuración global",
                            md: true,
                            fromURL: true,
                            src: ("GlobalConfig.md"),
                        },
                        7: {
                            path: '/docs/plugins',
                            title: "Plugins",
                            md: true,
                            fromURL: true,
                            src: ("PluginDev.md"),
                            subpages: {
                                1: {
                                    path: '/docs/plugins/api',
                                    title: "Comunicación con Plugin API",
                                    md: true,
                                    fromURL: true,
                                    src: ("API.md"),
                                },
                                2: {
                                    path: '/docs/plugins/uso',
                                    title: "Uso de plugins",
                                    md: true,
                                    fromURL: true,
                                    src: ("Plugins.md"),
                                },

                            },
                        },

                    },
            },
            2: {
                path: '/api',
                title: "Plugin API",
                children: {},
                pages:
                    {
                        1: {
                            path: '/api/intro',
                            title: "Creación de plugins",
                            md: true,
                            fromURL: true,
                            src: ("Creaci%C3%B3n-de-plugins.md"),
                        },
                        2: {
                            path: '/api/baseplugin',
                            title: "BasePlugin",
                            md: true,
                            fromURL: true,
                            src: ("BasePlugin.md"),
                        },
                        3: {
                            path: '/api/basepluginvisor',
                            title: "BasePluginVisor",
                            md: true,
                            fromURL: true,
                            src: ("BasePluginVisor.md"),
                        },
                        4: {
                            path: '/api/rich',
                            title: "Plugins Enriquecidos",
                            md: true,
                            fromURL: true,
                            src: ("RichPlugins.md"),
                        },

                    },
            },
        },
    },

};

export const lookForPath = (path) => {
    for (let section in tree) {
        if (tree[section].path === path) {
            return { section: section };
        }
        if (tree[section].children) {
            for (let subsection in tree[section].children) {
                if (tree[section].children[subsection].path === path) {
                    return { section: section, subsection: subsection };
                }
                if (tree[section].children[subsection].pages) {
                    for (let page in tree[section].children[subsection].pages) {
                        if (tree[section].children[subsection].pages[page].path === path) {
                            return { section: section, subsection: subsection, page: page };
                        }
                        if (tree[section].children[subsection].pages[page].subpages) {
                            for (let subpage in tree[section].children[subsection].pages[page].subpages) {
                                if (tree[section].children[subsection].pages[page].subpages[subpage].path === path) {
                                    return { section: section, subsection: subsection, page: page, subpage: subpage };
                                }
                            }
                        }
                    }
                }
            }
        }
        if (tree[section].pages) {
            for (let page in tree[section].pages) {
                if (tree[section].pages[page].path === path) {
                    return { section: section, page: page };
                }
                if (tree[section].pages[page].subpages) {
                    for (let subpage in tree[section].pages[page].subpages) {
                        if (tree[section].pages[page].subpages[subpage].path === path) {
                            return { section: section, page: page, subpage: subpage };
                        }
                    }
                }
            }
        }
    }
    return null;
};
