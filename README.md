# Solana Program As Payer of an Account Creation
This is a research program to test out if a program (aka executable account) can or not be used as the rent payer inside a Solana program during
an account creation.

Spoiler: Is Not possible, either for PDAs or not PDAs. The error is not very clear: `<program_id> writable privilege escalated`.

(I think this is because to be used as payer, an account must be sent as writable to allow debit of its lamports, but since an executable account is owned by the BPFLoader program, the SystemProgram cannot debit (But not completely sure))

A side effect of this research was to notice that a program account cannot be airdropped, but there is no error: The runtime just tilts and eventually it throws with `timeout error`.

## Usage
Pre-Requirements:
* solana cli
* nodeJS

### From the root folder:
1 - cd program-as-payer/cli && npm install && cd ../..
2 - solana-test-validator -r (This will start a local validator)  

### In another terminal:
3 - `cd program-as-payer/ && cargo build-sbf && solana program deploy target/deploy/program-as-payer.so --url localhost && cd ..`  
4 - Paste the returned programId into the PROGRAM_ID field in program-as-payer/cli/constants.ts   
5 - In program-as-payer/cli/constants.ts, insert your test private key. Try: $cat ~/.config/solana/id.json (If you don't have one yet, run `solana-keygen new` first)  
6 - Open creaprogram-as-payertor/cli/index.ts. You'll find function calls to send txs to the deployed contracts.  
7 - Comment and uncomment fns to have a taste of what you can and cannot do.  