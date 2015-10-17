
declare module DeclutterLibrary {

	class Address {
		EmailAddress: EmailAddress;		
	}

    class API {
        getDataAsync(): any;
	}

	class EmailAddress {
		Address: string;		
		Name: string;		
	}

    class EmailReader {
        static instance(): EmailReader;
        clientID: string;
        authenticateOutlookClientAsync(capability:string): any;
        getEmailMessagesAsync(pageNo: number): any;
        getEmailMessagesBySenderAsync(sender: string): any;
        groupEmailsBySenderAsync(): any;
	}

	class Folder {
		ID: string;		
		DisplayName: string;		
		ParentFolderID: string;		
		ChildFolderCount: number;		
		ChildFolders: Folder[];		
	}

	class Message {
		ID: string;		
		Sender: Address;		
		To: Address[];		
		Cc: Address[];		
		Bcc: Address[];		
		DateTimeReceived: Date;		
		Subject: string;		
	}

}