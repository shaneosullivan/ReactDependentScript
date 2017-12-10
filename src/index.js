import React, { Component } from 'react';

export default class ReactDependentScript extends Component {
  constructor() {
    super();
    this.state = { loadingCount: 0 };
  }

  componentWillMount() {
    const scripts = this.props.scripts;
    const stylesheets = this.props.stylesheets;

    // Load the stylesheets first
    if (stylesheets && stylesheets.length > 0) {
      const unloadedSheets = stylesheets.filter(sheet => {
        return !document.body.querySelector(`link[data-href='${sheet}']`);
      });

      unloadedSheets.forEach(sheet => {
        const sheetNode = document.createElement('link');
        sheetNode.setAttribute('rel', 'stylesheet');
        sheetNode.setAttribute('href', sheet);
        sheetNode.setAttribute('data-href', sheet);
        document.body.appendChild(sheetNode);
      });
    }

    // Look for the script in the body. If not there, inject it.
    if (scripts && scripts.length > 0) {
      const unloadedScripts = scripts.filter(script => {
        return !document.body.querySelector(`script[data-src='${script}']`);
      });

      this.setState({ loadingCount: unloadedScripts.length }, () => {
        unloadedScripts.forEach(script => {
          const scriptNode = document.createElement('script');
          scriptNode.type = 'text/javascript';
          scriptNode.src = script;
          scriptNode.setAttribute('data-src', script);
          scriptNode.addEventListener('load', this._handleLoad);
          document.body.appendChild(scriptNode);
        });
      });
    }
  }
  //
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
