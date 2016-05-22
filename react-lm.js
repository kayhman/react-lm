var h = require('virtual-dom/h')
var createElement = require('virtual-dom/create-element');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');

//-- GenericModel
var createModel = function (state) {
    //-- Model
    var Model = function() {
	this._state = state;
	this._id = Math.floor((Math.random() * 1000) + 1);
	this._tree = null;
	this._rootNode = null;
	var model = this;
	window.addEventListener("load", function(e) {
	    if(model.element()) {
		model.init();
	    }
	})
    }
    
    Model.prototype.init = function() {
	for(idx in this._updates) {
	    var update = this._updates[idx];
	    this.addListener(update);
	}
	this.addListener("refresh");
    }
    
    //-- Update
    Model.prototype.addListener = function(event_name) {
	var model = this;
	this.element().addEventListener(event_name, 
					function (e) {
					    model[event_name]();
					},
					false);
    }
    
    Model.addUpdate = function (update_name, update) {
	Model.prototype[update_name] = function() {
	    update.call(this);
	    this.address("refresh");
	}
	if(! ("_updates" in Model.prototype))
	    Model.prototype["_updates"] = []
	Model.prototype["_updates"].push(update_name)
    } 
    
    Model.prototype.forward = function(event_name, model) {
	this.element().addEventListener(event_name, 
					function (e) {
					    model.address(event_name);
					},
					false);
    }

    Model.prototype.getState = function() {
	return this._state;
    }

    Model.prototype.setState = function(state) {
	this._state = state;
	if(this.element())
	    this.address("refresh");
    }
    
    Model.prototype.element = function() {
	var elem = document.getElementById(this._id)
	return elem
    }

    Model.prototype.address = function(event_name) {
	this.element().dispatchEvent(new CustomEvent(event_name, {date: this._state}));
    }

    // --View
    Model.setView = function(view) {
	Model.view = function (model) {
	    model._tree = view.call(model);
	    return h('div', {id : model._id}, model._tree)
	}
	//model.element().addEventListener("refresh", function(e) {
	//    view.call(model);
	//});
    }

    Model.prototype.render = function() {
	var vdom = Model.view(this)
	this._rootNode = createElement(vdom);
	return this._rootNode;
    }
    Model.prototype.refresh = function() {
	var newTree = Model.view(this)
	var patches = diff(this._tree, newTree);
	this._rootNode = patch(this.element(), patches);
	this._tree = newTree;
    }
    return Model;
}

module.exports = createModel;
