// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// reference path='../typings/winjs/winjs.d.ts' />
(function () {
    "use strict";
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
            }
            else {
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };
    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
        // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
        // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
    };
    app.start();
    // email is AllieB@oauthplay.onmicrosoft.com
    // password is Pastries101
    var React = require('react');
    var ReactDOM = require('react-dom');
    var $ = require('jquery');
    $(document).ready(function () {
        $('body').css('background', 'pink');
        var HelloWorld = React.createClass({
            render: function () {
                return (React.createElement("div", {"className": "HelloWorld"}, React.createElement("h1", null, "Hello World!!")));
            }
        });
        ReactDOM.render(React.createElement(HelloWorld, null), document.getElementById('content'));
    });
})();
//# sourceMappingURL=default.js.map