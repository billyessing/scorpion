import { Component, OnInit, Input } from '@angular/core';
import { Security } from './../../../shared/models/security.model';
import { Observable } from 'rxjs/Observable';
import { FirestoreService } from './../../../shared/services/firestore.service';
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument } from 'angularfire2/firestore';
import { map, take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-existing-security',
  templateUrl: './existing-security.component.html',
  styleUrls: ['./existing-security.component.scss']
})
export class ExistingSecurityComponent implements OnInit {

  @Input() security: Security;
  imgUrl: string;

  constructor(private db: FirestoreService) {

  }

  ngOnInit() {
    this.setUrl();
  }

  setUrl() {
    this.imgUrl = "https://www.asx.com.au/asx/1/image/logo/" + this.security.code + "?image_size=L&v=1382327267000"
  }

}
