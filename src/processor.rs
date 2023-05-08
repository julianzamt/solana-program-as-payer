use crate::{instructions::*, errors::*};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::{invoke, invoke_signed},
    pubkey::Pubkey,
    rent::Rent,
    system_instruction::create_account,
    sysvar::Sysvar,
};

pub struct Processor;

impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = ProgramAsPayerInstruction::unpack(instruction_data)?;

        match instruction {
            ProgramAsPayerInstruction::CreateNotPDA {} => {
                Self::process_create_not_pda_program_as_payer(accounts, program_id)?;
            },
            ProgramAsPayerInstruction::CreatePDA {} => {
                Self::process_create_pda_program_as_payer(accounts, program_id)?;
            },
        }

        Ok(())
    }

    pub fn process_create_not_pda_program_as_payer(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
        msg!("process_create_not_pda_program_as_payer ix...");

        let account_info_iter = &mut accounts.iter();

        let not_pda = next_account_info(account_info_iter)?;
        let program_account = next_account_info(account_info_iter)?;
        let _system_program = next_account_info(account_info_iter)?;

        let rent = Rent::get()?;
        let rent_minimum_balance = rent.minimum_balance(8);
        
        let space = 8;

        msg!("Creating NOT pda with program as payer...");
        invoke(
            &create_account(
                &program_account.key,
                &not_pda.key,
                rent_minimum_balance,
                space as u64,
                program_id,
            ),
            &[program_account.clone(), not_pda.clone()],
        )?;
        msg!("First not pda with program as payer creation succeded.");

        Ok(())
    }

    pub fn process_create_pda_program_as_payer(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
        msg!("process_create_pda_program_as_payer ix...");

        let account_info_iter = &mut accounts.iter();

        let pda = next_account_info(account_info_iter)?;
        let program_account = next_account_info(account_info_iter)?;
        let _system_program = next_account_info(account_info_iter)?;

        let (pda_address, bump) = Pubkey::find_program_address(&[b"pda"], program_id);
        
        if pda_address != *pda.key {
            return Err(ProgramAsPayerError::NotExpectedAddress.into());
        }
        
        let rent = Rent::get()?;
        let rent_minimum_balance = rent.minimum_balance(8);
        
        let space = 8;

        msg!("Creating pda with program as payer...");
        invoke_signed(
            &create_account(
                &program_id,
                &pda.key,
                rent_minimum_balance,
                space as u64,
                program_id,
            ),
            &[program_account.clone(), pda.clone()],
            &[&[b"pda", &[bump]]],
        )?;
        msg!("Pda creation succeded.");

        Ok(())
    }

    
}
