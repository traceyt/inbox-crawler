# inbox-crawler
This code uses the Microsoft One API to crawl through an Exchange Inbox.

It uses an enumerable pattern to enable the results of the crawl to be parsed by very simple LINQ statements.
In this instance it groups the mails by source email address to help me identify the largest senders of mail that I can chop
to reduce the size of my inbox.
