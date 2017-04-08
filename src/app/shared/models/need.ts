export class Need {
    constructor(
        public $key: string,
        public approved: boolean,
        public orgId: string,
        public coverImageUrl: string,
        public title: string,
        public body: string,
        public ongoing: boolean,
        public startDate: number,
        public collectedTotal: number = 0,
        public timestamp: number,
        public endDate?: number,
        public needTotal?: number,
        public videoUrl?: string,
        public bodyImageUrls?: string[],
        public activeFlag?: boolean
    ) { }

    static fromJsonList(array): Need[] {
        //return array.map(json => Lesson.fromJson(json));
        return array.map(Need.fromJson);
    }

    static fromJson({
        $key,
        approved,
        orgId,
        coverImageUrl,
        title,
        body,
        ongoing,
        startDate,
        collectedTotal,
        timestamp,
        endDate,
        needTotal,
        videoUrl,
        bodyImageUrls,
        activeFlag
    }): Need {
        return new Need(
            $key,
            approved,
            orgId,
            coverImageUrl,
            title,
            body,
            ongoing,
            startDate,
            collectedTotal,
            timestamp,
            endDate,
            needTotal,
            videoUrl,
            bodyImageUrls,
            activeFlag
        );
    }
}