import { getThemeColors, getThemeFont, sanitizeThemeToolbar } from "../../../common/themes/themeLoader";
import { getBackground } from "../../../common/themes/backgroundLoader";

/**
 * Header configuration. Does NOT apply to plugins' toolbar.
 * @param name type of title
 * @param value value of the field
 * @param accordions
 * @param toolbarProps
 */
export function handleCanvasToolbar(name, value, accordions, toolbarProps) {
    let themeToolbar = sanitizeThemeToolbar(toolbarProps.viewToolbars[toolbarProps.navItemSelected]);
    switch (name) {
    // change page/slide title
    case "background":
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, value);
        break;
        // Change content
    case 'documentSubtitleContent':
    case 'documentTitleContent':
    case 'numPageContent':
    case 'viewName':
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, {
            [name]: value,
        });
        break;
        // preview / export document
    case 'page_display':
        toolbarProps.handleNavItems.onNavItemToggled(toolbarProps.navItemSelected);
        break;
        // Do or do not display the following
    case 'breadcrumb':
    case 'courseTitle':
    case 'documentSubtitle':
    case 'documentTitle':
    case 'numPage':
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, {
            [name]: value ? 'reduced' : 'hidden',
        });
        break;
    case 'theme':
        const currentView = toolbarProps.viewToolbars[toolbarProps.navItemSelected];
        const hasTheme = currentView.hasOwnProperty('theme');
        const wasCustomFont = hasTheme && currentView.hasOwnProperty('font') && (currentView.font !== getThemeFont(currentView.theme));
        const wasCustomColor = hasTheme && currentView.hasOwnProperty('colors') && currentView.colors.themeColor1 !== getThemeColors(currentView.theme).themeColor1;
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, {
            theme: value,
            themeBackground: 0,
            background: getBackground(value, 0),
            font: wasCustomFont ? currentView.font : getThemeFont(value),
            colors: wasCustomColor ? currentView.colors : getThemeColors(value),
        });
        break;
    case 'theme_background':
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, {
            themeBackground: value,
            background: value,
        });
        break;
    case 'theme_font':
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, { font: value });
        break;
    case 'theme_primary_color':
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, {
            colors: { ...themeToolbar.colors, themeColor1: value },
        });
        break;
    case 'theme_secondary_color':
        toolbarProps.handleToolbars.onViewToolbarUpdated(toolbarProps.navItemSelected, {
            colors: { ...themeToolbar.colors, themeColor2: value },
        });
        break;
    case 'weight':
        toolbarProps.onScoreConfig(toolbarProps.navItemSelected, 'weight', value);
        break;
    default:
        break;
    }
}
