var test = require('tape')
var React = require('react')
var ReactDOM = require('react-dom/server')
var d = require('..')(React)

var render = function(domTree) {
    return ReactDOM.renderToStaticMarkup(domTree)
}

test('Parses simple plain tagnames', function(t) {
    t.equal(render(d('div')), '<div></div>')
    t.equal(render(d('input')), '<input/>')
    t.end()
})

test('Uses <div> by default if no tagname given', function(t) {
    t.equal(render(d('.foo')), '<div class="foo"></div>')
    t.equal(render(d('.foo.bar.baz')), '<div class="foo bar baz"></div>')
    t.equal(render(d('#foo')), '<div id="foo"></div>')
    t.end()
})

test('Parses ids', function(t) {
    t.equal(render(d('div#test')), '<div id="test"></div>')
    t.end()
})

test('Parses classes', function(t) {
    t.equal(render(d('div.test')), '<div class="test"></div>')
    t.equal(render(d('div.test-2')), '<div class="test-2"></div>')
    t.equal(render(d('div.test_3')), '<div class="test_3"></div>')
    t.equal(render(d('span.foo.bar.test-4')), '<span class="foo bar test-4"></span>')
    t.end()
})

test('Parses attributes (with or without a given value)', function(t) {
    // Note: React warns about [checked] and [value] unless one of readOnly or
    // onChange are also specified
    t.equal(render(d('input[name=asdf]')), '<input name="asdf"/>')
    t.equal(render(d('select[multiple]')), '<select multiple=""></select>')

    // Can include various url characters as attribute values
    t.equal(render(d('a[href=google.com?foo=bar]')), '<a href="google.com?foo=bar"></a>')

    // More involved test case from issue #6
    // Note that renderToStaticMarkup() will encode '&' characters
    var testUrl = 'https://maps.googleapis.com/maps/api/staticmap?center=San+Francisco,CA&zoom=10&size=400x400'
    var encodedUrl = testUrl.replace(/&/g, '&amp;')
    t.equal(render(d('a[href=' + testUrl + ']')), '<a href="' + encodedUrl + '"></a>')

    // Some attribute types allow values that include spaces:
    t.equal(render(d('input[placeholder=s p a c e]')), '<input placeholder="s p a c e"/>')

    t.equal(render(d('input[checked=1]')), '<input checked=""/>')
    t.equal(render(d('input[checked]')), '<input checked=""/>')
    t.end()
})

test('Parses type attribute as a special case (using a colon)', function(t) {
    t.equal(render(d('input:checkbox')), '<input type="checkbox"/>')
    t.equal(render(d('button:submit')), '<button type="submit"></button>')

    // Test combinations with other properties:
    t.equal(render(d('input:checkbox.foo[name=baz]')),
                     '<input type="checkbox" name="baz" class="foo"/>')
    t.equal(render(d('button:submit.foo')), '<button type="submit" class="foo"></button>')
    t.end()
})

test('Attributes with hyphens are passed through', function(t) {
    var expected = '<div data-bar="asdf" class="foo">hi</div>'
    t.equal(render(d('div.foo[data-bar=asdf]', 'hi')), expected)
    t.end()
})

test('Parses combinations of properties', function(t) {
    t.equal(render(d('div#foo.bar.baz')), '<div id="foo" class="bar baz"></div>')
    t.equal(render(d('input#foo.bar.baz[readOnly]')), '<input id="foo" readonly="" class="bar baz"/>')
    t.end()
})

test('Combines parsed props and values from the props hash', function(t) {
    t.equal(render(d('div.foo', { id: 'bar' })), '<div class="foo" id="bar"></div>')

    // Classes should be combined from both sources:
    t.equal(render(d('div.foo', { className: 'bar' })), '<div class="foo bar"></div>')
    t.equal(render(d('div', { className: 'foo' })), '<div class="foo"></div>')
    t.equal(render(d('div.foo', {})), '<div class="foo"></div>')

    // Edge cases for class combinations:
    t.equal(render(d('div.foo', { className: '' })), '<div class="foo "></div>')
    t.equal(render(d('div.foo', { className: null })), '<div class="foo"></div>')
    t.end()
})

test('Props hash argument is optional', function(t) {
    t.equal(render(d('div.foo', 'Shazam')), '<div class="foo">Shazam</div>')
    t.equal(render(d('div', [d('span^', 'hi')])), '<div><span>hi</span></div>')
    t.end()
})

test('button elements have default type="button"', function(t) {
    t.equal(render(d('button', 'hi')), '<button type="button">hi</button>')
    t.equal(render(d('button.foo.bar', 'hi')), '<button type="button" class="foo bar">hi</button>')
    t.end()
})

test('Data attributes get passed through as expected', function(t) {
    t.equal(render(d('div', {'data-foo': 'bar'}, 'hi')), '<div data-foo="bar">hi</div>')

    var dataHash = {'data-foo': 'bar', 'data-baz': 'boo'}
    t.equal(render(d('div', dataHash, 'hi')), '<div data-foo="bar" data-baz="boo">hi</div>')

    t.equal(render(d('div[data-foo=bar]', 'hi')), '<div data-foo="bar">hi</div>')
    t.equal(render(d('div[data-a=1][data-b=2]', 'hi')), '<div data-a="1" data-b="2">hi</div>')
    t.end()
})

test('invalid input throws ParseError exceptions', function(t) {
    var errRegex = new RegExp(d.ParseError.prototype.name)
    t.throws(function() { d('-invalid') }, errRegex)
    t.throws(function() { d('') }, errRegex)
    t.throws(function() { d() }, errRegex)
    t.throws(function() { d(null) }, errRegex)
    t.throws(function() { d(false) }, errRegex)
    //t.throws(function() { d(14) }, errRegex)  // This is one case where it won't throw
    t.end()
})

test('$renderIf', function(t) {
    var conditionalTree = function(cond) {
        return d('div', d('div', { $renderIf: cond }, 'inside'))
    };

    t.equal(render(conditionalTree(false)), '<div></div>')
    t.equal(render(conditionalTree(true)), '<div><div>inside</div></div>')
    t.equal(render(conditionalTree(null)), '<div></div>')
    t.equal(render(conditionalTree(12)), '<div><div>inside</div></div>')
    t.equal(render(conditionalTree({})), '<div><div>inside</div></div>')
    t.equal(render(conditionalTree()), '<div></div>')   // undefined should be treated as falsy
    t.end()
})

test('$renderIf value does not pass through to components', function(t) {
    var PassThrough = React.createClass({
        render: function() { return d('div', this.props.$renderIf) }
    })
    t.equal(render(d('div', d(PassThrough, { $renderIf: 1 }))), '<div><div></div></div>')
    t.equal(render(d('div', d(PassThrough, { $renderIf: 0 }))), '<div></div>')
    t.end()
})
