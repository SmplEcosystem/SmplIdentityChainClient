import {Injectable} from '@angular/core';
import {Client} from '@smplecosystem/smpl-identity-core';
import {AccountData, DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import {
  Bip39,
  EnglishMnemonic,
  Random,
  Secp256k1,
  sha256,
} from "@cosmjs/crypto";

@Injectable({
  providedIn: 'root'
})
export class SmplIdentityClientService {
  client?: any;
  wallet?: DirectSecp256k1HdWallet;
  didDocument = {
    id: 'billy',
    verificationMethods: [{}]
  }

  constructor() {
    this.init()
      .then(() => console.log('init complete'))
  }

  async init() {
    const mnemonic: string = 'crisp property humor budget flag outer spin write crouch check front deposit speak filter mechanic chunk stairs ancient catch zero kite initial during much'
    this.wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic);
    const c = new Client({
        apiURL: "http://localhost:1317",
        prefix: "cosmos",
        rpcURL: "http://localhost:26657"
      },
      this.wallet
    );

    // c.CosmosBankV1Beta1.query.queryAllBalances()
    // c.SmplidentitychainDid.query.queryResolveDidRequest('billy');

    this.client = c;
  }

  async getBalance() {
    const accountData: readonly AccountData[] | undefined = await this.wallet?.getAccounts();
    if (!accountData) return;
    return this.client?.CosmosBankV1Beta1.query.queryAllBalances(accountData[0].address);
  }

  async broadcastTransaction() {

    const accountData: readonly AccountData[] | undefined = await this.wallet?.getAccounts();
    if (!accountData) return;

    const result = await this.client?.SmplidentitychainDid.tx.sendMsgUpsertDid({
      value: {
        creator: accountData[0].address,
        didDocument: this.didDocument,
        didDocumentMetadata: {},
        signature: 'billy'
      },
      fee: {
        amount: [{amount: '0', denom: 'stake'}],
        gas: '200000',
      },
      memo: '',
    });
    // return tx_result;
    // const transactions = await client.SmplidentitychainDid.query.queryResolveDidRequest(creator);
    console.log('result', result);

    return result;
  };

  searchDid() {
    return this.client.SmplidentitychainDid.query.queryResolveDidRequest('billy');
  }

  async generateKeys() {
    const m = Bip39.encode(Random.getBytes(24)).toString();
    const seed = await Bip39.mnemonicToSeed(new EnglishMnemonic(m));
    return await Secp256k1.makeKeypair(sha256(seed));
  }

  async sign() {
    // const wallet = await DirectSecp256k1HdWallet.generate(24);
    const didDocumentString = JSON.stringify(this.didDocument);
    const didDocumentBuffer = Buffer.from(didDocumentString, 'utf-8');
    const didDocumentBiteArray = new Uint8Array(didDocumentBuffer);
    const didDocumentHash = sha256(didDocumentBiteArray);
    const keys = await this.generateKeys()
    const signature = await Secp256k1.createSignature(didDocumentHash, keys.privkey)
    console.log('signature', signature)
  }
}
