var h = require('virtual-dom/h')
var createElement = require('virtual-dom/create-element');
var CounterModel = require('./counter');
var ClickCounterModel = require('./click-counter');
var MyAppModel = require('./my-app');


// Dispatch the event.
function render (myApp) {
    var tree = h('div');
    var rootNode = createElement(tree);
    rootNode.appendChild(myApp.render());
    return rootNode;
}

var model1 = new CounterModel();
var model2 = new CounterModel();
var model3 = new ClickCounterModel();


var myApp = new MyAppModel();
myApp.setState({model1:model1, model2:model2, model3:model3})

//var rootNode = render(myApp, model2, model3);
var rootNode = render(myApp);

document.body.appendChild(rootNode);

model1.forward("increment", model3);
model1.forward("decrement", model3);

model2.forward("increment", model3);
model2.forward("decrement", model3);
