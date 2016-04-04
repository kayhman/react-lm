var h = require('virtual-dom/h')
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

//-- GenericModel
function GenericModel() {
}

//-- Model
function CounterModel() {
    this._count = Math.floor((Math.random() * 1000) + 1);
    this._id = Math.floor((Math.random() * 1000) + 1);
}

CounterModel.prototype.init = function() {
    var model = this;
    for(idx in this._updates) {
	var update = this._updates[idx];
	this.addListener(update, function (e) {
	    model[update]();
	});
    }
}

CounterModel.prototype.addListener = function(event_name, listener) {
    this.element().addEventListener(event_name, listener, false);
}

CounterModel.addUpdate = function (update_name, update) {
    CounterModel.prototype[update_name] = function() {
	update.call(this);
	refresh();
    }
    if(! ("_updates" in CounterModel.prototype))
	CounterModel.prototype["_updates"] = []
    CounterModel.prototype["_updates"]. push(update_name)
} 

CounterModel.prototype.value = function() {
    return this._count;
}

CounterModel.prototype.element = function() {
    return document.getElementById(this._id)
}

CounterModel.prototype.address = function(event_name) {
    this.element().dispatchEvent(new Event(event_name));
}

//-- Update

CounterModel.addUpdate("increment", function () {
    this._count = this._count +1;
})

CounterModel.addUpdate("decrement", function () {
    this._count = this._count - 1;
})


// -- View
CounterModel.prototype.view = function() {
    var model = this
    return h('div', {id : this._id}, [
	h('h1', 'counter ' + this.value() + ' times'),
	h('button', { onclick: inc_counter }, 'inc!'),
	h('button', { onclick: dec_counter }, 'dec!')
    ])
    function inc_counter () {
	model.address("increment");
    }
    function dec_counter () {
	model.address("decrement");
    }
}


// Dispatch the event.

function render (model1, model2) {
    var tree = h('div', [model1.view(), model2.view()]); 
    return tree
}

var model1 = new CounterModel()
var model2 = new CounterModel()
var tree = render(model1, model2);      // We need an initial tree
var rootNode = createElement(tree);     // Create an initial root DOM node ...
document.body.appendChild(rootNode);  

model1.init();
model2.init();

function refresh() {
      var newTree = render(model1, model2);
      var patches = diff(tree, newTree);
      rootNode = patch(rootNode, patches);
      tree = newTree;
}
