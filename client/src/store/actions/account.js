import * as actionTypes from "./actionTypes";
import { Transaction } from "coti-encryption-library";


export const connect = (seed, node, payment) => {
    return {
        type: actionTypes.CONNECT,
        seed,
        node,
        payment
    };
};

export const connectAfterFail = () => {
    return {
        type: actionTypes.RE_CONNECT,
    };
};

export const getPaymentRequest = () => {
    return {
        type: actionTypes.GET_PAYMENT_REQUEST,
    };
};

export const setPaymentRequest = data => {
    return {
        type: actionTypes.SET_PAYMENT_REQUEST,
        paymentRequest: data
    };
};

export const isWallet = () => {
    return {
        type: actionTypes.IS_WALLET,
    };
};

export const generateAddress = () => {
    return {
        type: actionTypes.GENERATE_ADDRESS,
    };
};

export const setTrustScoreAndUserHash = ({trustScore, userHash}) => {
    return {
      type: actionTypes.SET_TRUST_SCORE_AND_USERHASH,
      trustScore,
      userHash
    };
};

export const setWalletEncryptionLibraryAndNodeSelected = (walletEncryptionLibrary, node) => {
    return {
      type: actionTypes.SET_WALLET_ENCRYPTION_LIBRARY_AND_NOD_SELECTED,
      walletEncryptionLibrary,
      node
    };
  };

export const setAddresses = (addresses) => {
    return {
      type: actionTypes.SET_ADDRESSES,
      addresses
    };
  };

export const setAddressWithBalance = (address) => {
    return {
      type: actionTypes.SET_ADDRESS_WITH_BALANCE,
      address
    };
  };
  

export const addressSubscription = (address,subscription) => {
    return {
        type: actionTypes.ADDRESS_SUBSCRIPTION,
        address,
        subscription
    };
};
  

export const getFnFees = amountToTransfer => {
    return {
        type: actionTypes.GET_FULLNODE_FEES,
        amountToTransfer
    };
};

export const setFees = (fullNodeFee, networkFee) => {
    return {
        type: actionTypes.SET_FEES,
        fullNodeFee, 
        networkFee
    };
};

export const sendTX = (address, amount, description) => {
    return {
        type: actionTypes.SEND_TX,
        address, amount, description
    };
};

export const updateBalanceOfAddress = (body) => {
    return {
        type: actionTypes.UPDATE_BALANCE_OF_ADDRESS,
        body
    };
};

export const logout = () => {
    return {
        type: actionTypes.LOG_OUT,
    };
};

export const getDisputes = () => {
    return {
        type: actionTypes.GET_DISPUTES,
    };
};
  

export const uploadEvidence = documents => {
    return {
        type: actionTypes.UPLAOD_EVIDENCE,
        documents
    };
};

export const updateDisputeEvidence = (itemId, disputeHash) => {
    return {
        type: actionTypes.UPDATE_EVIDENCE,
        itemId,
        disputeHash,
        file: 'shoes-blue.png'
    };
};


export const setTransactionsHistory = TransactionHistory => {
    return {
        type: actionTypes.SET_TRANSACTIONS,
        transactions: TransactionHistory
    };
};

export const sendDispute = (disputeData, comment, documents) => {
    return {
        type: actionTypes.SEND_DISPUTE,
        disputeData,
        comments: comment, 
        documents
    }
}

export const setDisputes = (disputesHistory, disputeSide) => {
    return {
        type: actionTypes.SET_DISPUTES,
        disputesHistory, 
        disputeSide
    }
}

export const addTransaction = transaction => {
    return {
        type: actionTypes.ADD_TRANSACTION,
        transaction
    }
}

export const onSendMessage = comment => {
    return {
        type: actionTypes.ON_SEND_MESSAGE,
        comments: comment
    }
}

export const updateCommentsInItems = comment => {
    return {
        type: actionTypes.UPDATE_COMMENT_IN_ITEMS,
        comment
    }
}

export const updateDocumentsInItems = document => {
    return {
        type: actionTypes.UPDATE_DOCUMENT_IN_ITEMS,
        document
    }
}

export const getDisputeDetails = (disputeDetails) => {
    return {
      type: actionTypes.GET_DISPUTE_DETAILS,
      disputeDetails
    }
  }

export const UpdateItemsStatus = (disputeUpdateItemData) => {
    return {
      type: actionTypes.UPDATE_ITEMS_STATUS,
      disputeUpdateItemData
    }
  }

export const setDisputeDetails = (disputeDetailsResponse) => {
    return {
      type: actionTypes.SET_DISPUTE_DETAILS,
      disputeDetailsResponse
    }
  }

export const downloadFile = (downloadFileData) => {
    return {
      type: actionTypes.DOWNLOAD_FILE,
      downloadFileData
    }
  }

export const setImage = (image) => {
    return {
      type: actionTypes.SET_IMAGE,
      image
    }
  }
