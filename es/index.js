function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";

// Globally track the nodes previously inserted so each is only inserted once
var scriptUrls = {};
var sheetUrls = {};

function isBrowser() {
  return typeof document !== "undefined" && typeof window !== "undefined";
}

var ReactDependentScript = function (_Component) {
  _inherits(ReactDependentScript, _Component);

  function ReactDependentScript() {
    _classCallCheck(this, ReactDependentScript);

    var _this = _possibleConstructorReturn(this, _Component.call(this));

    _this._handleLoad = function () {
      _this.setState({ loadingCount: _this.state.loadingCount - 1 });
    };

    _this.state = { loadingCount: 0 };
    return _this;
  }

  ReactDependentScript.prototype.componentWillMount = function componentWillMount() {
    var _this2 = this;

    if (!isBrowser()) {
      // When mounted during server side rendering, do not
      // attempt to mutate the document, as it will break.
      return;
    }
    var _props = this.props,
        scripts = _props.scripts,
        stylesheets = _props.stylesheets;

    // Load the stylesheets first, but don't wait for them to complete, as
    // nothing will break.

    if (stylesheets && stylesheets.length > 0) {
      stylesheets.forEach(function (sheet) {
        if (!sheetUrls[sheet]) {
          var sheetNode = document.createElement("link");
          sheetNode.setAttribute("rel", "stylesheet");
          sheetNode.setAttribute("href", sheet);
          document.body.appendChild(sheetNode);
        }
        sheetUrls[sheet] = 1;
      });
    }

    // Look for the script in the body. If not there, inject it.
    if (scripts && scripts.length > 0) {
      var unloadedScripts = scripts.filter(function (script) {
        return !scriptUrls[script.source || script];
      });

      this.setState({ loadingCount: unloadedScripts.length }, function () {
        unloadedScripts.forEach(function (script) {
          var src = script.source || script;
          scriptUrls[src] = 1;
          var scriptNode = document.createElement("script");
          scriptNode.type = "text/javascript";
          scriptNode.src = src;
          scriptNode.addEventListener("load", _this2._handleLoad);
          scriptNode.addEventListener("error", (script.onerror, // error callback
          script.not_required && _this2._handleLoad
          // using not_required,
          // user can choose to render children,
          // even on error
          ));
          document.body.appendChild(scriptNode);
        });
      });
    }
  };

  ReactDependentScript.prototype.render = function render() {
    var _props2 = this.props,
        renderChildren = _props2.renderChildren,
        children = _props2.children,
        loadingComponent = _props2.loadingComponent;

    if (isBrowser() && this.state.loadingCount === 0) {
      if (renderChildren) {
        return renderChildren();
      }
      return children;
    } else {
      return loadingComponent || null;
    }
  };

  return ReactDependentScript;
}(Component);

export { ReactDependentScript as default };