Dali.Visor.Plugins["BasicImage"] = function (){
    return {
        getRenderTemplate: function (state) {
            return "<div style=\"width: 100%; height: 100%\">" +
                "<img style=\"width: 100%; " +
                "height: 100%; " +
                "border-radius: " + state.borderRadius + "%; " +
                "border: " + state.borderSize + "px " + state.borderStyle + " " + state.borderColor + ";\" " +
                "src=\"" + state.url + "\" onclick='$dali$.imageClick()'/>" +
                "</div>";
        },
        imageClick: function(e)
        {
            console.log(e);
            alert("Miau");
        }
    }
}
