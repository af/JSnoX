[![Build Status](https://secure.travis-ci.org/af/JSnoX.png)](http://travis-ci.org/af/JSnoX)

# JSnoX

Enjoy [React.js](http://facebook.github.io/react/), but not a fan of the JSX? JSnoX gives you a concise,
expressive way to build ReactElement trees in pure JavaScript. Works
with React v0.12 and above.


## Example

```js
var React = require('react')
var MyOtherComponent = require('./some/path.js')
var d = require('jsnox')(React)

var LoginForm = React.createClass({
    submitLogin: function() { ... },

    render: function() {
        return d('form[method=POST]', { onSubmit: this.submitLogin }, [
            d('h1.form-header', 'Login'),
            d('input:email[name=email]', { placeholder: 'Email' }),
            d('input:password[name=pass]', { placeholder: 'Password' }),
            d(MyOtherComponent, { myProp: 'foo' }),
            d('button:submit', 'Login')
        ])
    }
})
```


## API

```javascript
// Create a function, d, that parses spec strings into React DOM:
var React = require('react')
var d = require('jsnox')(React)

// The function returned by JSnoX takes 3 arguments:
// specString (required)    - Specifies the tagName and (optionally) attributes
// props (optional)         - Additional props (can override output from specString)
// children (optional)      - String, or an array of ReactElements
var myDom = d('div.foo', {}, 'hello')

console.log(React.renderToStaticMarkup(myDom))  // => '<div class="foo">hello</div>'
```

JSnoX's specStrings let you specify your components' HTML in a way resembling
CSS selectors:

![spec strings](docs/jsnox-specstring.png)

Also, you can add '@foo' to a specString to point
a [ref](http://facebook.github.io/react/docs/more-about-refs.html) named foo
to that element:

```
  // in render():
  return d('input:email@emailAddr')

  // elsewhere in the component (after rendering):
  var emailEl = this.refs.emailAddr.getDOMNode()
```

Each property referenced in the string is passed along in the props argument to
`React.createElement()`. You can pass along additional props in the second argument.


## Install

```
npm install jsnox
```

Npm is the recommended way to install. You can also include `index.js` in your
project directly and it will fall back to exporting a global variable as
`window.jsnox`.


## Why this instead of JSX?

* No weird XML dialect in the middle of your JavaScript
* All your existing tooling (linter, minifier, editor, etc) works as it does
  with regular JavaScript
* No forced build step


## Why this instead of plain JS with `React.DOM`?

* More concise code
* No need to specify a `key` property for siblings that are specified with
  distinct strings
* Use your custom ReactComponent instances on React 0.12+ without [needing
  to wrap them](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
  with `React.createFactory()` everywhere


## Notes/gotchas

* Your top-level component should also be wrapped by the jsnox client, to
  prevent [warnings about `createFactory`](https://gist.github.com/sebmarkbage/ae327f2eda03bf165261). For example:

  ```js
  var d = require('jsnox')(React)

  // Good:
  React.render(d(MyTopLevelComponent, { prop1: 'foo'}), document.body)

  // Bad (will trigger a warning, and break in future React versions):
  React.render(MyTopLevelComponent({ prop1: 'foo'}), document.body)
  ```

* All attributes you specify should be the ones that React understands. So, for
  example, you want to type `'input[readOnly]'` (camel-cased), instead of
  `'readonly'` like you'd be used to with html.
* JSnoX gives you a saner default `type` for `button` elements– unless you specify
  `'button:submit'` their type will be `"button"` (unintentionally form-submitting
  buttons is a personal pet peeve).


## See also

* [react-hyperscript](https://github.com/mlmorg/react-hyperscript) is a similar
module that converts [hyperscript](https://github.com/dominictarr/hyperscript)
to ReactElements.
* [react-no-jsx](https://github.com/jussi-kalliokoski/react-no-jsx) provides
  another way to write plain JS instead of JSX.
