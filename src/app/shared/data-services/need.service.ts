import { Need } from './../models/need';
import { Subject, Observable } from 'rxjs/Rx';
import { AngularFireDatabase, FirebaseRef, FirebaseApp } from 'angularfire2';
import { AuthService } from './../security/auth.service';
import { Injectable, Inject } from '@angular/core';


@Injectable()
export class NeedService {
  dbRef: any;
  fsRef: any;

  constructor(
    private authSvc: AuthService,
    private db: AngularFireDatabase,
    @Inject(FirebaseRef) fb,
    @Inject(FirebaseApp) app,
  ) {
    this.dbRef = fb.database().ref();
    this.fsRef = app.storage().ref();
  }

  /*donate(info, id, subscription) {
    let dataToSave = {};

    this.authSvc.authInfo$.subscribe(authInfo => {
      let uid = authInfo.$uid;
      let contributionInfo = Object.assign(info, { contributorId: uid });
      let rootWord = subscription ? 'subscriptions' : 'contributions'
      dataToSave[`${rootWord}/${id}`] = info;
      dataToSave[`${rootWord}PerNeed/${info.needId}/${id}`] = true;
      dataToSave[`${rootWord}PerOrg/${info.orgId}/${id}`] = true;
      return this.firebaseUpdate(dataToSave);
    })
  }*/


  getContributionsByNeed(id: string) {
    return this.db.list(`contributionsPerNeed/${id}`);
  }

  getContributionTotal(id: string) {
    return this.db.object(`contributionTotalLog/${id}`);
  }

  getAllNeeds() {
    return this.db.list('needs');
  }

  getLastNeeds(isApproved: boolean, howMany?: number) {
    let count = howMany ? howMany : 4;
    return this.db.list('needs', {
      query: {
        orderByChild: 'approved',
        equalTo: isApproved,
        limitToLast: count
      }
    })
      .filter(res => res && res.length > 0);
  }

  getActiveNeeds(): Observable<Need[]> {
    return this.db.list('needs', {
      query: {
        orderByChild: 'activeFlag',
        equalTo: true
      }
    })
      .filter(res => res && res.length > 0);
  }

  filterNeedsByApproval(needs: Need[], isApproved: boolean): Need[] {
    return needs.filter(need => {
      return need.approved == isApproved;
    });
  }

  filterNeedsByActiveFlag(needs: Need[]) {
    return needs.filter(need => {
      return need.activeFlag;
    });
  }

  filterNeedsToNotCompleted(needs: Need[]) {
    let now = Date.now();
    return needs.filter(need => {
      return need.endDate ? need.endDate > now : true;
    });
  }

  getNeedsByOrg(orgId: string): Observable<Need[]> {
    return this.db.list('needs', {
      query: {
        orderByChild: 'orgId',
        equalTo: orgId
      }
    })
      .filter(res => res && res.length > 0);
  }

  getNeedById(id: string) {
    return this.db.object(`needs/${id}`);
  }

  getNeedImages(need: any) {
    this.db.list(`needImageUrls/${need.$key}`)
      .subscribe(images => {
        need.bodyImageUrls = images;
      });
  }

  createNewNeed(orgId: string, need: any, coverImage: any, bodyImages?: any[]): Observable<any> {

    if (!need.ongoing) {
      need.startDate = new Date(Date.parse(need.startDate)).getTime();
      need.endDate = new Date(Date.parse(need.endDate)).getTime();
    }
    else {
      need.startDate = null;
      need.endDate = null;
    }

    let needToSave = Object.assign({}, need, { orgId }, { approved: false }, { activeFlag: true }, { timeStamp: Date.now() });
    if (coverImage.type !== 'image/jpeg' && coverImage.type !== 'image/bmp' && coverImage.type !== 'image/png' && coverImage.type !== 'image/gif') {
      alert('The file type you used for cover image doesn\'t look like an image...');
      return;
    }
    if (bodyImages) {
      for (let i = 0; i < bodyImages.length; i++) {
        if (bodyImages[i].type !== 'image/jpeg' && bodyImages[i].type !== 'image/bmp' && bodyImages[i].type !== 'image/png' && bodyImages[i].type !== 'image/gif') {
          alert('The file type you used for one of your body images doesn\'t look like an image...')
        }
      }
    }

    const newNeedKey = this.createNeedKey();
    this.updateCoverImage(newNeedKey, coverImage);
    if (bodyImages) {
      for (let i = 0; i < bodyImages.length; i++) {
        this.addBodyImage(newNeedKey, bodyImages[i]);
      }
    }

    let dataToSave = {};

    dataToSave[`needs/${newNeedKey}`] = needToSave;
    dataToSave[`needsPerOrg/${orgId}/${newNeedKey}`] = true;

    return this.firebaseUpdate(dataToSave);

  }

  storeTempImage(image: any) {
    // ToDo: Delete temporary image upon submit or cancel...
    const subject = new Subject();
    let key = this.dbRef.child('imagePaths/temp').push().key;
    let filePath = `images/temp/${key}`;
    let fileRef = this.fsRef.child(filePath);
    fileRef.put(image).then(snapshot => {
      let imageAccessors = {
        url: snapshot.metadata.downloadURLs[0],
        path: snapshot.metadata.fullPath,
        key: key
      }
      this.dbRef.child(`imagePaths/temp/${key}`).set(imageAccessors.path);
      subject.next(imageAccessors);
      subject.complete();
    });
    return subject.asObservable();
  }

  /*  storeTempBodyImages(images: any[]){
      for(let image of images){
        this.storeTempCoverImage(image)
        .subscribe()
      }
    }*/

  deleteTempImages(accessors: any[]) {
    //this.fsRef.child(`images/temp/${needKey}/`).delete();
    for (let accessor of accessors) {
      this.fsRef.child(accessor.path).delete();
      this.dbRef.child(`imagePaths/temp/${accessor.key}`).remove();
    }
  }

  updateCoverImage(needKey: string, coverImage: any) {
    let fileName = coverImage.name;
    let filePath = `images/${needKey}/${fileName}`;
    let fileRef = this.fsRef.child(filePath);
    fileRef.put(coverImage).then(snapshot => {
      return this.db.object(`needs/${needKey}`).update({ coverImageUrl: snapshot.metadata.downloadURLs[0] });
    });
  }

  addBodyImage(needKey: string, bodyImage: any) {
    let fileName = bodyImage.name;
    let filepath = `images/${needKey}/bodyImages/${fileName}`;
    let fileRef = this.fsRef.child(filepath);
    fileRef.put(bodyImage).then(snapshot => {
      return this.db.list(`needImageUrls/${needKey}`).push(snapshot.metadata.downloadURLs[0]);
    });
  }

  setNeedApproval(id: string, isApproved: boolean) {
    this.db.object(`needs/${id}`).update({ approved: isApproved });
  }

  createContributionId() {
    return this.dbRef.child('contributions').push().key;
  }

  createNeedKey() {
    return this.dbRef.child('needs').push().key;
  }

  /*pendingPercent(need) {
    return Math.round(1 - 100 * ((need.needTotal - 1000) / need.needTotal));
  }*/

  daysLeft(endDate: number) {
    let oneDay = 24 * 60 * 60 * 1000;
    let end = new Date(endDate).getTime();
    let today = new Date(Date.now()).getTime();
    return Math.round((end - today) / oneDay);
  }

  firebaseUpdate(dataToSave) {
    const subject = new Subject();

    this.dbRef.update(dataToSave)
      .then(
      val => {
        subject.next(val);
        subject.complete();
      },
      err => {
        subject.error(err);
        subject.complete();
      }
      );

    return subject.asObservable();
  }

}
