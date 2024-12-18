// @ts-nocheck
import { ConnectorConfig, 
    UiModuleConnector, 
    UiModuleEventBasedConnector, 
    agentAssistModules 
} from '../types/AgentAssist';
import { getCustomApiEndpoint, getConversationProfile } from '../../config';
import Cookies from 'js-cookie';
import logger from '../../../../utils/logger';

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
            logger.debug('[Agent-Assist] connector already instantiated')
        }
        AgentAssistUtils.#connector.init(config);
    }

    public async getAgentAssistAuthToken(token: string): string {
        const authToken = Cookies.get('CCAI_AGENT_ASSIST_AUTH_TOKEN');
        if(authToken){
            logger.debug('[Agent-Assist] AuthToken retrieved from cookies');
            return authToken;
        }

        logger.debug('[Agent-Assist] Making request for Agent Assist auth token');
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
                logger.debug('[Agent-Assist] Saving auth token in cookie');
                Cookies.set('CCAI_AGENT_ASSIST_AUTH_TOKEN', data.token, { expires: 7 })
                return data.token;
            });
    }

    public getConversationName(conversationId: string): string {
        const [, projectLocation] =
            getConversationProfile().match(
                /(^projects\/[^/]+\/locations\/[^/]+)\/conversationProfiles\/[^/]+$/
            ) || [];
        const conversationName = `${projectLocation}/conversations/${conversationId}`;
        return conversationName;
    }

    public getConversationProfile(conversationProfile: string, customApiEndpoint?: string): string {
        const authToken = Cookies.get('CCAI_AGENT_ASSIST_AUTH_TOKEN');
        if(!authToken){
            logger.debug('[Agent-Assist] No auth token stored, retrieve auth token before making CCAI request');
            return;
        }
        const endpoint = validateUrl(customApiEndpoint ? customApiEndpoint : getCustomApiEndpoint())
        return fetch(`${endpoint}/v2beta1/${conversationProfile}`, {
            method: 'GET',
            headers: [['Authorization', authToken]],
            })
            .then(response => {
                if (!response.ok) {
                    // error coming back from server
                    throw Error('could not fetch the data for that resource');
                }
            })
            .then(data => {
                logger.debug('[Agent-Assist] Conversation profile retrived');
                return data.name;
            });
    }

    private validateUrl(url: string): string {
        const protocalRegExp = new RegExp("^(http|https):\/\/");
        const hasProtocal = protocalRegExp.test(url);
        const validUrl = `${hasProtocal ? "" : "https://"}${url}`;
        return validUrl
    }
}

export default AgentAssistUtils;