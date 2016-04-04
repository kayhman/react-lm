var h = require('virtual-dom/h')
var createElement = require('virtual-dom/create-element');
var CounterModel = require('./counter');


// Dispatch the event.
function render (model1, model2) {
    var tree = h('div');
    var rootNode = createElement(tree);
    rootNode.appendChild(model1.render());
    rootNode.appendChild(model2.render());
    return rootNode;
}

var model1 = new CounterModel()
var model2 = new CounterModel()
var rootNode = render(model1, model2);

document.body.appendChild(rootNode);  

model1.init();
model2.init();
