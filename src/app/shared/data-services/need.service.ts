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

  donate(info, id) {
    console.log('orgId:', info.orgId);
    console.log('needId:', info.needId);
    console.log('contributionId:', id);

    let dataToSave = {};

    dataToSave[`contributions/${id}`] = info;
    dataToSave[`contributionsPerNeed/${info.needId}/${id}`] = true;
    dataToSave[`contributionsPerOrg/${info.orgId}/${id}`] = true;

    return this.firebaseUpdate(dataToSave);
    //this.db.list('contributions').push(info);
  }


  getContributionsByNeed(id: string) {
    return this.db.list(`contributionsPerNeed/${id}`);
  }

  getContributionTotal(id: string) {
    return this.db.object(`contributionTotalLog/${id}`);
  }

  /*  getNeedContributionTotal(id: string) {
  
    }*/

  getAllNeeds() {
    return this.db.list('needs');
  }

  getNeedsByApproval(isApproved: boolean): Observable<Need[]> {
    return this.db.list('needs', {
      query: {
        orderByChild: 'approved',
        equalTo: isApproved
      }
    })
      .filter(res => res && res.length > 0)
      .do(console.log);
    //return this.dbRef.child('needs').orderByChild('approved').equalTo(isApproved);
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
      need.startDate = Date.parse(need.startDate);
      need.endDate = Date.parse(need.endDate);
    }

    let needToSave = Object.assign({}, need, { orgId }, { approved: false }, { timeStamp: Date.now() });


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

    //const newNeedKey = needKey ? needKey : this.dbRef.child('needs').push().key;
    const newNeedKey = this.createNeedKey();

    this.updateCoverImage(newNeedKey, coverImage);

    if (bodyImages) {
      for (let i = 0; i < bodyImages.length; i++) {
        this.addBodyImage(newNeedKey, bodyImages[i]);
      }
    }

    //let needToSave = Object.assign({}, needToSave, )
    let dataToSave = {};

    dataToSave[`needs/${newNeedKey}`] = needToSave;
    dataToSave[`needsPerOrg/${orgId}/${newNeedKey}`] = true;

    return this.firebaseUpdate(dataToSave);

  }

  storeTempCoverImage(image: any) {
    // ToDo: Delete temporary image upon submit or cancel...
    const subject = new Subject();
    let key = this.dbRef.child('imagePaths/temp').push().key;
    let filePath = `images/temp/${key}`;
    let fileRef = this.fsRef.child(filePath);
    fileRef.put(image).then(snapshot => {
      //console.log(snapshot.metadata);
      let imageAccessors = {
        url: snapshot.metadata.downloadURLs[0],
        path: snapshot.metadata.fullPath,
        key: key
      }
      this.dbRef.child(`imagePaths/temp/${key}`).set(imageAccessors.path);
      //console.log(imageAccessors);
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
      console.log('uploaded a cover image:', snapshot);
      return this.db.object(`needs/${needKey}`).update({ coverImageUrl: snapshot.metadata.downloadURLs[0] });
    });
  }

  addBodyImage(needKey: string, bodyImage: any) {
    let fileName = bodyImage.name;
    let filepath = `images/${needKey}/bodyImages/${fileName}`;
    let fileRef = this.fsRef.child(filepath);
    fileRef.put(bodyImage).then(snapshot => {
      console.log('uplaoded a vody image:', snapshot);
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

  pendingPercent(need) {
    //return Math.round(((this.need.needTotal - this.need.collectedTotal) / this.need.needTotal));
    return Math.round(1 - 100 * ((need.needTotal - 1000) / need.needTotal));
  }

  oneDay = 24 * 60 * 60 * 1000;
  daysLeft(need) {
    return Math.round(Math.abs(((new Date(need.endDate).getTime() - new Date(Date.now()).getTime()) / this.oneDay)));
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
