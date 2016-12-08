var fs = require("fs");
var glob = require("glob");
var async = require("async");

function LocalDependenciesPlugin(){
}


LocalDependenciesPlugin.prototype.apply = function(compiler){
	compiler.plugin("compile",function(compilation,callback){
		async.series([
			function(){
				glob("./plugins/*/package.json", function(err,files){
					var dependencies_array = [];
					for(var f = 0; f < files.length; f++){
						var json = JSON.parse(require(files[f]));
						if(json.config && json.config.localDependencies){
							Object.keys(json.config.localDependencies).each(function(e){
								dependencies_array.push(e);
							});
						}
					}		
				})
			},

			],function(e){
				fs.writeFile("./plugins/plugin_dependencies_loader.js",
				"module.exports = {requireAll: function(){"+
				"require('!script-loader!"+
				"./../dist/js/jQuery/jsPlumb/jquery.jsPlumb-1.4.1-all-min.js'"+
				");}};"
				);
		});
	});
};

module.exports = LocalDependenciesPlugin;