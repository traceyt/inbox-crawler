// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// reference path='../typings/winjs/winjs.d.ts' />
/// reference path='../typings/DeClutterTSHelper.d.ts />
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
    var Adal = require('adal-node');
    $(document).ready(function () {
        $('body').css('background', 'pink');
        var HelloWorld = React.createClass({
            render: function () {
                return (React.createElement("div", {"className": "HelloWorld"}, React.createElement("h1", null, "Hello World!!")));
            }
        });
        ReactDOM.render(React.createElement(HelloWorld, null), document.getElementById('content'));
        //var emailReader = new DeclutterLibrary.EmailReader().AuthenticateOutlookClientAsync("Mail");
        //var xhr = new XMLHttpRequest();
        //xhr.onreadystatechange = function () {
        //    if (xhr.readyState == 4) {
        //        alert(xhr.responseText);
        //    }
        //    xhr.open('GET', 'https://graph.microsoft.com/beta/me/Messages', true);
        //    xhr.send(null);
        //};
        var AuthenticationContext = Adal.AuthenticationContext;
        var sampleParameters = {
            tenant: 'trewin.onmicrosoft.com',
            authorityHostUrl: 'https://login.windows.net',
            clientId: '03f99888-2494-4e18-b6e0-041eaa6c0c82',
            username: 'tracey',
            password: 'Fanny100'
        };
        var authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant;
        var context = new AuthenticationContext(authorityUrl);
        var resource = '00000002-0000-0000-c000-000000000000';
        context.acquireTokenWithUsernamePassword(resource, sampleParameters.username, sampleParameters.password, sampleParameters.clientId, function (err, tokenResponse) {
            if (err) {
                console.log('well that didn\'t work: ' + err.stack);
            }
            else {
                console.log(tokenResponse);
            }
        });
    });
})();
//# sourceMappingURL=default.js.map