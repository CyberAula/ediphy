var Container = (function(){
    return new Dali.Plugin({
        getConfig: function(){
            return {
                name: 'Container',
                category: 'multimedia',
                icon: 'fa-object-group'
            }
        },
        getRenderTemplate: function(state){
            return "<plugin />";
        }
    })
})();

