
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
        Instance(): any;
        AuthenticateOutlookClientAsync(capability:string): any;
        GetEmailMessagesAsync(pageNo: number): any;
        GetEmailMessagesBySenderAsync(sender: string): any;
        GroupEmailsBySenderAsync(): any;
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