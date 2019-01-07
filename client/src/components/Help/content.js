module.exports = {
    getContent: function() {
      var content = [
        {
            "question" : "What is the pre-balance and how is it calculated?",
            "answer" : ["The pre-balance is your future balance after incoming and outgoing transactions are confirmed"],
        },
        {
            "question" : "What types of fees do users pay in the COTI network?",
            "answer" : ["There is a full node fee and network fee. The full node fee depends on the full node that you choose, while the network fee is fixed."],
        },
        {
            "question" : "I’ve lost my seed, can I restore access to my wallet?",
            "answer" : ["When you generate your initial seed, you will be asked to enter a secret key that can be used in the future to restore your seed."],
        },
        {
            "question" : "How do I issue a dispute?",
            "answer" : ["Click on Activity tab. On the transaction screen search for transaction you want to open a dispute for. Click on the desired transaction to expand its details. Click on “Open dispute” button in transaction details."],
        },
        {
            "question" : "I opened a dispute and can no longer send messages or upload additional files. Why is that?",
            "answer" : ["Once a dispute is accepted by a merchant or escalated to the arbitration phase, neither side can send messages or upload additional evidence."],
        }
      ];

    return content;
   }
};


