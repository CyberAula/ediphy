var glob = require("glob");

var toCamelCase = function(str) {
  return str.toLowerCase()
    .replace( /[-_]+/g, ' ')
    .replace( /[^\w\s]/g, '')
    .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
    .replace( / /g, '' );
};


module.exports = {
	getJSHintExludeNames: function(){
		var files = glob.sync("plugins/*/package.json");
		var final_array = [];
		for(package in files){
			var json = require("../" + files[package]);
			var dependencies = json.dependencies;
			var config = json.config;
			Object.keys(dependencies).map(function(e){
				if(json.config && json.config.aliases && json.config.aliases[e]){
					final_array.push(json.config.aliases[e]);
				} else {
					final_array.push(toCamelCase(e));
				}
			});
		}
		return final_array;
	},
	getExposeString: function(){
		var files = glob.sync("plugins/*/package.json");
		var final_array = [];
		for(package in files){
			var final_string = "";
			var expose_string = "expose?"
			var json = require("../" + files[package]);
			var dependencies = json.dependencies;
			var config = json.config;
			Object.keys(dependencies).map(function(e){
				if(json.config && json.config.aliases && json.config.aliases[e]){
					final_array.push({test: require.resolve(e),
														loader: json.config.aliases[e]});
				} else {
					final_array.push({
						test: require.resolve(e),
						loader: expose_string + toCamelCase(e)
					});
				}
			});
		}
		return final_array;
	},
	getPluginProvider: function(){
		var files = glob.sync("plugins/*/package.json");
		var final_object = {};
		for(package in files){
			var json = require("../" + files[package]);
			var dependencies = json.dependencies;
			var config = json.config;
			Object.keys(dependencies).map(function(e){
					final_object[toCamelCase(e)] = e;
			});
		}
		return final_object;
	}
};


/*
module.exports = global["Dali"] = require("-!/home/berto/Repositorios/dali_editor/node_modules/babel-loader/index.js?presets[]=es2015!/home/berto/Repositorios/dali_editor/node_modules/jshint-loader/index.js!/home/berto/Repositorios/dali_editor/core/temp_hack.es6");
module.exports = global["jQuery"] = require("-!/home/berto/Repositorios/dali_editor/node_modules/expose-loader/index.js?$!/home/berto/Repositorios/dali_editor/node_modules/expose-loader/index.js?window.jQuery!/home/berto/Repositorios/dali_editor/node_modules/jquery/dist/jquery.js");
module.exports = global["$"] = require("-!/home/berto/Repositorios/dali_editor/node_modules/expose-loader/index.js?window.jQuery!/home/berto/Repositorios/dali_editor/node_modules/jquery/dist/jquery.js");
if(!global["window"]) global["window"] = {};
module.exports = global["window"]["jQuery"] = require("-!/home/berto/Repositorios/dali_editor/node_modules/jquery/dist/jquery.js");
*/
