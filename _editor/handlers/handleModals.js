import { updateUI } from "../../common/actions";

export default function(self) {
    return {
        openFileModal: (id = undefined, accept) => {
            self.props.dispatch((updateUI({
                showFileUpload: accept,
                fileUploadTab: 1,
                fileModalResult: { id, value: undefined },
            })));
        },

        openConfigModal: (id) => self.props.dispatch(updateUI({ pluginConfigModal: id })),

        showTour: () => {
            self.props.dispatch(updateUI({
                showTour: true,
                showHelpButton: false,
            }));
        },

        toggleTour: (tour) => self.props.dispatch(updateUI({ showTour: tour })),
    };
}
