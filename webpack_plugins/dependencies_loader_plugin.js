
var toCamelCase = function(str) {
  return str.toLowerCase()
    .replace( /[-_]+/g, ' ')
    .replace( /[^\w\s]/g, '')
    .replace( / (.)/g, function($1) { return $1.toUpperCase(); })
    .replace( / /g, '' );
}

var returning_string = function(dependencies_object){
	console.log(webpack_provider);
	var final_string = "";
	Object.keys(dependencies_object).map(function(dependency){
		var location = require.resolve(dependency);
		var export_dependency = 'module.exports = global["'+toCamelCase(dependency)+'"] = require("-!'+ location+'");';
		final_string += export_dependency;
	})
	return final_string;
};

module.exports = function() {};
module.exports.pitch = function(e){
	//console.log(require(e).dependencies);
	//console.log(this);
	if(this.cacheable) {this.cacheable();}
	var dependencies = require(e).dependencies;
	return returning_string(dependencies);
};


/*
module.exports = global["Dali"] = require("-!/home/berto/Repositorios/dali_editor/node_modules/babel-loader/index.js?presets[]=es2015!/home/berto/Repositorios/dali_editor/node_modules/jshint-loader/index.js!/home/berto/Repositorios/dali_editor/core/temp_hack.es6");
module.exports = global["jQuery"] = require("-!/home/berto/Repositorios/dali_editor/node_modules/expose-loader/index.js?$!/home/berto/Repositorios/dali_editor/node_modules/expose-loader/index.js?window.jQuery!/home/berto/Repositorios/dali_editor/node_modules/jquery/dist/jquery.js");
module.exports = global["$"] = require("-!/home/berto/Repositorios/dali_editor/node_modules/expose-loader/index.js?window.jQuery!/home/berto/Repositorios/dali_editor/node_modules/jquery/dist/jquery.js");
if(!global["window"]) global["window"] = {};
module.exports = global["window"]["jQuery"] = require("-!/home/berto/Repositorios/dali_editor/node_modules/jquery/dist/jquery.js");
*/