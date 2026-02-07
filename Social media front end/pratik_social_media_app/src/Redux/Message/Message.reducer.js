import * as actionType from "./Message.actionType";

const initialState = {
    messages: [],
    chats: [],
    loading: false,
    error: null,
    message: null,
    currentChat: null // Add current chat state
}

export const messageReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionType.CREATE_MESSAGE_REQUEST:
        case actionType.CREATE_CHAT_REQUEST:
        case actionType.GET_ALL_CHAT_REQUEST:
        case actionType.DELETE_CHAT_REQUEST:
            return { 
                ...state, 
                loading: true, 
                error: null 
            };

        case actionType.CREATE_MESSAGE_SUCCESS:
            return { 
                ...state, 
                message: action.payload,
                loading: false,
                error: null,
                // Optionally update messages array
                messages: [...state.messages, action.payload]
            };

        case actionType.CREATE_CHAT_SUCCESS:
            return { 
                ...state, 
                chats: [action.payload, ...state.chats],
                loading: false,
                error: null 
            };

        case actionType.GET_ALL_CHAT_SUCCESS:
            return { 
                ...state, 
                chats: action.payload,
                loading: false,
                error: null 
            };

        case actionType.DELETE_CHAT_SUCCESS:
            return {
                ...state,
                chats: state.chats.filter(chat => chat.id !== action.payload),
                loading: false,
                error: null,
                // Clear current chat if it was deleted
                ...(state.currentChat?.id === action.payload && {
                    currentChat: null,
                    messages: []
                })
            };

        case actionType.CREATE_MESSAGE_FAILURE:
        case actionType.CREATE_CHAT_FAILURE:
        case actionType.GET_ALL_CHAT_FAILURE:
        case actionType.DELETE_CHAT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        // New actions to handle chat state
        case actionType.ADD_MESSAGE_TO_CHAT:
            const { chatId, message } = action.payload;
            return {
                ...state,
                chats: state.chats.map(chat => 
                    chat.id === chatId 
                        ? { 
                            ...chat, 
                            messages: [...(chat.messages || []), message],
                            updatedAt: new Date().toISOString()
                        }
                        : chat
                ),
                messages: [...state.messages, message]
            };

        case actionType.SET_CURRENT_CHAT:
            return {
                ...state,
                currentChat: action.payload,
                messages: action.payload?.messages || []
            };

        case actionType.CLEAR_CURRENT_CHAT:
            return {
                ...state,
                currentChat: null,
                messages: []
            };

        case actionType.UPDATE_CHAT_LAST_MESSAGE:
            return {
                ...state,
                chats: state.chats.map(chat =>
                    chat.id === action.payload.chatId
                        ? { ...chat, lastMessage: action.payload.message }
                        : chat
                )
            };

        default:
            return state;
    }
}