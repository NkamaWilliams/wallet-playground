import { signTransactionMessageWithSigners } from "gill";

export type SolanaTransaction = Awaited<ReturnType<typeof signTransactionMessageWithSigners>>;