import { Observable } from 'rxjs/Observable';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import { Injectable, Inject } from '@angular/core';
import { Subject } from "rxjs/Subject";
import * as firebase from 'firebase';

@Injectable()
export class SpotlightService {
  dbRef: any;
  fsRef: any;

  constructor(
    private db: AngularFireDatabase,
    // @Inject(FirebaseRef) fb,
    @Inject(FirebaseApp) app
  ) {
    this.dbRef = firebase.database().ref();
    // this.dbRef = fb.database().ref();
    this.fsRef = app.storage().ref();
  }

  getSpotlight(id: string) {
    return this.db.object(`spotlights/${id}`);
  }

  getAllSpotlights() {
    return this.db.list('spotlights');
  }

  getActiveSpotlights(): Observable<any[]> {
    return this.db.list('spotlights', {
      query: {
        orderByChild: 'activeFlag',
        equalTo: true
      }
    })
      .filter(res => res && res.length > 0);
  }

  getSpotlightsByOrg(orgId: string): Observable<any[]> {
    return this.db.list('spotlights', {
      query: {
        orderByChild: 'orgId',
        equalTo: orgId
      }
    })
      .filter(res => res && res.length > 0);
  }

  getSpotlightImages(spotlight: any) {
    this.db.list(`spotlightImageUrls/${spotlight.$key}`)
      .subscribe(images => {
        spotlight.bodyImageUrls = images;
      });
  }

  createNewSpotlight(orgId: string, spotlight: any, coverImage: any, bodyImages?: any[]): Observable<any> {
    let timestamp = firebase.database.ServerValue.TIMESTAMP;
    let spotlightToSave = Object.assign({}, spotlight, { orgId }, { activeFlag: true }, { timestamp });
    if (coverImage.type !== 'image/jpeg' && coverImage.type !== 'image/bmp' && coverImage.type !== 'image/png' && coverImage.type !== 'image/gif') {
      alert('The file type you used for cover image doesn\'t look like an image...');
      return;
    }
    if (bodyImages) {
      for (let i = 0; i < bodyImages.length; i++) {
        if (bodyImages[i].type !== 'image/jpeg' && bodyImages[i].type !== 'image/bmp' && bodyImages[i].type !== 'image/png' && bodyImages[i].type !== 'image/gif') {
          alert('The file type you used for one of your body images doesn\'t look like an image...')
          return;
        }
      }
    }

    const newSpotlightKey = this.createSpotlightKey();
    this.updateCoverImage(newSpotlightKey, coverImage);
    if (bodyImages) {
      for (let i = 0; i < bodyImages.length; i++) {
        this.addBodyImage(newSpotlightKey, bodyImages[i]);
      }
    }

    let dataToSave = {};

    dataToSave[`spotlights/${newSpotlightKey}`] = spotlightToSave;
    dataToSave[`spotlightsPerOrg/${orgId}/${newSpotlightKey}`] = true;

    return this.firebaseUpdate(dataToSave);

  }

  toggleActivation(spotlightKey: string, newActiveFlag: boolean) {
    this.db.object(`spotlights/${spotlightKey}`).update({ activeFlag: newActiveFlag });
  }

  storeTempImage(image: any) {
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

  deleteTempImages(accessors: any[]) {
    //this.fsRef.child(`images/temp/${spotlightKey}/`).delete();
    for (let accessor of accessors) {
      this.fsRef.child(accessor.path).delete();
      this.dbRef.child(`imagePaths/temp/${accessor.key}`).remove();
    }
  }

  updateCoverImage(spotlightKey: string, coverImage: any) {
    let fileName = coverImage.name;
    let filePath = `images/${spotlightKey}/${fileName}`;
    let fileRef = this.fsRef.child(filePath);
    fileRef.put(coverImage).then(snapshot => {
      return this.db.object(`spotlights/${spotlightKey}`).update({ coverImageUrl: snapshot.metadata.downloadURLs[0] });
    });
  }

  addBodyImage(spotlightKey: string, bodyImage: any) {
    let fileName = bodyImage.name;
    let filepath = `images/${spotlightKey}/bodyImages/${fileName}`;
    let fileRef = this.fsRef.child(filepath);
    fileRef.put(bodyImage).then(snapshot => {
      return this.db.list(`spotlightImageUrls/${spotlightKey}`).push(snapshot.metadata.downloadURLs[0]);
    });
  }

  createSpotlightKey() {
    return this.dbRef.child('spotlights').push().key;
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
