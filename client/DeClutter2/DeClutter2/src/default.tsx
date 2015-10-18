// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// reference path='../js/typings/winjs/winjs.d.ts' />
/// reference path='../js/typings/DeClutterTSHelper.d.ts />

(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize your application here.
            } else {
                // TODO: This application was suspended and then terminated.
                // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
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
    var office365 = require('./Office365');
    var EmailList = require('./EmailList');

    $(document).ready(function () {
        $('body').css('background', 'grey');

        var CleanMeUpTitle = React.createClass({
            render: function () {
                return (
                    <div className="CleanMeUpTitle"><h1>Clean Me Up!</h1></div>
                );
            }
        })

        document.getElementById('LoginAdal').addEventListener('click', office365.launchWebAuth, false);
        document.getElementById('LoginDeclutterLibrary').addEventListener('click', office365.getEmailReader, false);
        document.getElementById('LoginWebBroker').addEventListener('click', office365.loginOffice, false);
        document.getElementById('GetEmail').addEventListener('click', office365.getEmail, false);
                
        ReactDOM.render(<CleanMeUpTitle />, document.getElementById('content'));
    });
})();

