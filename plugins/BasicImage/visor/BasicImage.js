export function BasicImage(base) {
    return {
        init: function () {
            base.registerExtraFunction(this.imageClick, "click");
        },
        getRenderTemplate: function (state) {
            return "<div style=\"width: 100%; height: 100%\">" +
                "<img style=\"width: 100%; " +
                "height: 100%;\"" +
                "src=\"" + state.url + "\" onclick='$dali$.imageClick()'/>" +
                "</div>";
        },
        imageClick: function (e) {
        }
    };
}
