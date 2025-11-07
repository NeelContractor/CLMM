#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
pub mod utils;
pub mod states;
pub mod instructions;

declare_id!("Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe");

#[program]
pub mod clmm {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>, tick_spacing: i32, initial_sqrt_price: u128) -> Result<()> {
        Ok(())
    }

    pub fn open_position(ctx: Context<OpenPosition>, owner: Pubkey, lower_tick: i32, upper_tick: i32, liquidity_amount: u128, _tick_array_lower_start_index: i32, _tick_array_upper_start_index: i32) -> Result<()> {
        Ok(())
    }

    pub fn increase_liquidity(ctx: Context<IncreaseLiquidity>, lower_tick: i32, upper_tick: i32, liquidity_amount: u128) -> Result<()> {
        Ok(())
    }

    pub fn decrease_liquidity(ctx: Context<DecreaseLiquidity>, lower_tick: i32, upper_tick: i32, liquidity_amount: u128) -> Result<()> {
        Ok(())
    }

    pub fn swap(ctx: Context<Swap>, amount_in: u64, swap_token_0_for_1: bool, amount_out_minimum: u64) -> Result<()> {
        Ok(())
    }

}
