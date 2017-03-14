export class UserInfo {
    constructor(
        public repEmail: string,
        public fName: string,
        public lName: string,
        public repPhone: string,
        public orgApproved: false,
        public orgName: string,
        public orgCity: string,
        public orgState: string,
        public orgZip: string,
        public agreedToTnC: boolean,
        public $uid: string,
        public orgPhone?: string,
        public orgWebsite?: string
    ) { }

    isApproved() {
        return !!this.orgApproved;
    }
}
/*export interface UserInfo {
    repEmail: string;
    fName: string;
    lName: string;
    repPhone: string;
    orgName: string;
    orgPhone?: string;
    orgWebsite?: string;
    orgCity: string;
    orgState: string;
    orgZip: string;
}*/