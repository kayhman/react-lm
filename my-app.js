var h = require('virtual-dom/h')
var CreateModel = require('./react-lm');
var CounterModel = require('./counter');
var ClickCounterModel = require('./click-counter');

var model1 = new CounterModel();
var model2 = new CounterModel();
var model3 = new ClickCounterModel();
var MyAppModel = CreateModel({model1:null, model2:null, model3:null});

//-- Update
MyAppModel.addUpdate("decrement", function () {
})

MyAppModel.addUpdate("increment", function () {
})


// -- View
MyAppModel.setView(function() {
    var model = this;
    var model1 = this.getState().model1;
    var model2 = this.getState().model2;
    var model3 = this.getState().model3;

    var vdom = h('div', [
	CounterModel.view(model1),
	ClickCounterModel.view(model1),
	CounterModel.view(model2),
	ClickCounterModel.view(model3),	
    ]);
    
    return vdom;
});


module.exports = MyAppModel;
