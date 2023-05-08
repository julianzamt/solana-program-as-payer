use crate::*;
use solana_program::{msg, program_error::ProgramError};

#[derive(Debug)]
pub enum ProgramAsPayerInstruction {
    CreateNotPDA {},
    CreatePDA {},
}

impl ProgramAsPayerInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        msg!("Unpacking instruction...");

        let (tag, _) = input
            .split_first()
            .ok_or(errors::ProgramAsPayerError::InvalidInstruction)?;

        Ok(match tag {
            0 => Self::CreateNotPDA {},
            1 => Self::CreatePDA {},
            _ => return Err(errors::ProgramAsPayerError::InvalidInstruction.into()),
        })
    }
}
