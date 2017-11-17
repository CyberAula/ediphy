﻿import i18n from 'i18next';
// export const WIKI_BASE_URL = "http://localhost:8081/";
export const WIKI_BASE_URL = "https://raw.githubusercontent.com/wiki/ging/ediphy/";
export const editURL = (src) => {
    let split = src.split("/").pop().replace('.md', '');
    let url = "https://github.com/ging/ediphy/wiki/" + split + "/_edit";
    return url;
};

export const srcTree = (lang = "es") => {
    let langPath = lang === "en" ? "" : "_" + lang;
    return {
        1: {
            path: '/',
            title: i18n.t("title.Home"),
            children: {},
            self: true,
            componentName: "Home",
        },
        2: {
            path: '/about',
            title: i18n.t("title.About"),
            children: {},
            self: true,
            componentName: "About",
        },
        3: {
            path: '/manual',
            title: i18n.t("title.UserManual"),
            children: {},
            pages: {
                1: {
                    path: '/manual/intro',
                    title: i18n.t("title.UserManual"),
                    md: true,
                    fromURL: true,
                    src: ("Manual/Manual_Intro" + langPath + ".md"),
                },
                2: {
                    path: '/manual/estructura',
                    title: i18n.t("title.CourseStructure"),
                    md: true,
                    fromURL: true,
                    src: ("Manual/Manual_Estructura" + langPath + ".md"),
                },
                3: {
                    path: '/manual/plugins',
                    title: i18n.t("title.Plugins"),
                    md: true,
                    fromURL: true,
                    src: ("Manual/Manual_Plugins" + langPath + ".md"),
                },
                4: {
                    path: '/manual/acciones',
                    title: i18n.t("title.Additional"),
                    md: true,
                    fromURL: true,
                    src: ("Manual/Manual_Actions" + langPath + ".md"),
                },
            },
        },
        4: {
            title: i18n.t("title.Docs"),
            children: {
                1: {
                    path: '/docs',
                    title: "Ediphy",
                    children: {},
                    pages:
                    {
                        1: {
                            path: '/docs/intro',
                            title: i18n.t("title.Intro"),
                            md: true,
                            fromURL: true,
                            src: ("Doc" + langPath + ".md"),
                            hideTitle: true,
                        },
                        2: {
                            path: '/docs/estructura',
                            title: i18n.t("title.ProjectStructure"),
                            md: true,
                            fromURL: true,
                            src: ("Estructura" + langPath + ".md"),
                        },
                        3: {
                            path: '/docs/react',
                            title: "React",
                            md: true,
                            fromURL: true,
                            src: ("React" + langPath + ".md"),
                            subpages: {
                                1: {
                                    path: '/docs/react/componentes',
                                    title: i18n.t("title.Componentes"),
                                    md: true,
                                    fromURL: true,
                                    src: ("Componentes" + langPath + ".md"),
                                    react_docgen: true,
                                },
                            },
                        },
                        4: {
                            path: '/docs/redux',
                            title: "Redux",
                            md: true,
                            fromURL: true,
                            src: ("Redux" + langPath + ".md"),
                            subpages: {
                                1: {
                                    path: '/docs/redux/estado',
                                    title: i18n.t("title.AppState"),
                                    md: true,
                                    fromURL: true,
                                    src: ("Estado-de-la-aplicación" + langPath + ".md"),
                                },
                                2: {
                                    path: '/docs/redux/acciones',
                                    title: i18n.t("title.Actions"),
                                    md: true,
                                    fromURL: true,
                                    src: ("Acciones" + langPath + ".md"),
                                },
                                3: {
                                    path: '/docs/redux/reducers',
                                    title: i18n.t("title.Reducers"),
                                    md: true,
                                    fromURL: true,
                                    src: ("Reductores" + langPath + ".md"),
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
                            title: i18n.t("title.GlobalConfig"),
                            md: true,
                            fromURL: true,
                            src: ("GlobalConfig" + langPath + ".md"),
                        },
                        7: {
                            path: '/docs/plugins',
                            title: i18n.t("title.Plugins"),
                            md: true,
                            fromURL: true,
                            src: ("PluginDev" + langPath + ".md"),
                            subpages: {
                                1: {
                                    path: '/docs/plugins/api',
                                    title: i18n.t("title.Communication"),
                                    md: true,
                                    fromURL: true,
                                    src: ("API" + langPath + ".md"),
                                },
                                2: {
                                    path: '/docs/plugins/uso',
                                    title: i18n.t("title.PluginUse"),
                                    md: true,
                                    fromURL: true,
                                    src: ("Plugins" + langPath + ".md"),
                                },

                            },
                        },

                    },
                },
                2: {
                    path: '/api',
                    title: i18n.t("title.PluginAPI"),
                    children: {},
                    pages:
                    {
                        1: {
                            path: '/api/intro',
                            title: i18n.t("title.Creacion"),
                            md: true,
                            fromURL: true,
                            src: ("Creaci%C3%B3n-de-plugins" + langPath + ".md"),
                        },
                        2: {
                            path: '/api/baseplugin',
                            title: i18n.t("title.BasePlugin"),
                            md: true,
                            fromURL: true,
                            src: ("BasePlugin" + langPath + ".md"),
                        },
                        3: {
                            path: '/api/basepluginvisor',
                            title: i18n.t("title.BasePluginVisor"),
                            md: true,
                            fromURL: true,
                            src: ("BasePluginVisor" + langPath + ".md"),
                        },
                        4: {
                            path: '/api/rich',
                            title: i18n.t("title.RichPlugins"),
                            md: true,
                            fromURL: true,
                            src: ("RichPlugins" + langPath + ".md"),
                        },

                    },
                },
            },
        },
        5: {
            isExternal: true,
            path: "demo/editor.html",
            title: i18n.t("title.LiveDemo"),
            children: {},
            self: true,
        },

    };};

export const lookForPath = (path) => {
    let tree = srcTree();
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
