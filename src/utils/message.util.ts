import { InMemoryModulesBase } from '../types/handler/module.type';
import { MessageHeader } from '../types/message.type';

import { uuid } from './id.util';

export function createMessageHeader(
  func: string,
  collector: string,
  module: InMemoryModulesBase,
): MessageHeader {
  return {
    id: uuid(),
    function: func,
    collector: collector,
    module: module.name,
    category: module.category,
    privacyLevel: module.privacy_level,
    anonymityLevel: module.anonymity_level,
  };
}
