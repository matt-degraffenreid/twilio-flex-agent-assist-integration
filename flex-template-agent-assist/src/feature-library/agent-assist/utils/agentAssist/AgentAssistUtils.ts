// @ts-nocheck
import { ConnectorConfig, 
    UiModuleConnector, 
    UiModuleEventBasedConnector, 
    agentAssistModules 
} from '../types/AgentAssist';
import { getCustomApiEndpoint, getConversationProfile } from '../../config';
import Cookies from 'js-cookie';

class AgentAssistUtils {
    static #agentAssistUtils: AgentAssistUtils;
    static #connector: UiModuleConnector;
    /**
     * The Singleton's constructor should always be private to prevent direct
     * construction calls with the `new` operator.
     */
    private constructor() {}

    /**
     * The static getter that controls access to the singleton instance.
     *
     * This implementation allows you to extend the Singleton class while
     * keeping just one instance of each subclass around.
     */
    public static get instance(): AgentAssistUtils {
        if (!AgentAssistUtils.#agentAssistUtils) {
            AgentAssistUtils.#agentAssistUtils = new AgentAssistUtils();
        }
        return AgentAssistUtils.#agentAssistUtils;
    }

    public initializeUiConnector(config: ConnectorConfig) {
        if(!AgentAssistUtils.#connector){
            AgentAssistUtils.#connector = new UiModulesConnector();
            window._uiModuleFlags = {debug: true};
        }
        else {
            console.log("Connection already initialize");
        }
        AgentAssistUtils.#connector.init(config);
    }

    public async getAgentAssistAuthToken(token: string): string {
        const authToken = Cookies.get('CCAI_AGENT_ASSIST_AUTH_TOKEN');
        if(authToken)
            return authToken;

        return fetch(`${getCustomApiEndpoint()}/register`, {
            method: 'POST',
            headers: [['Authorization', token]],
            })
            .then(response => {
                if (!response.ok) {
                // error coming back from server
                throw Error('could not fetch the data for that resource');
                }
                return response.json();
            })
            .then(data => {
                Cookies.set('CCAI_AGENT_ASSIST_AUTH_TOKEN', data.token, { expires: 7 })
                return data.token;
            });
    }

    public activeConversationSelected(conversationId: string): void {
        const [, projectLocation] =
            getConversationProfile().match(
                /(^projects\/[^/]+\/locations\/[^/]+)\/conversationProfiles\/[^/]+$/
            ) || [];
        const conversationName = `${projectLocation}/conversations/${conversationId}`;
        dispatchAgentAssistEvent('active-conversation-selected', {
            detail: {conversationName},
        });
    }

    public analyzeContentRequest(participantRole: string, message: string, messageSendTime: string, conversationId: string): void {
        const request = {
            conversationId,
            participantRole,
            request: {
                textInput: {
                    text: message,
                    messageSendTime: messageSendTime,
                },
            },
        };
        console.log(request)
        dispatchAgentAssistEvent('analyze-content-requested', {
            detail: request,
        });
    }

    public addSmartReplyHook(hook: any): void {
        addAgentAssistEventListener('smart-reply-selected', function (event) {
            console.log("trying to set input box");
            console.log(event)
            hook(event.detail.answer.reply);
        });
    }
}

export default AgentAssistUtils;