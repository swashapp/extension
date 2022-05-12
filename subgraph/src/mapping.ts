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
import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';

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

export function handleDataUnionBeneficiaryChanged(
  event: DataUnionBeneficiaryChanged,
): void {}

export function handleEarningsWithdrawn(event: EarningsWithdrawn): void {
  saveTransfer(
    event.transaction.hash.toHex() + '-' + event.logIndex.toString(),
    event.params.member,
    Address.zero(),
    event.params.amount,
    'ToMember',
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
