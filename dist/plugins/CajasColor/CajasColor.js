var CajasColor = (function(){
    return new Dali.Plugin({
        getConfig: function(){
            return {
                name: 'CajasColor',
                category: 'text',
                icon: 'fa-object-ungroup'
            }
        },
        getToolbar: function(){
            return [
                {
                    name: 'nBoxes',
                    humanName: 'Number of boxes',
                    type: 'number',
                    value: 2,
                    max: 8,
                    min: 1,
                    autoManaged: false,
                    tab: 'Main',
                    accordion: 'Number'
                }
            ]
        },
         getSections: function(){
            return [
                {
                    tab: 'Main', 
                    accordion: ['Number']
                },
                {
                    tab: 'Other', 
                    accordion: ['Extra']
                },

            ];
        },
        getInitialState: function(){
            return {nBoxes: 2};
        },
        getRenderTemplate: function(state){
            var boxes = ""
            var height = (state.nBoxes != 0 )? (100/state.nBoxes):100
            var colors = ['blue', 'red', 'green', 'yellow']
            for(let i = 0; i<state.nBoxes; i++){
                boxes+="<div style='background-color: "+colors[i%colors.length]+"; height: "+height+"%'><plugin /></div>"
            }
            return boxes
            //return "<div style='background-color: red; height: 50%'><plugin /></div><div style='background-color: blue; height: 50%'><plugin /></div>";
        },
        handleToolbar: function(name, value){
            if(name === 'nBoxes'){
                CajasColor.setState(name, value);
            }
        }
    })
})();
