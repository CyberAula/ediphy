import { changeGlobalConfig, selectIndex, toggleTextEditor, updateViewToolbar } from "../../common/actions";
import Ediphy from "../../core/editor/main";

export default function(self) {
    return {
        onIndexSelected: (id) => self.props.dispatch(selectIndex(id)),

        onTitleChanged: (id = 'title', titleStr) => self.props.dispatch(changeGlobalConfig(id, titleStr)),

        onTextEditorToggled: (caller, value, text, content) => {
            let pluginToolbar = self.props.pluginToolbars[caller];
            if(pluginToolbar && pluginToolbar.pluginId !== "sortable_container") {
                let state = Object.assign({}, pluginToolbar.state, { __text: text });
                let toolbar = Ediphy.Plugins.get(pluginToolbar.pluginId).getToolbar(state);

                self.props.dispatch(toggleTextEditor(caller, value));
                if (!value && text && content) {
                    self.props.dispatch(updateBox(caller, content, toolbar, state));
                }
            }
        },

        onViewTitleChanged: (id, titles) => self.props.dispatch(updateViewToolbar(id, titles)),
    };
}
