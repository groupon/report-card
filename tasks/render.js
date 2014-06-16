var Handlebars = require('handlebars');

var template = "<h1>{{hello}}</h1>";
var render = Handlebars.compile(template);

var html = render({hello: 'world'});

console.log(html);





