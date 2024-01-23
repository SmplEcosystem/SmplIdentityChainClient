import { Injectable } from '@angular/core';
import {Client} from '@smplecosystem/smpl-identity-core';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

@Injectable({
  providedIn: 'root'
})
export class SmplIdentityClientService {

  constructor() {

  }

  async getWallet() {
    const mnemonic: string = 'measure sunny ritual tone local dice fame wood bar arm slam bean cricket spirit knife right join expose party axis fun reopen push oval';
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);

    const client = new Client({
    apiURL: "http://localhost:1317",
    prefix: "http://localhost:26657",
    rpcURL: "cosmos"
  },
    wallet
  );
    const balances = await client.CosmosBankV1Beta1.query.queryAllBalances(
      'cosmos1qvyjz6j4anqj40hxq3s5dgd67nlxldmwzvjf6j'
    );
  }
}
