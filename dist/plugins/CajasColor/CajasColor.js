var CajasColor = (function(){
    return new Dali.Plugin({
        getConfig: function(){
            return {
                name: 'CajasColor',
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
            return "<div style='background-color: red; height: 50%'><plugin /></div><div style='background-color: blue; height: 50%'><plugin /></div>";
        },
        handleToolbar: function(name, value){
            if(name === 'nBoxes'){
                CajasColor.setState(name, value);
            }
        }
    })
})();
