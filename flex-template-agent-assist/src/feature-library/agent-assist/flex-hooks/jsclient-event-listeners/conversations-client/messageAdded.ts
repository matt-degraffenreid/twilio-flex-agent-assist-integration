import * as Flex from '@twilio/flex-ui';
import { Conversation, Message } from '@twilio/conversations';
import AgentAssistUtils from '../../../utils/agentAssist/AgentAssistUtils';
import { FlexJsClient, ConversationEvent } from '../../../../../types/feature-loader';

export const clientName = FlexJsClient.conversationsClient;
export const eventName = ConversationEvent.messageAdded;
// when an agent joins a channel for the first time this announces
// them in the chat channel
export const jsClientHook = function analyzeContentRequest(
  flex: typeof Flex,
  manager: Flex.Manager,
  message: Message,
) {
  const workerIdentity =  manager.store.getState().flex.session.identity;
  const agentAssistUtils = AgentAssistUtils.instance;

  const conversationId = message.conversation.sid;
  const messageContent = `${message.body}`;
  const participantRole = message.author == workerIdentity ? 'HUMAN_AGENT': 'END_USER';
  const messageSendTime = `${message.dateCreated?.toString()}`;

  agentAssistUtils.analyzeContentRequest(participantRole, messageContent, messageSendTime, conversationId)
};