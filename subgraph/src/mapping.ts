import {
  DataUnionBeneficiaryChanged,
  EarningsWithdrawn,
  FeesCharged,
  FeesSet,
  JoinListenerAdded,
  JoinListenerRemoved,
  JoinPartAgentAdded,
  JoinPartAgentRemoved,
  MemberJoined,
  MemberParted,
  NewEarnings,
  NewMemberEthSent,
  OwnershipTransferred,
  PartListenerAdded,
  PartListenerRemoved,
  RevenueReceived,
  TransferToAddressInContract,
  TransferWithinContract,
  UpdateNewMemberEth,
  WithdrawModuleChanged,
} from '../generated/DataUnionSidechain/DataUnionSidechain';
import { MemberStatusEntity, TransferEntity } from '../generated/schema';
import { Address, BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts';

function saveMemberStatus(
  id: string,
  member: Address,
  status: string,
  condition: number,
  time: BigInt,
): void {
  let entity = MemberStatusEntity.load(id);

  if (!entity) {
    entity = new MemberStatusEntity(id);
  }

  entity.member = member;
  entity.status = status;
  entity.condition = I32.parseInt(condition.toString());
  entity.time = time;

  entity.save();
}

function saveTransfer(
  id: string,
  from: Address,
  to: Address,
  amount: BigInt,
  type: string,
  time: BigInt,
): void {
  let entity = TransferEntity.load(id);

  if (!entity) {
    entity = new TransferEntity(id);
  }

  entity.from = from;
  entity.to = to;
  entity.amount = amount;
  entity.type = type;
  entity.time = time;

  entity.save();
}

function getTxnInputDataToDecode(event: ethereum.Event): Bytes {
  const inputDataHexString = event.transaction.input.toHexString().slice(10);
  const hexStringToDecode =
    '0x0000000000000000000000000000000000000000000000000000000000000020' +
    inputDataHexString;
  return Bytes.fromByteArray(Bytes.fromHexString(hexStringToDecode));
}

function formatAddress(address: BigInt): string {
  const tmp = address.toHexString();
  if (tmp.length === 42) return tmp;

  return '0x' + '0'.repeat(42 - tmp.length) + tmp.substring(2);
}

export function handleDataUnionBeneficiaryChanged(
  event: DataUnionBeneficiaryChanged,
): void {}

export function handleEarningsWithdrawn(event: EarningsWithdrawn): void {
  let to: Address;
  let decode: ethereum.Value | null = null;
  let index = 1;
  const input = getTxnInputDataToDecode(event);
  const inputSize = input.length;

  if (inputSize === 288) {
    // WithdrawAllToSigned
    decode = ethereum.decode('(address, address, bool, bytes)', input);
    index = 2;
  } else if (inputSize === 320) {
    // WithdrawAmountToSigned
    decode = ethereum.decode('(address, address, uint, bool, bytes)', input);
    index = 2;
  } else if (inputSize === 96) {
    // WithdrawAll
    decode = ethereum.decode('(address, bool)', input);
    index = 1;
  } else if (inputSize === 128) {
    // WithdrawAmount
    decode = ethereum.decode('(address, uint, bool)', input);
    index = 1;
  }

  if (decode !== null) {
    let tuple = decode.toTuple();
    to = Address.fromString(formatAddress(tuple[index].toBigInt()));
  } else {
    to = event.params.member;
  }

  saveTransfer(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    event.params.member,
    to,
    event.params.amount,
    'FromMember',
    event.block.timestamp,
  );
}

export function handleFeesCharged(event: FeesCharged): void {}

export function handleFeesSet(event: FeesSet): void {}

export function handleJoinListenerAdded(event: JoinListenerAdded): void {}

export function handleJoinListenerRemoved(event: JoinListenerRemoved): void {}

export function handleJoinPartAgentAdded(event: JoinPartAgentAdded): void {}

export function handleJoinPartAgentRemoved(event: JoinPartAgentRemoved): void {}

export function handleMemberJoined(event: MemberJoined): void {
  saveMemberStatus(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    event.params.member,
    'Joined',
    0,
    event.block.timestamp,
  );
}

export function handleMemberParted(event: MemberParted): void {
  saveMemberStatus(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    event.params.member,
    'Parted',
    event.params.leaveConditionCode,
    event.block.timestamp,
  );
}

export function handleNewEarnings(event: NewEarnings): void {}

export function handleNewMemberEthSent(event: NewMemberEthSent): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePartListenerAdded(event: PartListenerAdded): void {}

export function handlePartListenerRemoved(event: PartListenerRemoved): void {}

export function handleRevenueReceived(event: RevenueReceived): void {}

export function handleTransferToAddressInContract(
  event: TransferToAddressInContract,
): void {
  saveTransfer(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    event.params.from,
    event.params.to,
    event.params.amount,
    'ToMember',
    event.block.timestamp,
  );
}

export function handleTransferWithinContract(
  event: TransferWithinContract,
): void {
  saveTransfer(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    event.params.from,
    event.params.to,
    event.params.amount,
    'BetweenMembers',
    event.block.timestamp,
  );
}

export function handleUpdateNewMemberEth(event: UpdateNewMemberEth): void {}

export function handleWithdrawModuleChanged(
  event: WithdrawModuleChanged,
): void {}
