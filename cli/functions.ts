import * as web3 from '@solana/web3.js';
import { Buffer } from 'buffer';
import { programId, SIGNER } from './constants';
import * as utils from './utils';

export const createNotPDAWithProgramAsPayer = async (
  connection: web3.Connection,
  notPda: web3.Keypair,
  programKeypair: web3.Keypair,
  feePayer: web3.Keypair = SIGNER
) => {
  let instructionNumber = 0;

  let dataBuffer = Buffer.from('');

  dataBuffer = utils.packUInt8(dataBuffer, instructionNumber);

  const instruction = new web3.TransactionInstruction({
    programId,
    keys: [
      { pubkey: notPda.publicKey, isSigner: true, isWritable: true },
      {
        pubkey: programKeypair.publicKey,
        isSigner: true,
        isWritable: true,
      },
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
    [feePayer, programKeypair, notPda]
  );
  return txReceipt;
};

export const createPDAWithProgramAsPayer = async (
  connection: web3.Connection,
  pda: web3.PublicKey,
  programKeypair: web3.Keypair,
  feePayer: web3.Keypair = SIGNER
) => {
  let instructionNumber = 1;

  let dataBuffer = Buffer.from('');

  dataBuffer = utils.packUInt8(dataBuffer, instructionNumber);

  const instruction = new web3.TransactionInstruction({
    programId,
    keys: [
      { pubkey: pda, isSigner: false, isWritable: true },
      {
        pubkey: programKeypair.publicKey,
        isSigner: true,
        isWritable: true,
      },
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
    [feePayer, programKeypair]
  );
  return txReceipt;
};
