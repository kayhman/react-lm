var h = require('virtual-dom/h')

var CounterModel = require('./counter');

var model1 = new CounterModel();

var rootNode = model1.render();

document.body.appendChild(rootNode);

