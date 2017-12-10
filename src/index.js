import React, { Component } from 'react';

// Globally track the nodes previously inserted so each is only inserted once
let scriptUrls = {};
let sheetUrls = {};

export default class ReactDependentScript extends Component {
  constructor() {
    super();
    this.state = { loadingCount: 0 };
  }

  componentWillMount() {
    const scripts = this.props.scripts;
    const stylesheets = this.props.stylesheets;

    // Load the stylesheets first, but don't wait for them to complete, as
    // nothing will break.
    if (stylesheets && stylesheets.length > 0) {
      stylesheets.forEach(sheet => {
        if (!sheetUrls[sheet]) {
          const sheetNode = document.createElement('link');
          sheetNode.setAttribute('rel', 'stylesheet');
          sheetNode.setAttribute('href', sheet);
          document.body.appendChild(sheetNode);
        }
        sheetUrls[sheet] = 1;
      });
    }

    // Look for the script in the body. If not there, inject it.
    if (scripts && scripts.length > 0) {
      const unloadedScripts = scripts.filter(script => {
        return !scriptUrls[script];
      });

      this.setState({ loadingCount: unloadedScripts.length }, () => {
        unloadedScripts.forEach(script => {
          // if (!scriptUrls[script])
          scriptUrls[script] = 1;
          const scriptNode = document.createElement('script');
          scriptNode.type = 'text/javascript';
          scriptNode.src = script;
          scriptNode.addEventListener('load', this._handleLoad);
          document.body.appendChild(scriptNode);
        });
      });
    }
  }

  render() {
    if (this.state.loadingCount === 0) {
      if (this.props.renderChildren) {
        return this.props.renderChildren();
      }
      return this.props.children;
    } else {
      return this.props.loadingComponent || null;
    }
  }

  _handleLoad = () => {
    this.setState({ loadingCount: this.state.loadingCount - 1 });
  };
}
