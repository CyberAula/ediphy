var fs = require("fs");
var glob = require("glob");
var async = require("async");

function LocalDependenciesPlugin(){
}


LocalDependenciesPlugin.prototype.apply = function(compiler){
	compiler.plugin("after-emit",function(compilation,callback){
		async.series([
			function(callback){
				glob("./plugins/*/package.json", function(err,files){
					var dependencies_array = [];
					for(var f = 0; f < files.length; f++){
						var json = JSON.parse(fs.readFileSync(files[f], 'utf8'));
						if(json.config && json.config.localDependencies){
							Object.keys(json.config.localDependencies).forEach(function(e){
								dependencies_array.push(json.config.localDependencies[e]);
							});
						}
					}
					callback("dependencies", dependencies_array)
				});

			},

			],function(err, results){
				var loader_string = "module.exports = {requireAll: function(){";
				async.each(results[0], function(file, callback){
					var require_string = "require('!script-loader!./..";
					var require_close = "');";
					loader_string += require_string + file + require_close;
					callback();
				}, function(err){
					loader_string += "}};";
					fs.writeFile("./plugins/plugin_dependencies_loader.js", loader_string);
				});

		});
	});
};

module.exports = LocalDependenciesPlugin;
