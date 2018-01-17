# ReactDependentScript

[![npm package][npm-badge]][npm]

ReactDependentScript is a simple React component used to lazily load JavaScript and CSS resources
when you need them.

When integrating with third party software it is often necessary to load that project's JavaScript
or CSS on to the page.  The naive way to do this is to always include it in the HTML of the page,
but this means you pay the cost up front of loading that code, when your React component may never
be even used.

ReactDependentScript is a React component that wraps your component's definition, and makes sure
to load the JavaScript and/or CSS first, then render your content.  It ensures that the external
content is only loaded once, regardless of how many times the render() function is called.

## Using it
First install with

```
npm install react-dependent-script
```
or
```
yarn add react-dependent-script
```

Now wrap your custom content in the component, providing an array of URLs to scripts
to load, and optionally a `loadingComponent` property containing a component to show while loading
e.g.

```JSX
import ReactDependentScript from 'react-dependent-script';
<ReactDependentScript
  loadingComponent={<div>jQuery is loading...</div>}
  scripts={['https://code.jquery.com/jquery-3.2.1.min.js']}
>
  <div>jQuery is loaded!</div>
</ReactDependentScript>
```

An alternative to rendering the child components is to provide a callback function to the
`renderChildren` prop.  This can be useful when you need to execute code that is only available
after the remote script is loaded, e.g.

```JSX
import ReactDependentScript from 'react-dependent-script';
<ReactDependentScript
  loadingComponent={<div>jQuery is loading...</div>}
  scripts={['https://code.jquery.com/jquery-3.2.1.min.js']}
  renderChildren={() => {
    return <div>Found {$('*').length} DOM nodes on the page</div>
  }}
>
</ReactDependentScript>
```

You can also load other interesting libraries, like Stripe

```JSX
import ReactDependentScript from 'react-dependent-script';
<ReactDependentScript
  loadingComponent={<div>Loading Stripe...</div>}
  scripts={['https://js.stripe.com/v3/']}
>
  <div>Stripe script is loaded, here is your card!</div>
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
```

See the [demo/src/index.js](https://github.com/shaneosullivan/ReactDependentScript/blob/master/demo/src/index.js)
file for more complex examples, including loading CSS files.

## Contributing

This project uses the [nwb](https://github.com/insin/nwb/) module for development.  After checking
out the code, you have three commands available to you:

- `build` builds the code into the `es` and `lib` folders.  You generally don't need these.
- `start` starts the demo page, which is running the `demo/src/index.js` code.  This is your usual
development environment, where you'll write examples to validate any changes.
- `clean` cleans out all build artifacts

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package
