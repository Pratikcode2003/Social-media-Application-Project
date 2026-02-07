import * as actionType from "./Message.actionType"
import { api } from "../../config/api"

export const createMessage = (reqData) => async (dispatch) => {
    dispatch({ type: actionType.CREATE_MESSAGE_REQUEST })
    try {
        const { data } = await api.post(`/api/messages/chat/${reqData.message.chatId}`, reqData.message);

        if (reqData.sendMessageToServer) {
            reqData.sendMessageToServer(data);
        }
        console.log("Created message--", data);
        dispatch({ 
            type: actionType.CREATE_MESSAGE_SUCCESS, 
            payload: data 
        });
    } catch (error) {
        console.log("CATCH ERROR--", error);
        dispatch({ 
            type: actionType.CREATE_MESSAGE_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
    }
} 

export const createChat = (chat) => async (dispatch) => {
    dispatch({ type: actionType.CREATE_CHAT_REQUEST });
    try {
        const { data } = await api.post('/api/chats', chat);
        console.log("Created chat--", data);
        dispatch({ 
            type: actionType.CREATE_CHAT_SUCCESS, 
            payload: data 
        });
        return data; // Return chat for immediate use
    } catch (error) {
        console.log("CATCH ERROR--", error);
        dispatch({ 
            type: actionType.CREATE_CHAT_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
        throw error;
    }
} 

export const getAllChats = () => async (dispatch) => {
    dispatch({ type: actionType.GET_ALL_CHAT_REQUEST });
    try {
        const { data } = await api.get('/api/chats');
        console.log("get all chats ---", data);
        dispatch({ 
            type: actionType.GET_ALL_CHAT_SUCCESS, 
            payload: data 
        });
    } catch (error) {
        console.log("CATCH ERROR--", error);
        dispatch({ 
            type: actionType.GET_ALL_CHAT_FAILURE, 
            payload: error.response?.data?.message || error.message 
        });
    }
} 

export const deleteChat = (chatId) => async (dispatch) => {
    dispatch({ type: actionType.DELETE_CHAT_REQUEST });
    try {
        await api.delete(`/api/chats/${chatId}`);
        dispatch({ 
            type: actionType.DELETE_CHAT_SUCCESS, 
            payload: chatId 
        });
    } catch (error) {
        console.log("Delete chat error:", error);
        dispatch({
            type: actionType.DELETE_CHAT_FAILURE,
            payload: error.response?.data?.message || error.message,
        });
    }
};