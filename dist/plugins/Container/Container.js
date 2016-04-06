var Container = (function(){
    return new Dali.Plugin({
        getConfig: function(){
            return {
                name: 'Container',
                category: 'multimedia'
            }
        },
        getRenderTemplate: function(state){
            return "<plugin />";
        }
    })
})();

