var Container = (function(){
    return new Dali.Plugin({
        getConfig: function(){
            return {
                name: 'Container',
                category: 'multimedia',
                icon: 'fa-object-group'
            }
        },
         getSections: function(){
            return [
                {
                    tab: 'Main', 
                    accordion: ['Basic','Box']
                },
                {
                    tab: 'Other', 
                    accordion: ['Extra']
                },

            ];
        },
        getRenderTemplate: function(state){
            return "<plugin />";
        }
    })
})();

