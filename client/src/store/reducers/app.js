import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';
import { DEV_MODE } from '../../config';

const initialState = {
    page: 'connect',
    showModal: false,
    selectedNode: {},
    socketClient: {},
    isLoading: false,
    tooltipMsg: false,
    successPopup: false,
    failPopup: false,
    nodeList: {},
    windowWidth: window.innerWidth,
    isArbitrator: false,
    net: '',
    _development: DEV_MODE == 'true',
};

const setPage = (state,action) => {
    return updateObject( state , { 
        page: action.page
    })
}

const setNodes = (state, { nodes, net }) => {
    return updateObject( state , { nodeList: nodes, net, selectedNode: {} }) 
}

const toggleModal = (state, action) => {
    return updateObject(state, {showModal: action.flag})
}

const toggleSpinner = (state, action) => {
    return updateObject(state, {isLoading: action.flag})
}

const setNodeSelected =(state, action) => {
    return updateObject(state, {selectedNode: action.node})
}

const setSocketClient =(state, {socketClient}) => {
    return updateObject(state, {socketClient})
}

const updateTooltipStatus = (state, {tooltipMsg, isError}) => {
    return isError ? updateObject(state, {tooltipMsg: {tooltipMsg, isError}}) : updateObject(state, {tooltipMsg});
}

const toggleSuccessPopup = (state, action) => {
    return updateObject(state, {successPopup: action.flag})
}

const toggleWarningPopup = (state, {message}) => {
    return updateObject(state, {failPopup: message || false})
}

const setWindowWidth = (state, {width}) => {
    return updateObject(state, {windowWidth: width})
}

const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case actionTypes.SET_NODES_LIST: return setNodes(state, action);
        case actionTypes.SET_PAGE: return setPage(state, action);
        case actionTypes.TOGGLE_MODAL: return toggleModal(state, action);
        case actionTypes.SELECT_NODE: return setNodeSelected(state, action);
        case actionTypes.SET_SOCKET_CLIENT: return setSocketClient(state, action);
        case actionTypes.TOGGLE_SPINNER: return toggleSpinner(state, action);
        case actionTypes.UPDATE_TOOLTIP_STATUS: return updateTooltipStatus(state, action);
        case actionTypes.TOGGLE_SUCCESS_POPUP: return toggleSuccessPopup(state, action);
        case actionTypes.TOGGLE_WARNING_POPUP: return toggleWarningPopup(state, action);
        case actionTypes.RE_CONNECT: return toggleWarningPopup(state, action);
        case actionTypes.SET_WIDTH: return setWindowWidth(state, action);
        default:
            return state;
    }
};

export default reducer;