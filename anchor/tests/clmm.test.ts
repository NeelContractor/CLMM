import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js'
import { createAssociatedTokenAccount, createMint, mintTo, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Clmm } from '../target/types/clmm'
import { BN } from 'bn.js'

describe('CLMM', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Clmm as Program<Clmm>

  const TICK_SPACING = 60;
  const INITIAL_SQRT_PRICE = new BN("79228162514264337593543950336"); // sqrt 2^96
  const TICKs_PER_ARRAY = 30;
  const LOWER_TICK = 0;
  const UPPER_TICK = 4000;
  const LIQUIDITY_AMOUNT = new BN("100000") ;

  let tokenMint0: PublicKey;
  let tokenMint1: PublicKey;
  let poolPda: PublicKey;
  let tokenVault0Keypair: Keypair;
  let tokenVault1Keypair: Keypair;
  let userTokenAccount0: PublicKey;
  let userTokenAccount1: PublicKey;

  function i32ToLeBytes(value: number): Buffer {
    const buffer = Buffer.allocUnsafe(4);
    buffer.writeInt32LE(value, 0);
    return buffer;
  }

  function getTickArrayStartIndex(tick: number, tickSpacing: number): number {
    const ticksPerArrayI32 = TICKs_PER_ARRAY;
    const arrayIdx = Math.floor(Math.floor(tick / tickSpacing) / ticksPerArrayI32);
    return arrayIdx * ticksPerArrayI32 * tickSpacing;
  }

  beforeAll(async () => {
    [poolPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool")],
      program.programId
    );

    tokenMint0 = await createMint(
      provider.connection,
      payer.payer,
      payer.publicKey,
      null,
      6
    );

    tokenMint1 = await createMint(
      provider.connection,
      payer.payer,
      payer.publicKey,
      null,
      6
    );

    [poolPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("pool"), tokenMint0.toBuffer(), tokenMint1.toBuffer(), i32ToLeBytes(TICK_SPACING)],
      program.programId
    );

    tokenVault0Keypair = Keypair.generate();
    tokenVault1Keypair = Keypair.generate();

    userTokenAccount0 = await createAssociatedTokenAccount(
      provider.connection,
      payer.payer,
      tokenMint0,
      payer.publicKey
    );

    userTokenAccount1 = await createAssociatedTokenAccount(
      provider.connection,
      payer.payer,
      tokenMint1,
      payer.publicKey
    );

    await mintTo(
      provider.connection,
      payer.payer,
      tokenMint0,
      userTokenAccount0,
      payer.publicKey,
      1000000000
    );

    await mintTo(
      provider.connection,
      payer.payer,
      tokenMint1,
      userTokenAccount1,
      payer.publicKey,
      1000000000
    );

  })

  it('Initialize Pool', async () => {
    await program.methods
      .initializePool(TICK_SPACING, INITIAL_SQRT_PRICE)
      .accountsStrict({
        payer: payer.publicKey,
        pool: poolPda,
        tokenMint0,
        tokenMint1,
        tokenVault0: tokenVault0Keypair.publicKey,
        tokenVault1: tokenVault1Keypair.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY
      })
      .signers([tokenVault0Keypair, tokenVault1Keypair])
      .rpc()

    const pool = await program.account.pool.fetch(poolPda);

    expect(pool.tickSpacing).toEqual(TICK_SPACING)
    expect(pool.tokenMint0).toEqual(tokenMint0.toBase58());
    expect(pool.tokenMint1).toEqual(tokenMint1.toBase58());
    expect(pool.globalLiquidity.toNumber()).toEqual(0);
  })

  it('Open Position in pool', async () => {
    const lowerTickArrayStartIndex = getTickArrayStartIndex(LOWER_TICK, TICK_SPACING);
    const upperTickArrayStartIndex = getTickArrayStartIndex(UPPER_TICK, TICK_SPACING);

    const [lowerTickArrayPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("tick_array"), poolPda.toBuffer(), i32ToLeBytes(lowerTickArrayStartIndex)],
      program.programId
    );
    const [upperTickArrayPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("tick_array"), poolPda.toBuffer(), i32ToLeBytes(upperTickArrayStartIndex)],
      program.programId
    );
    const [positionPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("position"), payer.publicKey.toBuffer(), poolPda.toBuffer(), i32ToLeBytes(LOWER_TICK), i32ToLeBytes(UPPER_TICK)],
      program.programId
    ); 

    await program.methods
      .openPosition(
        payer.publicKey,
        LOWER_TICK,
        UPPER_TICK,
        LIQUIDITY_AMOUNT,
        lowerTickArrayStartIndex,
        upperTickArrayStartIndex
      )
      .accountsStrict({
        payer: payer.publicKey,
        pool: poolPda,
        position: positionPda,
        lowerTickArray: lowerTickArrayPda,
        upperTickArray: upperTickArrayPda,
        userToken0: userTokenAccount0,
        userToken1: userTokenAccount1,
        poolToken0: tokenVault0Keypair.publicKey,
        poolToken1: tokenVault1Keypair.publicKey,
        tokenMint0: tokenMint0,
        tokenMint1: tokenMint1,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY
      })
      .signers([payer.payer])
      .rpc()

    const position = await program.account.position.fetch(positionPda);
    expect(position.owner.toBase58()).toEqual(payer.publicKey.toBase58());
    expect(position.pool.toBase58()).toEqual(poolPda.toBase58());
    expect(position.tickLower).toEqual(LOWER_TICK);
    expect(position.tickUpper).toEqual(UPPER_TICK);
    expect(position.liquidity.toNumber()).toEqual(LIQUIDITY_AMOUNT);

    const pool = await program.account.pool.fetch(poolPda);

    expect(pool.globalLiquidity.toNumber()).toBeGreaterThan(0);
  }) 
  // TODO : Complete tests

})
