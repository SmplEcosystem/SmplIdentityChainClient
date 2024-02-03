import {Injectable} from '@angular/core';
import {Client} from '@smplecosystem/smpl-identity-core';
import {AccountData, DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import {Bip39, EnglishMnemonic, Random, Secp256k1, sha256,} from "@cosmjs/crypto";
import bs58 from 'bs58';


@Injectable({
  providedIn: 'root'
})
export class SmplIdentityClientService {
  client?: any;
  wallet?: DirectSecp256k1HdWallet;

  constructor() {
    this.init()
      .then(() => console.log('init complete'))
  }

  async init() {
    const mnemonic: string = 'wrist argue hammer pumpkin avoid illegal occur celery impose outside insane mammal crouch flavor robot inner top forest mystery detail fox fire nephew shell'
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
    // c.SmplidentitychainDid.tx.sendMsgUpsertDid()
  }

  async getBalance() {
    const accountData: readonly AccountData[] | undefined = await this.wallet?.getAccounts();
    if (!accountData) return;
    return this.client?.CosmosBankV1Beta1.query.queryAllBalances(accountData[0].address);
  }

  async generateDidDocument() {
    const keys = await this.generateKeys()
    const b58PublicKey = bs58.encode(keys.pubkey)
    return {
      id: 'did:smpl:12234',
      verificationMethods: [
        {
          id: "did:smpl:12234#key1",
          type: "Ed25519VerificationKey2018",
          controller: "did:example:123",
          publicKeyBase58: b58PublicKey
        }
      ]
    }
  }

  async broadcastTransaction() {

    const accountData: readonly AccountData[] | undefined = await this.wallet?.getAccounts();
    if (!accountData) return;
    const signature = await this.sign()

    const result = await this.client?.SmplidentitychainDid.tx.sendMsgUpsertDid({
      value: {
        creator: '',
        didDocument: await this.generateDidDocument(),
        didDocumentMetadata: {},
        signature: signature.toFixedLength()
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
    const didDocumentString = JSON.stringify(this.generateDidDocument());
    const didDocumentBuffer = Buffer.from(didDocumentString, 'utf-8');
    const didDocumentBiteArray = new Uint8Array(didDocumentBuffer);
    const didDocumentHash = sha256(didDocumentBiteArray);

    const keys = await this.generateKeys()
    return await Secp256k1.createSignature(didDocumentHash, keys.privkey)


    // console.log('signature', signature)
    // const verified = await Secp256k1.verifySignature(signature, didDocumentHash, keys.pubkey);
    // console.log('verified', verified)
    // const p = bs58.encode(Buffer.from(keys.pubkey))
    // const pr = bs58.encode(Buffer.from(keys.privkey))
    // console.log('bs58 pubkey', p)
    // console.log('bs58 privkey', pr)

  }
}
