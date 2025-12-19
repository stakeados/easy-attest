import { Attested, Revoked, EAS } from "../generated/EAS/EAS";
import { Attestation, Schema } from "../generated/schema";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function handleAttested(event: Attested): void {
  let attestation = new Attestation(event.params.uid.toHexString());
  
  // Get full attestation data from contract
  let contract = EAS.bind(event.address);
  let attestationData = contract.getAttestation(event.params.uid);
  
  attestation.schema = event.params.schema.toHexString();
  attestation.attester = event.params.attester;
  attestation.recipient = event.params.recipient;
  attestation.time = attestationData.time;
  attestation.expirationTime = attestationData.expirationTime;
  attestation.revocationTime = attestationData.revocationTime;
  attestation.refUID = attestationData.refUID;
  attestation.data = attestationData.data;
  attestation.txHash = event.transaction.hash;
  attestation.revoked = false;
  
  attestation.save();
  
  // Update schema attestation count
  let schema = Schema.load(event.params.schema.toHexString());
  if (schema != null) {
    schema.attestationCount = schema.attestationCount + 1;
    schema.save();
  }
}

export function handleRevoked(event: Revoked): void {
  let attestation = Attestation.load(event.params.uid.toHexString());
  
  if (attestation != null) {
    attestation.revoked = true;
    attestation.revocationTime = event.block.timestamp;
    attestation.save();
  }
}
