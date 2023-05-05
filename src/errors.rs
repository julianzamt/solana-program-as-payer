use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone)]
pub enum ProgramAsPayerError {
    #[error("Invalid Instruction")]
    InvalidInstruction,

    #[error("Already Initialized")]
    AlreadyInitialized,

    #[error("Not The Expected Account Address")]
    NotExpectedAddress,

    #[error("Invalid String")]
    InvalidString,
}

impl From<ProgramAsPayerError> for ProgramError {
    fn from(e: ProgramAsPayerError) -> Self {
        ProgramError::Custom(e as u32)
    }
}
