var Handlebars = require('handlebars');

var template = "<h1>{{hello}}</h1>"; // fs.readSync(thetempalte)
var render = Handlebars.compile(template);

var data = {} // fs.readSync(some.json). Maybe manipulate it?
var html = render(data);

console.log(html); // fs.writeSync(filename, html).





