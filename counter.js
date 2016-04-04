var h = require('virtual-dom/h')
var CreateModel = require('./react-lm');

var CounterModel = CreateModel(Math.floor((Math.random() * 1000) + 1));

//-- Update
CounterModel.addUpdate("decrement", function () {
    this.setState(this.getState() - 1);
})

CounterModel.addUpdate("increment", function () {
    this.setState(this.getState() +1);
})


// -- View
CounterModel.setView(function() {
    var model = this
    var vdom = h('div', {id : this._id}, [
	h('h1', 'counter ' + this.getState() + ' times'),
	h('button', { onclick: inc_counter }, 'inc!'),
	h('button', { onclick: dec_counter }, 'dec!')
    ]);
    
    return vdom;

    function inc_counter () {
	model.address("increment");
    }
    function dec_counter () {
	model.address("decrement");
    }
});


module.exports = CounterModel;
