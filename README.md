# JSnoX

Enjoy React.js, but not a fan of the jsx? JSnoX is an effort to create a concise,
expressive way to build ReactElement trees.

## Example

```
var React = require('react')
var MyOtherComponent = require('./some/path.js')
var d = require('jsnox')(React.DOM)

var LoginForm = React.createClass({
    submitLogin: function() { ... },

    render: function() {
        return d('form[method=POST]', { onSubmit: this.submitLogin }
            d('h1', 'Login'),
            d('input[type=email]', { placeholder: 'Enter your email' }),
            d('input[type=password]', { placeholder: 'Enter password' }),
            d(MyOtherComponent, { myProp: 'foo' }),
            d('button.submit', 'Login')
        )
    }
})
```


## Why this instead of JSX?

* all your existing tooling (linter, minifier, editor, etc) still works
* no weird XML dialect in the middle of your JavaScript
* no forced build step


## Why this instead of plain JS with `React.DOM` 

* more concise code
* use your custom ReactComponent instances on React 0.12+ without [needing
  to wrap them](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
  with `React.createFactory()` everywhere


## Install

```npm install jsnox```
