import * as web3 from '@solana/web3.js';
import {
  createNotPDAWithProgramAsPayer,
  createPDAWithProgramAsPayer,
} from './functions';
import { programId } from './constants';
import programSecret from '../target/deploy/program_as_payer-keypair.json';

const connection = new web3.Connection('http://127.0.0.1:8899');

async function main() {
  let notPda = web3.Keypair.generate();
  let programKeypair = web3.Keypair.fromSecretKey(Buffer.from(programSecret));

  // await createNotPDAWithProgramAsPayer(connection, notPda, programKeypair);

  let [pda, _] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('pda')],
    programId
  );
  
  await createPDAWithProgramAsPayer(connection, pda, programKeypair);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
