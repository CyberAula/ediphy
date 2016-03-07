var CajasColor = (function(){
    return new Dali.Plugin({
        getConfig: function(){
            return {
                name: 'Cajas Color',
                category: 'text'
            }
        },
        getToolbar: function(){
            return [
                {
                    name: 'nBoxes',
                    humanName: 'Number of boxes',
                    type: 'number',
                    value: 3,
                    min: 1,
                    autoManaged: false
                }
            ]
        },
        getInitialState: function(){
            return {nBoxes: 3};
        },
        getRenderTemplate: function(state){
            return "<div style='background-color: red; padding: 10px'><plugin plugin-data-id='caja'/></div><div style='background-color: blue; padding: 10px'><plugin plugin-data-id='caja2'/></div>";
        },
        handleToolbar: function(name, value){
            if(name === 'nBoxes'){
                CajasColor.setState(name, value);
            }
        }
    })
})();
