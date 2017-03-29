export function BasicImage(base) {
    return {
        init: function () {
            base.registerExtraFunction(this.imageClick, "click");
        },
        getRenderTemplate: function (state) {
            return "<div class= \"containerBasicImage\" >" +
                   "<img class= \"basicImageClass\" " +
                   "src=\"" + state.url + "\" onclick='$dali$.imageClick()'/>" +
                   "</div>";
        },
        imageClick: function (e) {
        }
    };
}
