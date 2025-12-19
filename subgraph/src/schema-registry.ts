import { Registered } from "../generated/SchemaRegistry/SchemaRegistry";
import { Schema } from "../generated/schema";

export function handleSchemaRegistered(event: Registered): void {
  let schema = new Schema(event.params.uid.toHexString());
  
  schema.schema = event.params.schema;
  schema.creator = event.params.registerer;
  schema.resolver = event.params.resolver;
  schema.revocable = event.params.revocable;
  schema.timestamp = event.block.timestamp;
  schema.txHash = event.transaction.hash;
  schema.attestationCount = 0;
  
  schema.save();
}
