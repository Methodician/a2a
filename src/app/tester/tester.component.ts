import { UserService } from './../shared/data-services/user.service';
import { AuthService } from './../shared/security/auth.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FirebaseApp } from 'angularfire2';


@Component({
  selector: 'app-tester',
  templateUrl: './tester.component.html',
  styleUrls: ['./tester.component.css']
})
export class TesterComponent implements OnInit {

  uid = '';
  storage;
  fileInput: any = { files: null };
  //storageRef;
  constructor(
    @Inject(FirebaseApp) private app: any,
    private auth: AuthService,
    private userSvc: UserService
  ) {
    this.auth.authInfo$.subscribe(info => {
      this.uid = info.$uid;
    });
    //this.storage = app.storage();
    //const storageRef = app.storage().ref().child('images');
  }

  ngOnInit() {
    this.storage = this.app.storage();
    var storageRef = this.storage.ref();
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

  uplaodAFile() {

    //let reader = new FileReader();
    let input: any = document.getElementById('fileInput');
    var selectedFile = input.files[0];
    console.log(selectedFile)

    if (selectedFile.type !== 'image/jpeg') {
      alert('Only images allowed here');
      return;
    }
    //console.log('event:', event);
    //console.log('selectedFile:', selectedFile);
    let fileName = selectedFile.name;

    //  Create a root ref
    var storageRef = this.app.storage().ref();

    //  Create ref to 'electric bolt.jpg'
    //var boltRef = storageRef.child('electric bolt.jpg');
    let fileRef = storageRef.child(`images/${fileName}`);

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
    });
    //  i SHOULD LOOK BACK HERE FOR ERROR HANDLING: https://firebase.google.com/docs/storage/web/upload-files 

  }

  getAllFiles() {
    let pathRef = this.storage.ref('images/electric arc.jpg');
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




  addUserProperty(name, value) {
    //console.log('Name:', name);
    //console.log('Value:', value);
    let property = JSON.parse(`{ "${name}": "${value}" }`);
    this.userSvc.updateUserInfo(property);
  }

}
