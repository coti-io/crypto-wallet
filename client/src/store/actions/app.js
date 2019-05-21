import * as actionTypes from "./actionTypes";

export const getNodesList = (net) => {
    return { type: actionTypes.GET_NODES_LIST, net };
};

export const setNodesList = (nodes, net) => {
  return { type: actionTypes.SET_NODES_LIST, nodes, net };
};

export const setPage = pageName => {
  return {
    type: actionTypes.SET_PAGE,
    page: pageName
  };
};

export const toggleModal = flag => {
  return {
    type: actionTypes.TOGGLE_MODAL,
    flag
  }
}

export const onSelectNode = node => {
  return{
    type: actionTypes.SELECT_NODE,
    node
  }
}

export const setSocketClient = socketClient => {
  return {
    type: actionTypes.SET_SOCKET_CLIENT,
    socketClient
  };
};

export const toggleSpinner = flag => {
  return {
    type: actionTypes.TOGGLE_SPINNER,
    flag
  }
}

export const updateTooltipMsg = (tooltipMsg, isError) => {
  return {
    type: actionTypes.UPDATE_TOOLTIP_STATUS,
    tooltipMsg,
    isError
  };
};

export const toggleSuccessPopup = (flag) => {
  return {
    type: actionTypes.TOGGLE_SUCCESS_POPUP,
    flag
  }
}

export const toggleWarningPopup = ({message}) => {
  return {
    type: actionTypes.TOGGLE_WARNING_POPUP,
    message
  }
}

export const setWindowWidth = width => {
  return { 
    type: actionTypes.SET_WINDOW_WIDTH,
    width
  }
}

export const setWidth = (width) => {
  return{
    type: actionTypes.SET_WIDTH,
    width
  }
}
