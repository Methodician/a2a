export class UserInfo {
    constructor(
        public repEmail: string,
        public fName: string,
        public lName: string,
        public repPhone: string,
        public orgName: string,
        public orgCity: string,
        public orgState: string,
        public orgZip: string,
        public agreedToTnC: boolean,
        public $uid: string,
        public orgApproved: false,
        public orgPhone?: string,
        public orgWebsite?: string
    ) { }

    isApproved() {
        return !!this.orgApproved;
    }

}

export class UserInfoClosed {
    constructor(
        public repEmail: string,
        public repPhone: string,
        public agreedToTnC: boolean
    ) { }
}

export class UserInfoOpen {
    constructor(
        public fName: string,
        public lName: string,
        public orgName: string,
        public orgCity: string,
        public orgState: string,
        public orgZip: string,
        public orgPhone?: string,
        public orgWebsite?: string
    ) { }
}
