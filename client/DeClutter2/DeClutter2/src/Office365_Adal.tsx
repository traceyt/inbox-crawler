// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// ../typings/es6-promise/es6-promise.d.ts

var Adal = require('./adal.js');

// very important!!! if you put these locally then multiple versions of react get loaded and cause random errors
var React = require('react');
var ReactDOM = require('react-dom');

class Office365_Adal {
    static access_token;
    static launchWebAuth() {
        //  redirectUri: 'ms-app://S-1-15-2-362237037-3722746685-439561638-2597901564-3613092599-1873846187-518014421'

        /* GET https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
        response_type=code&
        client_id=32613fc5-e7ac-4894-ac94-fbc39c9f3e4a&
        redirect_uri=https:%2f%2foauthplay.azurewebsites.net%2f&
        scope=openid+offline_access+https:%2f%2foutlook.office.com%2fmail.read+https:%2f%2foutlook.office.com%2fcalendars.read+https:%2f%2foutlook.office.com%2fcontacts.read&state=f561be3f-e050-4251-bf32-9ae73fc7a6ce&
        prompt=login HTTP/1.1
        */




        var urlToGo = '';
        var displayCallback = function (url) {
            urlToGo = url;
        };
        var config = {
            tenant: 'trewin.onmicrosoft.com',
            clientId: 'fd79b0e0-38b3-42e7-97fd-2f42d47beb6f',
            cacheLocation: 'localStorage',
            instance: 'https://login.windows.net/',
            resource: 'https://outlook.office365.com',
            endpoints: {
                'https://outlook.office.com/api/v1.0/me/folders/inbox/messages': 'https://outlook.office.com'
            }
        };

        var authContext = new Adal.inject(config);
        Office365_Adal.getUser(authContext).then(function (token) {
            console.log(token);
            authContext.acquireToken(config.resource, function (error, token) {
                if (error || !token) {
                    console.log(error);
                    return;
                }
            });
        });
    }

    static getUser = function (authContext) {
        var dummyAuthPage = 'default.html';
        return new Promise(function (resolve, reject) {
            // If the user is cached, resolve the promise immediately.
            //var user = authContext.getCachedUser();
            //if (user) {
            //    resolve(user);
            //    return;
            //}
		
            // The user was not cached. Open a popup window which
            // performs the OAuth login process, then signals
            // the result.
            authContext.config.redirectUri = window.location.href;
            var isCallback = authContext.isCallback(window.location.hash);
            authContext.handleWindowCallback();
            if (isCallback && !authContext.getLoginError()) {
                window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
            }

            var user = authContext.getCachedUser();
            if (user) {
                resolve(user);
                return;
            } else {
                authContext.login();
            }
        });
    }
}


module.exports = Office365_Adal;

//// var officeURL = 'https://login.microsoftonline.com/trewin.onmicrosoft.com/oauth2/authorize?response_type=code&client_id=';
////var windowsLoginURL = 'https://login.microsoftonline.com/448cfd31-021b-4a3c-beb9-26d8ba169252/oauth2/v2.0/authorize?response_type=code&client_id=';
//var windowsLoginURL = "https://login.windows.net/Common/oauth2/authorize?response_type=code&client_id=";
//var clientID = 'fd79b0e0-38b3-42e7-97fd-2f42d47beb6f';
//var callbackURL = 'http://localhost:3030/oauth2Callback';
//// var callbackURL = 'ms-app://S-1-15-2-362237037-3722746685-439561638-2597901564-3613092599-1873846187-518014421';
//// var scope = 'https://outlook.office.com/Mail.Read';
//// var resource = "00000002-0000-0000-c000-000000000000";
//var resource = "https://outlook.office365.com";