use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Arithmetic Overflow")]
    ArithmeticOverflow,
    #[msg("Invalid Tick Range")]
    InvalidTickRange,
    #[msg("Insufficient Input Amount")]
    InsufficientInputAmount,
    #[msg("Slippage Exceeded")]
    SlippageExceeded,
    #[msg("Insufficient Liquidity")]
    InsufficientLiquidity,
    #[msg("Invalid Tick Spacing")]
    InvalidTickSpacing,
    #[msg("Invalid Price")]
    InvalidPrice,
    #[msg("Invalid Position Owner")]
    InvalidPositionOwner,
    #[msg("Invalid Position Range")]
    InvalidPositionRange,
    #[msg("Tick Not Found")]
    TickNotFound,
    #[msg("Token 0 Transfer Failed")]
    Token0TransferFailed,
    #[msg("Token 1 Transfer Failed")]
    Token1TransferFailed,
    #[msg("Invalid Bump")]
    InvalidBump,
    #[msg("Invalid Tick Array Account")]
    InvalidTickArrayAccount,
    #[msg("Invalid Token Pair (Mints cannot be identical)")]
    InvalidTokenPair,
    #[msg("Minted liquidity must cover the current price tick interval")]
    MintRangeMustCoverCurrentPrice,
    #[msg("Burned liquidity must cover the current price tick interval")]
    BurnRangeMustCoverCurrentPrice,
    #[msg("Insufficient Pool Liquidity to fulfill swap")]
    InsufficientPoolLiquidity,
    #[msg("Invalid Pool Liquidity")]
    InvalidPoolLiquidity,
    #[msg("No Liquidity To Remove")]
    NoLiquidityToRemove,
    #[msg("Invalid Tick Array Bump")]
    InvalidTickArrayBump,
    #[msg("Invalid Tick Array Start Index")]
    InvalidTickArrayStartIndex,
    #[msg("Invalid Tick Array Pool")]
    InvalidTickArrayPool,
}