Templates = {};
Templates.load = function() {
	_.each(document.getElementsByTagName('script'), function(s) {
		if (s.type == "text/template")
			Templates[s.id] = _.template($(s).html());
	});	
}
