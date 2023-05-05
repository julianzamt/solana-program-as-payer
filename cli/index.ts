import * as web3 from '@solana/web3.js';
import { createNotPDAWithProgramAsPayer } from './functions';
import { programId } from './constants';

const connection = new web3.Connection('http://127.0.0.1:8899');

async function main() {
  let first_not_pda = web3.Keypair.generate();
  // let second_not_pda = web3.Keypair.generate();

  // let firstCreationPayer = web3.Keypair.generate();
  // let secondCreationPayer = web3.Keypair.generate();

  let programPrivateKey = web3.Keypair.fromSecretKey(
    Buffer.from([
      221, 7, 230, 73, 98, 28, 255, 112, 170, 40, 150, 62, 67, 203, 120, 45,
      230, 84, 62, 197, 56, 170, 240, 163, 206, 38, 39, 67, 137, 38, 254, 134,
      22, 230, 162, 170, 42, 82, 82, 237, 166, 129, 95, 173, 4, 103, 197, 22,
      16, 130, 253, 84, 208, 199, 51, 162, 155, 44, 86, 170, 205, 197, 224, 139,
    ])
  );

  // let txhash = await connection.requestAirdrop(programPrivateKey.publicKey, 1e9);
  // // let txhash = await connection.requestAirdrop(firstCreationPayer.publicKey, 1e9);

  // let blockHash = await connection.getLatestBlockhashAndContext();

  // await connection.confirmTransaction({
  //   blockhash: blockHash.value.blockhash,
  //   lastValidBlockHeight: blockHash.value.lastValidBlockHeight,
  //   signature: txhash,
  // });

  // txhash = await connection.requestAirdrop(secondCreationPayer.publicKey, 1e9);

  // blockHash = await connection.getLatestBlockhashAndContext();

  // await connection.confirmTransaction({
  //   blockhash: blockHash.value.blockhash,
  //   lastValidBlockHeight: blockHash.value.lastValidBlockHeight,
  //   signature: txhash,
  // });

  await createNotPDAWithProgramAsPayer(
    connection,
    first_not_pda,
    programPrivateKey
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
