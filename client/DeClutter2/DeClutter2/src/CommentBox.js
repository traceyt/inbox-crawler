// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
// tutorial1.js
var React = require('react');
var $ = require('jquery');
var CommentBox = React.createClass({
    render: function () {
        return (React.createElement("div", {"className": "commentBox"}, "Hello, world!I am a CommentBox."));
    }
});
module.exports = CommentBox;
//# sourceMappingURL=CommentBox.js.map