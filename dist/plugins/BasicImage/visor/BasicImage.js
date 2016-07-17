Dali.Visor.Plugins["BasicImage"] = function (base){
    return {
        init: function(){
            base.registerExtraFunction(this.imageClick, "click");
        },
        getRenderTemplate: function (state) {
            return "<div style=\"width: 100%; height: 100%\">" +
                "<img style=\"width: 100%; " +
                "height: 100%; " +
                "padding: " + state.padding + "; " +
                "border-radius: " + state.borderRadius + "; " +
                "background-color: " + state.backgroundColor + "; " +
                "opacity: " + state.opacity + "; " +
                "border: " + state.borderSize + " " + state.borderStyle + " " + state.borderColor + ";\" " +
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
