'use strict';

exports.__esModule = true;
exports.default = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ReactDependentScript = function (_Component) {
  _inherits(ReactDependentScript, _Component);

  function ReactDependentScript() {
    _classCallCheck(this, ReactDependentScript);

    var _this = _possibleConstructorReturn(this, _Component.call(this));

    _this._handleLoad = function () {
      console.log('_handleLoad', _this.state.loadingCount, 'remaining');
      _this.setState({ loadingCount: _this.state.loadingCount - 1 });
    };

    _this.state = { loadingCount: 0 };
    return _this;
  }

  ReactDependentScript.prototype.componentWillMount = function componentWillMount() {
    var _this2 = this;

    var scripts = this.props.scripts;
    var stylesheets = this.props.stylesheets;

    // Load the stylesheets first
    if (stylesheets && stylesheets.length > 0) {
      var unloadedSheets = stylesheets.filter(function (sheet) {
        return !document.body.querySelector('link[data-href=\'' + sheet + '\']');
      });

      unloadedSheets.forEach(function (sheet) {
        var sheetNode = document.createElement('link');
        sheetNode.setAttribute('rel', 'stylesheet');
        sheetNode.setAttribute('href', sheet);
        sheetNode.setAttribute('data-href', sheet);
        document.body.appendChild(sheetNode);
      });
    }

    // Look for the script in the body. If not there, inject it.
    if (scripts && scripts.length > 0) {
      var unloadedScripts = scripts.filter(function (script) {
        return !document.body.querySelector('script[data-src=\'' + script + '\']');
      });

      this.setState({ loadingCount: unloadedScripts.length }, function () {
        unloadedScripts.forEach(function (script) {
          var scriptNode = document.createElement('script');
          scriptNode.type = 'text/javascript';
          scriptNode.src = script;
          scriptNode.setAttribute('data-src', script);
          scriptNode.addEventListener('load', _this2._handleLoad);
          document.body.appendChild(scriptNode);
        });
      });
    }
  };
  //


  ReactDependentScript.prototype.render = function render() {
    if (this.state.loadingCount === 0) {
      if (this.props.renderChildren) {
        return this.props.renderChildren();
      }
      return this.props.children;
    } else {
      return this.props.loadingComponent || null;
    }
  };

  return ReactDependentScript;
}(_react.Component);

exports.default = ReactDependentScript;
module.exports = exports['default'];