import * as web3 from '@solana/web3.js';
import { Buffer } from 'buffer';
import { programId, SIGNER } from './constants';
import * as utils from './utils';

export const createNotPDAWithProgramAsPayer = async (
  connection: web3.Connection,
  first_not_pda: web3.Keypair,
  // second_not_pda: web3.Keypair,
  programAccount: web3.Keypair,
  feePayer: web3.Keypair = SIGNER
) => {
  let instructionNumber = 0;

  let dataBuffer = Buffer.from('');

  dataBuffer = utils.packUInt8(dataBuffer, instructionNumber);

  const instruction = new web3.TransactionInstruction({
    programId,
    keys: [
      { pubkey: first_not_pda.publicKey, isSigner: true, isWritable: true },
      // { pubkey: second_not_pda.publicKey, isSigner: true, isWritable: true },
      {
        pubkey: programAccount.publicKey,
        isSigner: true,
        isWritable: true,
      },
      // {
      //   pubkey: secondCreationPayer.publicKey,
      //   isSigner: true,
      //   isWritable: true,
      // },
      {
        pubkey: web3.SystemProgram.programId,
        isSigner: false,
        isWritable: true,
      },
    ],
    data: dataBuffer,
  });

  let txReceipt = await web3.sendAndConfirmTransaction(
    connection,
    new web3.Transaction().add(instruction),
    [
      feePayer,
      programAccount,
      first_not_pda,
      // second_not_pda,
    ]
  );
  return txReceipt;
};
