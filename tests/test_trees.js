var test = require('tape')
var React = require('react')
var ReactDOM = require('react-dom/server')
var d = require('..')(React)

var render = function(domTree) {
    return ReactDOM.renderToStaticMarkup(domTree)
}

var Greeting = React.createClass({
    displayName: 'Greeting',    // Used to auto-generate a "key" prop
    render: function() {
        return React.DOM.div(null, this.props.text || 'hi')
    }
})


test('trees of elements render correctly', function(t) {
    var tree = d('form.foo',
                  d('input:email'),
                  d('input:password'),
                  d('button:submit', 'Submit')
               )
    t.equal(render(tree), '<form class="foo"><input type="email"/>' +
                          '<input type="password"/><button type="submit">Submit</button>' +
                          '</form>')
    t.end()
})

test('rendering custom components and text nodes', function(t) {
    var tree = d('section#stuff',
                d('span', 'a greeting:'),
                d(Greeting, { text: 'yo' }),
                d('span', '!')
               )
    t.equal(render(tree), '<section id="stuff"><span>a greeting:</span><div>yo</div><span>!</span></section>')
    t.end()
})

test('second arg can be an array of ReactElements', function(t) {
    var items = ['one', 'two']
    var tree = d('ul', items.map(function(item) { return d('li.' + item + '^') }))
    t.equal(render(tree), '<ul><li class="one"></li><li class="two"></li></ul>')
    t.end()
})

test('last arg can be number, will be treated as a string', function(t) {
    t.equal(render(d('div', null, 15)), '<div>15</div>')
    t.equal(render(d('div', 15)), '<div>15</div>')
    t.equal(render(d('div', -3)), '<div>-3</div>')
    t.equal(render(d('div', 4.89)), '<div>4.89</div>')
    t.end()
})

test('second arg can be null', function(t) {
    var twoArgTree = d('div', null, d('span', 'hi'))
    t.equal(render(twoArgTree), '<div><span>hi</span></div>')

    var threeArgTree = d('div', null, d('span', 'hi'), d('span', 'yo'))
    t.equal(render(threeArgTree), '<div><span>hi</span><span>yo</span></div>')

    var fourArgTree = d('div', null, d('span', 'hi'), d('span', 'yo'), d('span', 'hey'))
    t.equal(render(fourArgTree), '<div><span>hi</span><span>yo</span><span>hey</span></div>')
    t.end()
})

test('second arg can be a ReactElement (no null or {} arg required)', function(t) {
    var twoArgTree = d('div', d('span', 'hi'))
    t.equal(render(twoArgTree), '<div><span>hi</span></div>')

    var threeArgTree = d('div', d('span', 'hi'), d('span', 'yo'))
    t.equal(render(threeArgTree), '<div><span>hi</span><span>yo</span></div>')

    var fourArgTree = d('div', d('span', 'hi'), d('span', 'yo'), d('span', 'hey'))
    t.equal(render(fourArgTree), '<div><span>hi</span><span>yo</span><span>hey</span></div>')
    t.end()
})

test('rendering custom components works correctly without props', function(t) {
    var tree = d('section#stuff',
                d(Greeting),
                d('span', '!')
               )
    t.equal(render(tree), '<section id="stuff"><div>hi</div><span>!</span></section>')
    t.end()
})

test('Readme example', function(t) {
    var noop = function() {}
    var tree = d('form[method=POST]', { onSubmit: noop },
        d('h1.form-header', 'Login'),
        d('input:email[name=email]'),
        d('input:password[name=pass]'),
        d(Greeting, { text: 'yo' }),
        d('button:submit', 'Login')
    )

    var expected = '<form method="POST"><h1 class="form-header">Login</h1><input type="email" name="email"/><input type="password" name="pass"/><div>yo</div><button type="submit">Login</button></form>'
    t.equal(render(tree), expected)
    t.end()
})
