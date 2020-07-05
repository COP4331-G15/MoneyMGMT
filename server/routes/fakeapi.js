const router = require('express').Router();

router.get('/user/:userId/groups', (req, res, next) => {
    const {userId} = req.params;
    console.log("Getting the list of groups that " + userId + " is a member of");
    res.json({groups: [
        {name: "Roommate Group", id: "ef6bc5ac-6aee-4889-9b46-2732e041d351", totalExpenses: 100, userBalance: -5},
        {name: "Vacation Group", id: "478477b8-7a7f-40bd-b4ee-c5ad3a209cc4", totalExpenses: 100, userBalance: 0},
        {name: "Group 3", id: "9e6aaf03-afc7-4915-b3a3-92c51f6f13d0", totalExpenses: 100, userBalance: 100},
        {name: "Group 4", id: "fe6aaf03-afc7-4915-b3a3-92c51f6f13d0", totalExpenses: 50, userBalance: -20},
        {name: "Group 5", id: "ae6aaf03-afc7-4915-b3a3-92c51f6f13d0", totalExpenses: 0, userBalance: 50},
    ]});
});

router.get('/group/:groupId/balance/:userId', (req, res, next) => {
    const {groupId, userId} = req.params;
    console.log("Getting how much "+userId+" owes each member in "+groupId);
    res.json({members: [
        {name: "Person 1", amount: -5},
        {name: "Person 2", amount: -15},
        {name: "Person 3", amount: 20},
    ]});
});

router.get('/group/:groupId/expenses', (req, res, next) => {
    const {groupId} = req.params;
    res.json({expenses: [
        {desc: "Restaurant charge", amount: 50, payer: "Erik", participants: ["Erik", "David", "Ryan"]},
        {desc: "Monthly rent", amount: 15, payer: "Nas", participants: ["Nas", "Austin"]},
        {desc: "Charge 3", amount: 20, payer:"Jeff", participants: ["Jeff", "Austin"]},
    ]});
});

router.post('/group/:groupId/recordExpense', (req, res, next) => {
    const {groupId} = req.params;
    const {participatingMembers, totalAmount} = req.body;
    console.log("Splitting "+totalAmount+" among the following members of group " + groupId+": " + participatingMembers);
    res.json({success: true});
});

module.exports = router;