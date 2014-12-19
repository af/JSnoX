var test = require('tape')
var React = require('react')
var d = require('..')(React)

var render = function(domTree) {
    return React.renderToStaticMarkup(domTree)
}

var Greeting = React.createClass({
    displayName: 'Greeting',    // Used to auto-generate a "key" prop
    render: function() {
        return React.DOM.div(null, this.props.text || 'hi')
    }
});


test('trees of elements render correctly', function(t) {
    var tree = d('form.foo', {}, [
                  d('input:email'),
                  d('input:password'),
                  d('button:submit', {}, 'Submit')
               ])
    t.equal(render(tree), '<form class="foo"><input type="email">' +
                          '<input type="password"><button type="submit">Submit</button>' +
                          '</form>')
    t.end()
});

test('rendering custom components and text nodes', function(t) {
    var tree = d('section#stuff', [
                'a greeting:',
                d(Greeting, { text: 'yo'}),
                d('span', '!')
               ])
    t.equal(render(tree), '<section id="stuff">a greeting:<div>yo</div><span>!</span></section>')
    t.end()
});

test('rendering custom components works correctly without props', function(t) {
    var tree = d('section#stuff', [
                d(Greeting),
                d('span', '!')
               ])
    t.equal(render(tree), '<section id="stuff"><div>hi</div><span>!</span></section>')
    t.end()
});

test('rendering custom components works correctly without props', function(t) {
    var tree = d('section#stuff', [
                d(Greeting),
                d('span', '!')
               ])
    t.equal(render(tree), '<section id="stuff"><div>hi</div><span>!</span></section>')
    t.end()
});

test('Readme example', function(t) {
    var noop = function() {}
    var tree = d('form[method=POST]', { onSubmit: noop }, [
        d('h1.form-header', 'Login'),
        d('input:email[name=email]', { placeholder: 'Email' }),
        d('input:password[name=pass]', { placeholder: 'Password' }),
        d(Greeting, { text: 'yo' }),
        d('button:submit', 'Login')
    ])

    var expected = '<form method="POST"><h1 class="form-header">Login</h1><input type="email" name="email" placeholder="Email"><input type="password" name="pass" placeholder="Password"><div>yo</div><button type="submit">Login</button></form>';
    t.equal(render(tree), expected)
    t.end()
});
