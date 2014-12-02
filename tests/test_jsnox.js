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
    // TODO: more complex cases
    t.end()
})
