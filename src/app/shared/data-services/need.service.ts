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

  createContributionId() {
    return this.dbRef.child('contributions').push().key;
  }

  //  DELETE ME!!!!!!!!!!!!
  thing() {
    let thing = {
      mc_currency: 'USD',
      business: 'methodician@gmail.com',
      payment_type: 'instant',
      protection_eligibility: 'Ineligible',
      verify_sign: 'AVfSQ5PLCwiNa3zy.rOy.Na-EbloAuY16GSLP1p4JmwvBTW1P9OvjVGL',
      payer_status: 'verified',
      test_ipn: '1',
      tax: '0.00',
      payer_email: 'methodician-1@gmail.com',
      txn_id: '9480781010830610E',
      quantity: '0',
      receiver_email: 'methodician@gmail.com',
      first_name: 'Jacob',
      payer_id: 'EDJRBNJ7AKSBN',
      receiver_id: '4S3ZNLHAF9LKQ',
      item_number: '',
      payer_business_name: 'Jacob Johnston\'s Test Store',
      payment_status: 'Completed',
      payment_fee: '0.42',
      mc_fee: '0.42',
      mc_gross: '4.00',
      custom: '{"contributionId":"-KdRoHmdimqxaBKwtapG","orgId":"7nysLU8UVcPfcnWpOHJWTMdzikB3","needId":"-KcexlmlgWbLQrpBAjwb"}',
      charset: 'windows-1252',
      notify_version: '3.8',
      ipn_track_id: 'c8f59abd6e56e'
    }
  }

  getAllNeeds() {
    return this.db.list('needs');
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

    const newNeedKey = this.dbRef.child('needs').push().key;

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

  pendingPercent(need) {
    //return Math.round(((this.need.needTotal - this.need.collectedTotal) / this.need.needTotal));
    return Math.round(1 - 100 * ((need.needTotal - 1000) / need.needTotal));
  }

  oneDay = 24 * 60 * 60 * 1000;
  daysLeft(need) {
    return Math.round(Math.abs(((new Date(need.endDate).getTime() - new Date(Date.now()).getTime()) / this.oneDay)));
  }

}
