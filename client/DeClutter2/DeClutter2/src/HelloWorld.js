// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var React = require('react');
var HelloWorld = React.createClass({
    render: function () {
        return (React.createElement("div", null, "Hello World"));
    }
});
module.exports = HelloWorld;
//# sourceMappingURL=HelloWorld.js.map