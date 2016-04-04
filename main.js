var h = require('virtual-dom/h')
var main = require('main-loop')
var loop = main({ n: 0 }, render, require('virtual-dom'))
document.querySelector('#content').appendChild(loop.target)

var event = new Event('build');
var inc_event = new Event('increment_counter');


//-- Model
function CounterModel() {
    this._count = 0;
}

CounterModel.prototype.value = function() {
    return this._count;
}

var counter = new CounterModel();

//-- Update
CounterModel.prototype.increment = function() {
    this._count = this._count + 1;
    this.view();
}

CounterModel.prototype.decrement = function() {
    this._count = this._count - 1;
    this.view();
}

// -- View
CounterModel.prototype.view = function() {

    return h('div', [
	h('h1', 'counter ' + this.value() + ' times'),
	h('button', { onclick: inc_counter }, 'inc!'),
	h('button', { onclick: dec_counter }, 'dec!')
    ])
    function inc_counter () {
	loop.update({ n: state.n + 1 })
    }
    function dec_counter () {
	loop.update({ n: state.n + 1 })
    }
    var div = document.createElement("div");
    var button = document.createElement("input");
    button.type = "button";
    button.value = "increment";
    button.onclick = function () {
	document.dispatchEvent(inc_event);
    }
    div.appendChild(button);
    var node = document.createTextNode("Counter : " + this._count);
    div.appendChild(node);
    div.appendChild(button);
    document.body.appendChild(div);
}


// Listen for the event.
document.addEventListener('build', function (e) {
    var para = document.createElement("p");
    var node = document.createTextNode("Counter : " + counter._count);
    para.appendChild(node);
    document.body.appendChild(node);
}, false);


document.addEventListener('increment_counter', function (e) {
    counter.increment();
    
}, false);

//counter.view()

// Dispatch the event.
document.dispatchEvent(inc_event);
document.dispatchEvent(event);


function render (state) {
    counter.view();
}
