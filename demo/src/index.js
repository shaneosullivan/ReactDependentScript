import React, { Component } from 'react';
import { render } from 'react-dom';

import ReactDependentScript from '../../src';
import { CardElement, Elements, StripeProvider, injectStripe } from 'react-stripe-elements';

class Demo extends Component {
  render() {
    return (
      <div>
        <h1>ReactDependentScript Demo</h1>
        <h2>Load Jquery, using the renderChildren callback</h2>
        <ReactDependentScript
          loadingComponent={<div>Loading JQuery...</div>}
          scripts={[
            'https://code.jquery.com/jquery-3.2.1.min.js',
            'https://code.jquery.com/ui/1.12.1/jquery-ui.js'
          ]}
          stylesheets={['https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css']}
          renderChildren={() => {
            // This renderChildren callback is one method of rendering the contents of the
            // ReactDependentScript component.  It can be useful in cases like this where you
            // want to run code that is only available after the script is loaded, such as the
            // $ function from jQuery.

            // Note the use of the $ jQuery function, and inserting a jQueryUI date picker
            return (
              <div>
                <div>JQuery & JQueryUI script is loaded, here is a count and a date picker!</div>
                <div>
                  Found {$('*').length} nodes in the page
                </div>
                <JQueryPluginExample />
              </div>
            );
          }}
        />
        <h2>Load Stripe, using child components</h2>
        <div style={{ maxWidth: '500px' }}>
          {/* This example simply puts the components to render after the script is loaded
              as child components
            */}
          <ReactDependentScript
            loadingComponent={<div>Loading Stripe...</div>}
            scripts={['https://js.stripe.com/v3/']}
          >
            <div>Stripe script is loaded, here is your card f!</div>
            <StripeProvider apiKey="pk_test_YOUR_KEY_HERE">
              <Elements>
                <CheckoutFormElements
                  submitText="Submit"
                  onTokenCreated={data => {
                    console.log('token created', data);
                  }}
                  onTokenCreationFailed={data => {
                    console.log('token failed', data);
                  }}
                />
              </Elements>
            </StripeProvider>
          </ReactDependentScript>
        </div>
      </div>
    );
  }
}

class JQueryPluginExample extends Component {
  shouldComponentUpdate() {
    return false;
  }
  //https://code.jquery.com/ui/1.12.1/jquery-ui.js"
  componentDidMount() {
    $(this.refs.root).datepicker();
  }

  render() {
    return <div ref="root" />;
  }
}

class _CheckoutFormElements extends Component {
  render() {
    return (
      <form onSubmit={this._handleSubmit}>
        <CardElement />
        <button>
          {this.props.submitText}
        </button>
      </form>
    );
  }

  _handleSubmit = (evt: Object): void => {
    evt.preventDefault(); // Stop the form submitting itself
    evt.stopPropagation();

    this.props.stripe.createToken({}).then(result => {
      if (result.error) {
        this.props.onTokenCreationFailed(result.error);
      } else {
        this.props.onTokenCreated(result.token);
      }
    });
  };
}

const CheckoutFormElements = injectStripe(_CheckoutFormElements);

render(<Demo />, document.querySelector('#demo'));
