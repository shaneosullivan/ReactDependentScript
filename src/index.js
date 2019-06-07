import React, { Component } from "react";

// Globally track the nodes previously inserted so each is only inserted once
let scriptUrls = {};
let sheetUrls = {};

function isBrowser() {
  return typeof document !== "undefined" && typeof window !== "undefined";
}

export default class ReactDependentScript extends Component {
  constructor() {
    super();
    this.state = { loadingCount: 0 };
  }

  componentWillMount() {
    if (!isBrowser()) {
      // When mounted during server side rendering, do not
      // attempt to mutate the document, as it will break.
      return;
    }
    const { scripts, stylesheets } = this.props;

    // Load the stylesheets first, but don't wait for them to complete, as
    // nothing will break.
    if (stylesheets && stylesheets.length > 0) {
      stylesheets.forEach(sheet => {
        if (!sheetUrls[sheet]) {
          const sheetNode = document.createElement("link");
          sheetNode.setAttribute("rel", "stylesheet");
          sheetNode.setAttribute("href", sheet);
          document.body.appendChild(sheetNode);
        }
        sheetUrls[sheet] = 1;
      });
    }

    // Look for the script in the body. If not there, inject it.
    if (scripts && scripts.length > 0) {
      const unloadedScripts = scripts.filter(script => {
        return !scriptUrls[script.source || script];
      });

      this.setState({ loadingCount: unloadedScripts.length }, () => {
        unloadedScripts.forEach(script => {
          let src = script.source || script;
          scriptUrls[src] = 1;
          const scriptNode = document.createElement("script");
          scriptNode.type = "text/javascript";
          scriptNode.src = src;
          scriptNode.addEventListener("load", this._handleLoad);
          scriptNode.addEventListener(
            "error",
            (script.onerror, // error callback
            script.not_required && this._handleLoad)
            // using not_required,
            // user can choose to render children,
            // even on error
          );
          document.body.appendChild(scriptNode);
        });
      });
    }
  }

  render() {
    const { renderChildren, children, loadingComponent } = this.props;
    if (isBrowser() && this.state.loadingCount === 0) {
      if (renderChildren) {
        return renderChildren();
      }
      return children;
    } else {
      return loadingComponent || null;
    }
  }

  _handleLoad = () => {
    this.setState({ loadingCount: this.state.loadingCount - 1 });
  };
}
