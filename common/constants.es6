export const ID_PREFIX_SECTION = "se-";
export const ID_PREFIX_PAGE = "pa-";
export const ID_PREFIX_SLIDE = "sl-";
export const ID_PREFIX_BOX = "bo-";
export const ID_PREFIX_FILE = "file-";
export const ID_PREFIX_SORTABLE_BOX = "bs-";
export const ID_PREFIX_SORTABLE_CONTAINER = "sc-";
export const ID_PREFIX_CONTAINED_VIEW = "cv-";
export const ID_PREFIX_RICH_MARK = "rm-";
export const SECTIONS_HAVE_CONTENT = false;
export const FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR';
export const FILE_DELETE_ERROR = 'FILE_DELETE_ERROR';
export const FILE_UPLOADING = 'FILE_UPLOADING';
export const FILE_DELETING = 'FILE_DELETING';
export const FILE_NOT_ALLOWED = 'FILE_NOT_ALLOWED';
export const PAGE_TYPES = {
    SLIDE: "slide",
    DOCUMENT: "document",
    SECTION: "section",
};

export const extensions = [
    'all',
    'image',
    'audio',
    'video',
    'csv',
    'pdf',
    'scormpackage',
    'webapp',
    'swf',
    'xml',
    'obj',
    'edi',
    'vish',
];

export const MESSAGE_TYPES = {
    NOTIFICATION: "notification",
    FAVOR: "favor",
};

export const defaultUI = {
    alert: null,
    pluginTab: '',
    hideTab: 'show',
    visorVisible: false,
    richMarksVisible: false,
    markCreatorVisible: false,
    currentRichMark: null,
    carouselShow: true,
    carouselFull: false,
    serverModal: false,
    catalogModal: false,
    grid: false,
    pluginConfigModal: false,
    publishing: false,
    showGlobalConfig: false, // cookies.get("ediphy_visitor"),
    showStyleConfig: false,
    blockDrag: false,
    showFileUpload: false,
    fileUploadTab: 0,
    showExitModal: false,
    showTour: false,
    showHelpButton: false,
    showExportModal: false,
    fileModalResult: { id: undefined, value: undefined },
};
