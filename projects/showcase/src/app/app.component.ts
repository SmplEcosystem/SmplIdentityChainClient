import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {
  SmplIdentityClientService
} from "../../../smplecosystem/smpl-identity-client/src/lib/smpl-identity-client.service";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import CryptoJS from "crypto-js";
import * as secp256k1 from "secp256k1";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'showcase';

  address: string = '';

  balance: any;

  save: any;

  did: any;

  privateKey = this.createPrivateKey();
  myPassword = 'myPassword';
  encryptedPrivateKey = this.encryptPrivateKey(this.privateKey, this.myPassword);

  constructor(
    private smplIdentityClientService: SmplIdentityClientService,
  ) {
  }

  async ngOnInit() {
    console.log('key', this.privateKey)
    console.log('encrypted key', this.encryptedPrivateKey)
    setTimeout(() => {
      this.decrypt();
    }, 500)
  }

  async getBalances() {

    this.balance = await this.smplIdentityClientService.getBalance();
  }

  async b() {
    this.save = await this.smplIdentityClientService.broadcastTransaction();
  }

  async s() {
    this.did = await this.smplIdentityClientService.searchDid();
  }

  createPrivateKey() {
    let privateKey;
    do {
      privateKey = CryptoJS.lib.WordArray.random(32).toString();
    } while (!secp256k1.privateKeyVerify(Buffer.from(privateKey, 'hex')))
    return privateKey;
  }

  encryptPrivateKey(privateKey: string, password: string) {
    return CryptoJS.AES.encrypt(privateKey, password).toString();
  }

  decrypt() {
    console.log('decrypted key', CryptoJS.AES.decrypt(this.encryptedPrivateKey, this.myPassword).toString())
  }
}
