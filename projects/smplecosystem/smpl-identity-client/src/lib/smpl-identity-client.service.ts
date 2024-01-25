import { Injectable } from '@angular/core';
import {Client} from '@smplecosystem/smpl-identity-core';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";

@Injectable({
  providedIn: 'root'
})
export class SmplIdentityClientService {

  constructor() {

  }

  async broadcastTransaction(creator: string) {
    const mnemonic: string = 'security require mad bronze cabin name advance fee hidden arrest swift blast try valley midnight raccoon gym such grape fury try seven power orchard';
    const walletAddressFromMnemonic = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);

    const client = new Client({
        apiURL: "http://localhost:1317",
        prefix: "cosmos",
        rpcURL: "http://localhost:26657"
      },
      walletAddressFromMnemonic
    );

    await client.SmplidentitychainDid.tx.sendMsgUpsertDid({
      value: {
        creator: creator,
        didDocument: undefined,
        didDocumentMetadata: undefined,
        signature: 'billy'
      },
      fee: {
        amount: [{ amount: '0', denom: 'stake' }],
        gas: '200000',
      },
      memo: '',
    }).then(result => console.log('tx result', result));
    // return tx_result;
    // const transactions = await client.SmplidentitychainDid.query.queryResolveDidRequest(creator);
    // console.log('transactions', transactions)
  };
}
