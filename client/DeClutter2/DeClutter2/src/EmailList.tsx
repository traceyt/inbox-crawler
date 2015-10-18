// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var React = require('react');
var $ = require('jquery');
var office365 = require('./Office365');

var Email = React.createClass({
    render: function () {
        return (
            <tr>
                <td>{this.props.email.Sender.EmailAddress.Name}</td>
                <td>{this.props.email.Subject}</td>
                <td>{this.props.email.DateTimeReceived}</td>
                </tr>
        );
    }
});


var EmailList = React.createClass({
    render: function () {
        var rows = [];
        this.props.emails.forEach(function (email) {
            rows.push(<Email email={email} />);
        });
        return (
            <table className="bordered highlight">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Subject</th>
                        <th>Date</th>
                        </tr>
                    </thead>
                <tbody>{rows}</tbody>
           </table>
        );
    }
});

module.exports = EmailList;