# JSnoX

Enjoy React.js, but not a fan of the JSX? JSnoX gives you a concise,
expressive way to build ReactElement trees in pure JavaScript. Works
with React v0.12 and above.


## Example

```
var React = require('react')
var MyOtherComponent = require('./some/path.js')
var d = require('jsnox')(React)

var LoginForm = React.createClass({
    submitLogin: function() { ... },

    render: function() {
        return d('form.login-form[method=POST]', { onSubmit: this.submitLogin },
            d('h1', 'Login'),
            d('input:email[name=email], { placeholder: 'Email' }),
            d('input:password[name=pass]', { placeholder: 'Password' }),
            d(MyOtherComponent, { myProp: 'foo' }),
            d('button:submit', 'Login')
        )
    }
})
```


## Install

```npm install jsnox```


## Why this instead of JSX?

* all your existing tooling (linter, minifier, editor, etc) still works
* no weird XML dialect in the middle of your JavaScript
* no forced build step


## Why this instead of plain JS with `React.DOM` 

* more concise code
* use your custom ReactComponent instances on React 0.12+ without [needing
  to wrap them](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
  with `React.createFactory()` everywhere


## Notes/gotchas

* All attributes you specify should be the ones that React handles. So, for
  example, you want to type `'input[readOnly]'` (camel-cased), instead of
  `'readonly'` like you'd be used to with html.

## See also

[react-hyperscript](https://github.com/mlmorg/react-hyperscript) is a similar
module that converts [hyperscript](https://github.com/dominictarr/hyperscript)
to ReactElements.
