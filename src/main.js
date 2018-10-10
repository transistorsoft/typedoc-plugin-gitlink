var plugin = require('./GitLinkPlugin');

module.exports = function(PluginHost) {
    var app = PluginHost.owner;

    //app.options.addDeclaration({name: 'sourcefile-url-map'});
    //app.options.addDeclaration({name: 'sourcefile-url-prefix'});

    app.converter.addComponent('gitlink', plugin.GitLinkPlugin);
};