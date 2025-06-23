export interface ConnectorConfig {
  /** Communication mode for the UI modules application. */
  channel: 'chat' | 'voice';
  /** Agent desktop to use. */
  agentDesktop: 'LivePerson' | 'Custom';
  /** Conversation profile name to use. */
  conversationProfileName: string;
  /** API Connector config. */
  apiConfig: {
    /**
     * Authentication token to attach to outgoing requests. Should be a valid
     * OAuth token for Dialogflow API, or any other token for custom API
     * endpoints.
     */
    authToken: string;
    /**
     * Specifies a custom proxy server to call instead of calling the Dialogflow
     * API directly.
     */
    customApiEndpoint?: string;
    /** API key to use. */
    apiKey?: string;
    /**
     * Additional HTTP headers to include in the Dialogflow/proxy server API
     * request.
     */
    headers?: string[];
  };
  /** Event-based connector config. Set this for voice conversations. */
  eventBasedConfig?: {
    /**
     * Transport protocol to use for updates. Defaults to 'websocket' if none is
     * specified.
     */
    transport?: 'websocket' | 'polling';
    /** Event-based library to use (i.e., Socket.io). */
    library?: 'SocketIo';
    /** Endpoint to which the connection will be established. */
    notifierServerEndpoint: string;
  };
  /**
   * UI module event options.
   */
  uiModuleEventOptions?: UiModuleEventOptions;
}

export declare interface UiModuleEventOptions {
  // The namespace to send, listen, or transform the event.
  namespace?: string;
}

export interface UiModuleConnector {
  init(config?: ConnectorConfig): void | Promise<void>;
  disconnect(): void;
  setAuthToken(authToken: string): void;
  initSubscription?(): void;
}

/** Service interface for event-based connectors. */
export interface UiModuleEventBasedConnector extends UiModuleConnector {
  subscribeToConversation(conversationId: string): void;
  unsubscribeFromConversation(conversationId: string): void;
}

type AgentAssistModules =
  | 'KnowledgeAssist'
  | 'GenerativeKnowledgeAssist'
  | 'SmartReply'
  | 'ConversationSummarization'
  | 'AgentCoaching'
  | 'Common'
  | 'Container';

type AgentAssistRecord = {
  title: string;
  src: string;
};

type AgentAssistSourceMap = Record<AgentAssistModules, AgentAssistRecord>;

export const agentAssistModules: AgentAssistSourceMap = {
  KnowledgeAssist: {
    title: 'Knowledge Assist',
    src: 'https://www.gstatic.com/agent-assist-ui-modules/v1.0/knowledge_assist.js',
  },
  GenerativeKnowledgeAssist: {
    title: 'Generative Knowledge Assist',
    src: 'https://www.gstatic.com/agent-assist-ui-modules/v2.8/knowledge_assist.js',
  },
  SmartReply: {
    title: 'Smart Reply',
    src: 'https://www.gstatic.com/agent-assist-ui-modules/v1.2/smart_reply.js',
  },
  ConversationSummarization: {
    title: 'Conversation Summarization',
    src: 'https://www.gstatic.com/agent-assist-ui-modules/v1.2/summarization.js',
  },
  AgentCoaching: {
    title: 'Agent Coaching',
    src: 'https://www.gstatic.com/agent-assist-ui-modules/v1.0/agent_coaching.js',
  },
  Common: {
    title: 'Common',
    src: 'https://www.gstatic.com/agent-assist-ui-modules/v1.3/common.js',
  },
  Container: {
    title: 'Container',
    src: 'https://www.gstatic.com/agent-assist-ui-modules/v1.8/container.js',
  },
};
