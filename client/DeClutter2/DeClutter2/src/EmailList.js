// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var React = require('react');
var $ = require('jquery');
var office365 = require('./Office365');
var Email = React.createClass({
    render: function () {
        return (React.createElement("tr", null, React.createElement("td", null, this.props.email.Sender.EmailAddress.Name), React.createElement("td", null, this.props.email.Subject), React.createElement("td", null, this.props.email.DateTimeReceived)));
    }
});
var EmailList = React.createClass({
    render: function () {
        var rows = [];
        this.props.emails.forEach(function (email) {
            rows.push(React.createElement(Email, {"email": email}));
        });
        return (React.createElement("table", {"className": "bordered highlight"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Name"), React.createElement("th", null, "Subject"), React.createElement("th", null, "Date"))), React.createElement("tbody", null, rows)));
    }
});
module.exports = EmailList;
//# sourceMappingURL=EmailList.js.map