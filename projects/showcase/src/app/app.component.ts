import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {
  SmplIdentityClientService
} from "../../../smplecosystem/smpl-identity-client/src/lib/smpl-identity-client.service";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";


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

  constructor(
    private smplIdentityClientService: SmplIdentityClientService,
  ) {
  }

  async ngOnInit() {
    await this.smplIdentityClientService.sign()
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
}
