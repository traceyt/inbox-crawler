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
    var Adal = require('./adal.js');
    var Crypto = require('crypto');
    function GetNonce() {
        var nonceLen = 32;
        return Crypto.randomBytes(Math.ceil(nonceLen * 3 / 4))
            .toString('base64') // convert to base64 format
            .slice(0, nonceLen) // return required number of characters
            .replace(/\+/g, '0') // replace '+' with '0'
            .replace(/\//g, '0'); // replace '/' with '0'
    }
    function loginOffice() {
        var authzInProgress = false;
        // var officeURL = 'https://login.microsoftonline.com/trewin.onmicrosoft.com/oauth2/authorize?client_id=';
        var windownLoginURL = 'https://login.microsoftonline.com/448cfd31-021b-4a3c-beb9-26d8ba169252/oauth2/v2.0/authorize?client_id=';
        var clientID = 'fd79b0e0-38b3-42e7-97fd-2f42d47beb6f';
        var callbackURL = 'http://localhost:3030/oauth2Callback';
        //var callbackURL = 'ms-app://S-1-15-2-362237037-3722746685-439561638-2597901564-3613092599-1873846187-518014421';
        var scope = 'https://outlook.office.com/mail.read';
        // var resource = "00000002-0000-0000-c000-000000000000";
        // var resource = "https://outlook.office.com";
        var o = GetNonce();
        windownLoginURL += clientID + "&redirect_uri=" + callbackURL + "&response_type=code&state=" + o + "&scope=" + scope;
        var startURI = new Windows.Foundation.Uri(windownLoginURL);
        var endURI = new Windows.Foundation.Uri(callbackURL);
        authzInProgress = true;
        Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startURI, endURI)
            .done(function (result) {
            var response = result.responseData;
            getToken(result.responseData);
            if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                WinJS.log("Error returned: " + result.responseErrorDetail, "Web Authentication SDK Sample", "error");
            }
            authzInProgress = false;
        }, function (err) {
            console.log(err);
            authzInProgress = false;
        });
    }
    function getToken(webAuthResultResponseData) {
        var responseData = webAuthResultResponseData.substring(webAuthResultResponseData.indexOf("access_token"));
        var keyValPairs = responseData.split("&");
        var access_token;
        var expires_in;
        for (var i = 0; i < keyValPairs.length; i++) {
            var splits = keyValPairs[i].split("=");
            switch (splits[0]) {
                case "access_token":
                    access_token = splits[1]; //You can store access token locally for further use. See "Account Management" scenario for usage.
                    break;
                case "expires_in":
                    expires_in = splits[1];
                    break;
            }
        }
        var client = new XMLHttpRequest();
        // client.open("POST", "https://login.microsoftonline.com/448cfd31-021b-4a3c-beb9-26d8ba169252/oauth2/token?client_id" + access_token, false);
        client.open("GET", "https://outlook.office.com/api/v1.0/me/folders/inbox/messages?access_token=" + access_token, false);
        client.send();
        var userInfo = JSON.parse(client.responseText);
        console.log(userInfo);
    }
    function launchWebAuth() {
        //  redirectUri: 'ms-app://S-1-15-2-362237037-3722746685-439561638-2597901564-3613092599-1873846187-518014421'
        /* GET https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
        response_type=code&
        client_id=32613fc5-e7ac-4894-ac94-fbc39c9f3e4a&
        redirect_uri=https:%2f%2foauthplay.azurewebsites.net%2f&
        scope=openid+offline_access+https:%2f%2foutlook.office.com%2fmail.read+https:%2f%2foutlook.office.com%2fcalendars.read+https:%2f%2foutlook.office.com%2fcontacts.read&state=f561be3f-e050-4251-bf32-9ae73fc7a6ce&
        prompt=login HTTP/1.1
        */
        var config = {
            tenant: 'trewin.onmicrosoft.com',
            clientId: 'fd79b0e0-38b3-42e7-97fd-2f42d47beb6f',
            instance: 'https://login.microsoftonline.com/',
            redirectUri: 'http://localhost:3030/oauth2Callback',
            resource: '00000002-0000-0000-c000-000000000000',
            endpoints: {
                'https://outlook.office.com/api/v1.0/me/folders/inbox/messages': 'https://outlook.office.com'
            }
        };
        var auth = new Adal.inject(config);
        auth.callback = function (errorResponse, token) {
            console.log(errorResponse);
        };
        auth.login();
    }
    function getEmailReader() {
        var emailReader = DeclutterLibrary.EmailReader.instance();
        emailReader.clientID = "fd79b0e0-38b3-42e7-97fd-2f42d47beb6f";
        emailReader.authenticateOutlookClientAsync("Mail").then(function (returnValue) {
            console.log(returnValue);
        });
    }
    $(document).ready(function () {
        $('body').css('background', 'grey');
        var CleanMeUpTitle = React.createClass({
            render: function () {
                return (React.createElement("div", {"className": "CleanMeUpTitle"}, React.createElement("h1", null, "Clean Me Up!")));
            }
        });
        document.getElementById('LoginAdal').addEventListener('click', launchWebAuth, false);
        document.getElementById('LoginDeclutterLibrary').addEventListener('click', getEmailReader, false);
        document.getElementById('LoginWebBroker').addEventListener('click', loginOffice, false);
        ReactDOM.render(React.createElement(CleanMeUpTitle, null), document.getElementById('content'));
        //var xhr = new XMLHttpRequest();
        //xhr.onreadystatechange = function () {
        //    if (xhr.readyState == 4) {
        //        alert(xhr.responseText);
        //    }
        //    xhr.open('GET', 'https://graph.microsoft.com/beta/me/Messages', true);
        //    xhr.send(null);
        //};
        //       * Config information
        //       * @public
        //      @class Config
        //      @property { tenant } Your target tenant
        //      @property { clientId } Identifier assigned to your app by Azure Active Directory
        //      @property { redirectUri } Endpoint at which you expect to receive tokens
        //      @property { instance } Azure Active Directory Instance(default:https://login.microsoftonline.com/)
        //      @property { endpoints } Collection of {Endpoint - ResourceId } used for autmatically attaching tokens in webApi calls
        //     
        //var authorityUrl = config.authorityHostUrl + '/' + sampleParameters.tenant;
        //var context = new AuthenticationContext(authorityUrl);
        //var resource = '00000002-0000-0000-c000-000000000000';
        //context.acquireTokenWithUsernamePassword(resource, sampleParameters.username, sampleParameters.password, sampleParameters.clientId, function (err, tokenResponse) {
        //    if (err) {
        //        console.log('well that didn\'t work: ' + err.stack);
        //    } else {
        //        console.log(tokenResponse);
        //    }
        //});
    });
})();
//# sourceMappingURL=default.js.map