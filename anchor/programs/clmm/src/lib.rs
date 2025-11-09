#![allow(clippy::result_large_err)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
pub mod utils;
pub mod states;
pub mod instructions;
use crate::instructions::*;

declare_id!("5nwwbgvmTjrKoki74t7Pp1rxPata7Kxie4pcdn4j15Zi");

#[program]
pub mod clmm {
    use super::*;

    pub fn initialize_pool(ctx: Context<InitializePool>, tick_spacing: i32, initial_sqrt_price: u128) -> Result<()> {
        instructions::initialize_pool(ctx, tick_spacing, initial_sqrt_price)
    }

    pub fn open_position(ctx: Context<OpenPosition>, owner: Pubkey, lower_tick: i32, upper_tick: i32, liquidity_amount: u128, tick_array_lower_start_index: i32, tick_array_upper_start_index: i32) -> Result<(u64, u64)> {
        instructions::open_position(ctx, owner, lower_tick, upper_tick, liquidity_amount, tick_array_lower_start_index, tick_array_upper_start_index)
    }

    pub fn increase_liquidity(ctx: Context<IncreaseLiquidity>, lower_tick: i32, upper_tick: i32, liquidity_amount: u128) -> Result<(u64, u64)> {
        instructions::increase_liquidity(ctx, liquidity_amount, lower_tick, upper_tick)
    }

    pub fn decrease_liquidity(ctx: Context<DecreaseLiquidity>, lower_tick: i32, upper_tick: i32, liquidity_amount: u128) -> Result<(u64, u64)> {
        instructions::decrease_liquidity(ctx, liquidity_amount, lower_tick, upper_tick)
    }

    pub fn swap(ctx: Context<Swap>, amount_in: u64, swap_token_0_for_1: bool, amount_out_minimum: u64) -> Result<(u64)> {
        instructions::swap(ctx, amount_in, swap_token_0_for_1, amount_out_minimum)
    }
}
