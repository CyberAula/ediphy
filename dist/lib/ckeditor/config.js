CKEDITOR.editorConfig = function (config) {
    config.skin = 'bootstrapck';
    config.linkJavaScriptLinksAllowed = true;
    config.linkShowAdvancedTab = false;
    config.dialog_noConfirmCancel = true;
    config.pasteFromWordRemoveFontStyles = false;
    config.pasteFromWordRemoveStyles = false;
    config.allowedContent = true;
    config.entities_latin = false;
    config.entities_greek = false;
    config.fillEmptyBlocks = false;

    config.toolbarGroups = [
        {name: 'document', groups: ['document', 'mode', 'doctools']},
        {name: 'clipboard', groups: ['clipboard', 'undo']},
        {name: 'editing', groups: ['find', 'selection', 'spellchecker', 'editing']},
        {name: 'forms', groups: ['forms']},
        {name: 'basicstyles', groups: ['basicstyles', 'cleanup']},
        {name: 'links', groups: ['links']},
        {name: 'insert', groups: ['insert']},
        '/',
        {name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi', 'paragraph']},
        {name: 'styles', groups: ['styles']},
        {name: 'colors', groups: ['colors']},
        {name: 'tools', groups: ['tools']},
        {name: 'others', groups: ['others']},
        {name: 'about', groups: ['about']}
    ];

    config.removeButtons =
        'Anchor,' +
        'Unlink,';

    config.plugins =
        'a11yhelp,' +
        'clipboard,' +
        'contextmenu,' +
        'dialogadvtab,' +
        'enterkey,' +
        'entities,' +
        'filebrowser,' +
        'floatingspace,' +
        'htmlwriter,' +
        'image,' +
        'indentlist,' +
        'indentblock,' +
        'justify,' +
        'link,' +
        'list,' +
        'liststyle,' +
        'magicline,' +
        'pastefromword,' +
        'pastetext,' +
        'removeformat,' +
        'showborders,' +
        'stylescombo,' +
        'tab,' +
        'table,' +
        'tabletools,' +
        'toolbar,' +
        'undo';
};
