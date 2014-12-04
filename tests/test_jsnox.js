var test = require('tape')
var React = require('react')
var d = require('..')(React)

var render = function(domTree) {
    return React.renderToStaticMarkup(domTree)
}

test('Works with simple plain tagnames', function(t) {
    t.equal(render(d('div')), '<div></div>')
    t.equal(render(d('input')), '<input>')
    t.end()
})

test('Works with ids', function(t) {
    t.equal(render(d('div#test')), '<div id="test"></div>')
    t.end()
})

test('Works with classes', function(t) {
    t.equal(render(d('div.test')), '<div class="test"></div>')
    t.equal(render(d('div.test-2')), '<div class="test-2"></div>')
    t.equal(render(d('div.test_3')), '<div class="test_3"></div>')
    t.equal(render(d('span.foo.bar.test-4')), '<span class="foo bar test-4"></span>')
    t.end()
})

test('Works with attributes (with or without a given value)', function(t) {
    // Note: React warns about [checked] and [value] unless one of readOnly or
    // onChange are also specified
    t.equal(render(d('input[name=asdf]')), '<input name="asdf">')
    t.equal(render(d('select[multiple]')), '<select multiple></select>')

    t.equal(render(d('input[checked=1][readOnly=1]')), '<input checked readonly>')
    t.equal(render(d('input[checked][readOnly]')), '<input checked readonly>')
    t.end()
})

test('Works with combinations of properties', function(t) {
    t.equal(render(d('div#foo.bar.baz')), '<div id="foo" class="bar baz"></div>')
    t.equal(render(d('input#foo.bar.baz[readOnly]')), '<input id="foo" readonly class="bar baz">')
    t.end()
})
