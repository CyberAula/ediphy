/*
 *		This plugin is in charge to get all dependencies from package.json inside plugins folder
 *		and inject them into the global context.
 *		Dependencies are obtained from: package.json -> dependencies and config.localDepdencies
 *		Also: config aliases are permitted as name for the global dependencies
 *
 *		EXAMPLE OF A PLUGIN PACKAGE.JSON:
 		{
			"name": "plugin_name", 	//(mandatory field)
			"version" : "1.0.0", 	//(mandatory field)
			"dependencies": {
				"dependency_name_from_npm": "version",
			},
			config:{
				"localDependencies":{
					"name": "path_to_library"
				},
				"aliases": {
					"name_of_dependency": "name_to_export"
				},
				"css": {
					"name" : "path to css"
				}
			}
		}
 * */


var glob = require("glob");

var toCamelCase = function(str) {
  return str.toLowerCase()
    .replace( /[-_]+/g, ' ')
    .replace( /[^\w\s]/g, '')
    .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
    .replace( / /g, '' );
};


module.exports = {
	// Gets jsHint names to be asumed as already included
	getJSHintExludeNames: function(){
		var files = glob.sync("plugins/*/package.json");
		var final_array = [];
		for(let package in files){
			var json = require("../" + files[package]);
			var dependencies = json.dependencies;
			var config = json.config;
			if (dependencies){
				Object.keys(dependencies).map(function(e){
					if(config && config.aliases && config.aliases[e]){
						final_array.push(config.aliases[e]);
					} else {
						final_array.push(toCamelCase(e));
					}
				});
			}
			if(config && config.localDependencies){
				var localDependencies = config.localDependencies;
				Object.keys(localDependencies).map(function(e){
					final_array.push(e);
				});
			}
		}
		return final_array;
	},
	// Gets elements needed to be added as loader to be exposed or imported
	getExposeString: function(){
		var files = glob.sync("plugins/*/package.json");
		var final_array = [];
		for(let package in files){
			var final_string = "";
			var expose_string = "expose-loader?"
			var json = require("../" + files[package]);
			var dependencies = json.dependencies;
			var config = json.config;
			if (dependencies){
				Object.keys(dependencies).map(function(e){
					if(config && config.aliases && config.aliases[e]){
						final_array.push({
							test: require.resolve(e),
							loader: expose_string + json.config.aliases[e]
						});
					} else {
						final_array.push({
							test: require.resolve(e),
							loader: expose_string + toCamelCase(e)
						});
					}
				});
			}

		}
		return final_array;
	},
	// Get names needed to add to plugin provider
	getPluginProvider: function(){
		var files = glob.sync("plugins/*/package.json");
		var final_object = {};
		for(let package in files){
			var json = require("../" + files[package]);
			var dependencies = json.dependencies;
			var config = json.config;
			if(dependencies){
				Object.keys(dependencies).map(function(e){
					if(config && config.aliases && config.aliases[e]){
						final_object[config.aliases[e]] = e;
					} else {
						final_object[toCamelCase(e)] = e;
					}
				});
			}
		}
		return final_object;
	}
};
