﻿// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var Adal = require('./adal.js');

// very important!!! if you put these locally then multiple versions of react get loaded and cause random errors
var React = require('react');
var ReactDOM = require('react-dom');

class Office365_Web {
    static access_token;
    static loginOffice() {
        var authzInProgress = false;
        // var officeURL = 'https://login.microsoftonline.com/trewin.onmicrosoft.com/oauth2/authorize?response_type=code&client_id=';
        //var windowsLoginURL = 'https://login.microsoftonline.com/448cfd31-021b-4a3c-beb9-26d8ba169252/oauth2/v2.0/authorize?response_type=code&client_id=';
        var windowsLoginURL = "https://login.windows.net/Common/oauth2/authorize?response_type=code&client_id=";
        var clientID = 'fd79b0e0-38b3-42e7-97fd-2f42d47beb6f';
        var callbackURL = 'http://localhost:3030/oauth2Callback';
        // var callbackURL = 'ms-app://S-1-15-2-362237037-3722746685-439561638-2597901564-3613092599-1873846187-518014421';
        // var scope = 'https://outlook.office.com/Mail.Read';
        // var resource = "00000002-0000-0000-c000-000000000000";
        var resource = "https://outlook.office365.com";
        var o = getNonce();
        windowsLoginURL += clientID + "&redirect_uri=" + callbackURL + "&state=" + o + "&resource=" + resource;

        var startURI = new Windows.Foundation.Uri(windowsLoginURL);
        var endURI = new Windows.Foundation.Uri(callbackURL);

        authzInProgress = true;


        Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(
            Windows.Security.Authentication.Web.WebAuthenticationOptions.none, startURI, endURI)
            .done(function (result) {
                var response = result.responseData;

                if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                    WinJS.log("Error returned: " + result.responseErrorDetail, "Web Authentication SDK Sample", "error");
                }
                else {
                    // get the code
                    var code = getAuthToken(result.responseData);
                    // now get the token
                    if (code) {
                        var startURL = "https://login.windows.net/common/oauth2/token";
                        var clientSecret = "XWCSiBBatZDmC3H05TZe8q7CuQ7CDakF";
                        var formString = "POST&";
                        var formData = "grant_type=authorization_code&code=" + encodeURIComponent(code) + "&redirect_uri=" + encodeURI(callbackURL) + "&client_id=" + encodeURIComponent(clientID); // + "&client_secret=" + encodeURIComponent(clientSecret);

                        try {
                            var request = new XMLHttpRequest();
                            request.open("POST", startURL, false);
                            //request.setRequestHeader("Authorization", formData);
                            request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                            request.send(formData);
                            var requestData = JSON.parse(request.responseText);
                            Office365_Web.access_token = requestData.access_token;
                            return (Office365_Web.access_token);
                        } catch (err) {
                            WinJS.log("Error sending request: " + err, "Web Authentication SDK Sample", "error");
                        }
                    }
                }
            }, function (err) {
                console.log(err);
                authzInProgress = false;
            });
        // this is the catch all.  unless there is a successful login and emails received then return null
        return null;
    }

    static launchWebAuth() {
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

    static getEmail() {
        var EmailList = require('./EmailList');
        //var CommentBox = require('./CommentBox');

        if (Office365_Web.access_token) {
            var request = new XMLHttpRequest();
            request.open("GET", " https://outlook.office365.com/api/v1.0/me/folders/inbox/messages?$top=10", false);
            request.setRequestHeader("User-Agent", "Clean-Me-Up-App/1.0");
            request.setRequestHeader("Authorization", "Bearer " + Office365_Web.access_token);
            request.send(null);
            var requestData = JSON.parse(request.responseText);
            var emails = requestData.value;
            if (emails) {
                ReactDOM.render(<EmailList emails={emails} />, document.getElementById("emailList"));
            }

        }
    }

    static getEmailReader() {

        var emailReader = DeclutterLibrary.EmailReader.instance();
        emailReader.clientID = "fd79b0e0-38b3-42e7-97fd-2f42d47beb6f";
        emailReader.authenticateOutlookClientAsync("Mail").then(function (returnValue) {
            console.log(returnValue);
        });
    }

}


// these are all of the helper functions to login to Office 365 with oAuth2

function sendPostRequest(url, authzheader) {
    try {
        var request = new XMLHttpRequest();
        request.open("POST", url, false);
        request.setRequestHeader("Authorization", authzheader);
        request.send(null);
        return request.responseText;
    } catch (err) {
        WinJS.log("Error sending request: " + err, "Web Authentication SDK Sample", "error");
    }
}

function getAuthToken(webAuthResultResponseData) {

    var responseData = webAuthResultResponseData.substring(webAuthResultResponseData.indexOf("code"));
    var keyValPairs = responseData.split("&");
    var code = null;
    var state = null;
    for (var i = 0; i < keyValPairs.length; i++) {
        var splits = keyValPairs[i].split("=");
        switch (splits[0]) {
            case "code":
                code = splits[1];
                break;
            case "expires_in":
                state = splits[1];
                break;
        }
    }
    // should really check state here to make sure that nothing was messed with
    return code;
}

function getAccessToken(webAuthResultResponseData) {

    var responseData = webAuthResultResponseData.substring(webAuthResultResponseData.indexOf("access_token"));
    var keyValPairs = responseData.split("&");
    var token = null;
    var expires_in = null;
    for (var i = 0; i < keyValPairs.length; i++) {
        var splits = keyValPairs[i].split("=");
        switch (splits[0]) {
            case "access_token":
                token = splits[1];
                break;
            case "expires_in":
                expires_in = splits[1];
                break;
        }
    }
    // should really check state here to make sure that nothing was messed with
    Office365_Web.access_token = token;
    return token;
}

function getNonce() {
    var Crypto = require('crypto');
    var nonceLen = 32;
    return Crypto.randomBytes(Math.ceil(nonceLen * 3 / 4))
        .toString('base64')   // convert to base64 format
        .slice(0, nonceLen)        // return required number of characters
        .replace(/\+/g, '0')  // replace '+' with '0'
        .replace(/\//g, '0'); // replace '/' with '0'
}

module.exports = Office365_Web;


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