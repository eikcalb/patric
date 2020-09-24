export class User{
    firstName
    lastName
    email
    id
    thumbnailURL?:string

    constructor(data?: any) {
        if (data) {
            this.lastName = data.lastName
            this.firstName = data.firstName
            this.email = data.email
            this.id = data.id
            this.thumbnailURL = data.thumbnailURL
        }
    }

}