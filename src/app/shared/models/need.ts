export class Need {
    constructor(
        public $key: string,
        public orgId: string,
        public CoverImagePath: string,
        public Title: string,
        public Body: string,
        public Ongoing: boolean,
        public StartDate: number,
        public CollectedTotal: number,
        public Timestamp: number,
        public EndDate?: number,
        public NeedTotal?: number,
        public VideoUrl?: string,
        public OtherImagePaths?: string[]
    ) { }

    static fromJsonList(array): Need[] {
        //return array.map(json => Lesson.fromJson(json));
        return array.map(Need.fromJson);
    }

    static fromJson({
        $key,
        orgId,
        CoverImagePath,
        Title,
        Body,
        Ongoing,
        StartDate,
        CollectedTotal,
        Timestamp,
        EndDate,
        NeedTotal,
        VideoUrl,
        OtherImagePaths,
    }): Need {
        return new Need(
            $key,
            orgId,
            CoverImagePath,
            Title,
            Body,
            Ongoing,
            StartDate,
            CollectedTotal,
            Timestamp,
            EndDate,
            NeedTotal,
            VideoUrl,
            OtherImagePaths,
        );
    }
}