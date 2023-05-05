use crate::{instructions::*};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::{invoke},
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
                Self::process_program_as_payer(accounts, program_id)?;
            }
        }

        Ok(())
    }

    pub fn process_program_as_payer(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
        msg!("process_program_as_payer ix...");

        let account_info_iter = &mut accounts.iter();

        let first_not_pda = next_account_info(account_info_iter)?;
        // let second_not_pda = next_account_info(account_info_iter)?;
        let program_account = next_account_info(account_info_iter)?;
        // let second_creation_payer = next_account_info(account_info_iter)?;
        let _system_program = next_account_info(account_info_iter)?;

        let rent = Rent::get()?;
        let rent_minimum_balance = rent.minimum_balance(8);
        
        let space = 8;

        msg!("Creating first not pda with program as payer...");
        invoke(
            &create_account(
                &program_account.key,
                &first_not_pda.key,
                rent_minimum_balance,
                space as u64,
                program_id,
            ),
            &[program_account.clone(), first_not_pda.clone()],
        )?;
        msg!("First not pda with program as payer creation succeded.");

        // msg!("Creating second not pda...");
        // invoke(
        //     &create_account(
        //         &second_creation_payer.key,
        //         &second_not_pda.key,
        //         rent_minimum_balance,
        //         space as u64,
        //         program_id,
        //     ),
        //     &[second_creation_payer.clone(), second_not_pda.clone()],
        // )?;
        // msg!("Second not pda creation succeded.");

        Ok(())
    }
}
