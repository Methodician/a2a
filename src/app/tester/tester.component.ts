import { UserService } from './../shared/data-services/user.service';
import { AuthService } from './../shared/security/auth.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';

const storageBaseURL = 'https://firebasestorage.googleapis.com/b/';

@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  styleUrls: ['./tester.component.css']
})
export class TesterComponent implements OnInit {

  uid = '';
  storage;
  fileInput: any = { files: null };
  filePaths: FirebaseListObservable<string[]> = new FirebaseListObservable<string[]>(null);

  storageUrl: string;
  //storageRef;
  constructor(
    @Inject(FirebaseApp) app,
    private auth: AuthService,
    private userSvc: UserService,
    private db: AngularFireDatabase
  ) {
    this.auth.authInfo$.subscribe(info => {
      this.uid = info.$uid;
    });
    this.storage = app.storage();
    //this.storage = app.storage();
    //const storageRef = app.storage().ref().child('images');
  }

  ngOnInit() {
    this.filePaths = this.db.list('allImagePaths');


    var storageRef = this.storage.ref();
    console.log('Storage Ref:', storageRef);

    this.storageUrl = storageBaseURL + storageRef.bucket + '/o/';
    console.log('storageUrl:', this.storageUrl);

    var imagesRef = storageRef.child('images');
    var spaceRef = storageRef.child('images/space.jpg');
    var secondImagesRef = spaceRef.parent;
    var secondStorageRef = spaceRef.root;
    //  You can chain parant and child ref together to navigate from one ref to another
    var earthRef = spaceRef.parent.child('earth.jpg');
    //  Prent of the root is always a null reference...
    var nullRef = spaceRef.root.parent;

    //  You can inspect references to better understand the files they point to
    //  using the fullPath, name, and bucket properties. These properties get the
    //  full path of the file, the name of the file, and the bucket the file is stored in.

    //  This is like a file path on a disk:
    var spacePath = spaceRef.fullPath;
    console.log('Path:', spacePath);

    //  This is like the file name:
    var spaceName = spaceRef.name; // Should be "space.jpg" I guess?
    console.log('Name:', spaceName);

    //  This is the name of the Google Cloud "storage bucket" where the files are stored:
    var bucketName = spaceRef.bucket;
    console.log('Bucket:', bucketName);



  }

  makeStorageUrl(URL) {
    return this.storage.refFromURL(URL);
  }

  uploadFiles() {
    let input: any = document.getElementById('filesInput');
    var selectedFiles = input.files;
    var storageRef = this.storage().ref();

    //console.log('File Count:', selectedFiles.length);
    //console.log('All files selected:', selectedFiles);
    for (let i = 0, numFiles = selectedFiles.length; i < numFiles; i++) {
      if (selectedFiles[i].type !== 'image/jpeg') {
        alert('Only images allowed here');
        return;
      }
      //console.log(selectedFiles[i]);
      let fileName = selectedFiles[i].name;
      let filePath = `images/${this.uid}/$moreImages/${fileName}`;
      let fileRef = storageRef.child(filePath);
      //this.db.list('allImagePaths').push(filePath);
      fileRef.put(selectedFiles[i]).then(snapshot => {
        console.log('uploaded a file:', snapshot.metadata.downloadURLs);
        console.log('uploaded a file:', snapshot.metadata.downloadURLs[0]);
        this.db.list('allImagePaths').push(snapshot.metadata.downloadURLs[0]);
      });
    }
  }

  uplaodAFile() {

    let input: any = document.getElementById('fileInput');
    var selectedFile = input.files[0];
    console.log(selectedFile)

    if (selectedFile.type !== 'image/jpeg') {
      alert('Only images allowed here');
      return;
    }
    //console.log('selectedFile:', selectedFile);
    let fileName = selectedFile.name;

    //  Create a root ref
    var storageRef = this.app.storage().ref();

    //  Create ref to 'electric bolt.jpg'
    //var boltRef = storageRef.child('electric bolt.jpg');
    let filePath = `images/${this.uid}/${fileName}`;
    let fileRef = storageRef.child(filePath);
    //this.db.list('allImagePaths').push(filePath);

    //  Create ref to 'images/electric bolt.jpg'
    //var boltImagesRef = storageRef.child('images/electric bolt.jpg');

    // THey have the same file name but different reference files
    //console.log('The names are the same:', boltRef.name === boltImagesRef.name);
    //console.log('The paths are the same:', boltRef.fullPath === boltImagesRef.fullPath);
    /*var metadata = {
      //  Does not work I'm guessing since this isnt valid file metadata...
      uid: this.uid,
      declaration: 'Im the boss'
    }*/
    fileRef.put(selectedFile/*, metadata*/).then((snapshot) => {
      console.log('Uploaded a file');
      console.log(snapshot);
      this.db.list('allImagePaths').push(snapshot.metadata.downloadURLs[0]);
    });
    //  i SHOULD LOOK BACK HERE FOR ERROR HANDLING: https://firebase.google.com/docs/storage/web/upload-files 

  }

  getOneFile(filePath) {
    let pathRef = this.storage.ref(filePath);
    let imgDisplay: any = document.getElementById('imageDisplay');
    pathRef.getDownloadURL().then((url) => {
      imgDisplay.src = url;
    }).catch((err) => {
      switch (err.code) {
        case 'storage/object_not_found':
          alert('Couldn\'t find the file');
          break;
        case 'storage/unauthorized':
          alert('Sorry but you don\'t have permission to access this file');
          break;
        case 'storage/canceled':
          alert('It looks like you canceled the upload');
          break;
        case 'storage/unknwon':
          alert('An unknown error occured. Please report the problem to the team');
          break;
      }
    });
  }
  getAllFiles() {
    /*let pathRef = this.storage.ref(`images/${this.uid}/data-flow.jpg`);
    console.log(pathRef);*/
    let path = `images/${this.uid}/data-flow.jpg`;
    let imgDisplay: any = document.getElementById('imageDisplay');
    this.downloadUrlFromPath(path).then(url => {
      console.log(url);
      imgDisplay.src = url;
    });
  }

  downloadUrlFromPath(path: string) {
    let pathRef = this.storage.ref(path);
    return new Promise((resolve, reject) => {
      pathRef.getDownloadURL().then((url) => {
        return resolve(url);
      }).catch((err) => {
        switch (err.code) {
          case 'storage/object_not_found':
            alert('Couldn\'t find the file');
            break;
          case 'storage/unauthorized':
            alert('Sorry but you don\'t have permission to access this file');
            break;
          case 'storage/canceled':
            alert('It looks like you canceled the upload');
            break;
          case 'storage/unknwon':
            alert('An unknown error occured. Please report the problem to the team');
            break;
        }
        return reject(err);
      });
    });
  }


  addUserProperty(name, value) {
    //console.log('Name:', name);
    //console.log('Value:', value);
    let property = JSON.parse(`{ "${name}": "${value}" }`);
    this.userSvc.updateUserInfo(property);
  }

}
