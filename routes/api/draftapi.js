const router = require('express').Router();
const passport = require('passport');
const mongoose = require("mongoose");
const {ObjectID} = require('mongodb');
const crypto = require('crypto');


router.get('/group/:groupId/checkInvite/:inviteCode', passport.authenticate('jwt', { session: false }),  async (req, res, next) => {
   const userId = req.user._id;
   if (!ObjectID.isValid(req.params.groupId)) {
      res.status(400);
      res.json({error: "Invalid groupId"});
      return;
   }
   const groupId = new ObjectID(req.params.groupId);

   // Check the inviteCode for the given groupId and add the user to the list of members
   const result = await mongoose.connection.collection("groups").findOne({ inviteCode: req.params.inviteCode, _id: groupId});

   if (result == null) {
      res.status(401);
      res.json({error: "Invalid invitation"});
      return;
   }

   res.json({group: {name: result.name, description: result.description || ""}})
});


router.post('/group/:groupId/join/:inviteCode', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
   // Check that the user is authorized
   if (req.body.userId !== req.user._id.toString()) {
      res.status(401);
      res.json({error:"No access"});
      return;
   }

   const userId = req.user._id;
   if (!ObjectID.isValid(req.params.groupId)) {
      res.status(400);
      res.json({error: "Invalid groupId"});
      return;
   }
   const groupId = new ObjectID(req.params.groupId);

   // Check the inviteCode for the given groupId and add the user to the list of members
   mongoose.connection.collection("groups").updateOne(
      { inviteCode: req.params.inviteCode, _id: groupId},
      { $addToSet: { members: userId }, $max: {lastActivity: new Date()} }
   ).then((result) => {
      if (result.matchedCount === 0) {
         res.status(400);
         res.json({error: "Invalid invitation"});
      }
      /*else if (result.matchedCount === 1 && result.modifiedCount !== 1) {
         res.json({error: "You are already a member of that group"});
      }*/
      else {
         res.json({success: true});
      }
   });
});


router.post('/user/:userId/createGroup', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
   if (req.params.userId !== req.user._id.toString()) {
      res.status(401);
      res.json({error:"No access"});
      console.log(req.params.userId +" !== "+req.user._id);
      return;
   }
   if (typeof req.body.name !== "string" || req.body.name.length < 1) {
      res.status(400);
      res.json({error: "Invalid group name"});
      return;
   }
   if (typeof req.body.description !== "string" || req.body.description.length < 1) {
      res.status(400);
      res.json({error: "Invalid group description"});
      return;
   }

   crypto.randomBytes(5, function(err, buffer) {
      const token = buffer.toString('hex');
      const groupDoc = {
         name: req.body.name,
         description: req.body.description || "",
         inviteCode: token,
         lastActivity: new Date(),
         members: [new ObjectID(req.params.userId)],
      };

      // Insert the group
      mongoose.connection.collection("groups").insertOne(groupDoc)
      .then((result) => {
         res.json({success: true, group: {
            id: groupDoc._id,
            name: groupDoc.name,
            description: groupDoc.description,
            balance: 0,
            lastActivity: groupDoc.lastActivity
         }});
      });
   });
});


router.get('/user/:userId/groups', passport.authenticate('jwt', { session: false }),  (req, res, next) => {
   // TODO: improve
   if (req.params.userId !== req.user._id.toString()) {
      res.status(401);
      res.json({error:"No access"});
      console.log(req.params.userId +" !== "+req.user._id);
      return;
   }

   const userId = req.user._id;

   // TODO: improvements
   const groups = mongoose.connection.collection("groups").aggregate(
   [
      {
         $match: { members: req.user._id }
      },
      {
         "$lookup": {
            "from": "balances",
            "let": {
               fGroupId: "$_id",
            },
            pipeline: [
               {
                  $match: {
                     $expr: {
                        $and: [
                           {$eq: ["$groupId", "$$fGroupId"]},
                           {$eq: ["$userId", userId]}
                        ]
                     }
                  }
               }
            ],
            "as": "balance"
         }
      },
      {
         "$project": {
            "total": { "$sum": "$balance.total" },
            "name": true,
            "description": true,
            lastActivity: true,
            inviteCode: true,
         }
      }
   ]).sort({lastActivity: -1}).toArray();

   groups.then((result) => {
      console.log(result);
      const returnedGroups = result.map(e => {
         return {
            name: e.name,
            id: e._id.toString(),
            description: e.description || "",
            balance: e.total,
            lastActivity: e.lastActivity,
            inviteCode: e.inviteCode
         };
      })

      res.json({groups: returnedGroups});
   });
});


router.get('/group/:groupId/balance/:userId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
   const {groupId, userId} = req.params;

   // TODO: improve
   if (req.params.userId !== req.user._id.toString()) {
      res.status(401);
      res.json({error:"No access"});
      console.log(req.params.userId +" !== "+req.user._id);
      return;
   }

   const users = mongoose.connection.collection("groups").aggregate(
   [
      {
         $match: {_id: new ObjectID(groupId), members: new ObjectID(userId)}
      },
      {
         "$lookup": {
            "from": "users",
            localField: "members",
            foreignField: "_id",
            as: "members",
         }
      },
      {
         $unwind: "$members"
      },
      {
         $lookup: {
            from: "balances",
            "let": {
               otherUser: "$members._id",
            },
            as: "balance",
            pipeline: [
               {
                  $match: {
                     $expr: {
                        $and: [
                           {$eq: ["$groupId", new ObjectID(groupId)]},
                           {$eq: ["$userId", new ObjectID(userId)]},
                           {$eq: ["$other","$$otherUser"]}
                        ]
                     }
                  }
               }
            ],
         }
      }
   ]).toArray();

   users.then((result) => {
      if (result.length === 0) {
         res.status(401);
         res.json({error: "Invalid"})
         return;
      }

      const returnedMembers = result.map(e => {
         console.log(e)
         return {name: e.members.name, id: e.members._id.toString(), balance: e.balance.length < 1 ? 0 : e.balance[0].total};
      })

      res.json({members: returnedMembers, group: {name: result[0].name, id: result[0]._id, inviteCode: result[0].inviteCode}});
   });
});


router.get('/group/:groupId/expenses', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
   const {groupId} = req.params;
   const result = await mongoose.connection.collection("groups").findOne( { members: req.user._id, _id: new ObjectID(groupId)} );

   if (result == null) {
      res.status(401);
      res.json({error: "Invalid"});
      return;
   }

   const expenses = await mongoose.connection.collection("expenses").aggregate([
      {
         $match: {groupId: new ObjectID(groupId)}
      },
      {
         "$lookup": {
            "from": "users",
            localField: "payer",
            foreignField: "_id",
            as: "payer",
         }
      },
      {
         "$lookup": {
            "from": "users",
            localField: "billed",
            foreignField: "_id",
            as: "billed",
         }
      },
   ])
   .sort({time: -1})
   .toArray();

   const returnedExpenses = expenses.map(expense => {
      return {
         description: expense.description,
         payer: {name: expense.payer[0].name, id: expense.payer[0]._id},
         billed: {name: expense.billed[0].name, id: expense.billed[0]._id},
         amount: expense.amount,
         time: expense.time
      };
   });

   res.json({expenses: returnedExpenses, group: {groupId: groupId, name: result.name}});
});


router.post('/group/:groupId/recordExpense', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
   // TODO: improve
   if (req.body.payer !== req.user._id.toString()) {
      res.status(401);
      res.json({error:"No access"});
      console.log(req.body.payer +" !== "+req.user._id);
      return;
   }

   const payerId = req.user._id;
   const groupIdStr = req.params.groupId;
   const {description, billed, amount} = req.body;
   if (!ObjectID.isValid(payerId)) {
      res.status(400);
      res.json({error: "Invalid payer"});
      return;
   }
   if (!ObjectID.isValid(groupIdStr)) {
      res.status(400);
      res.json({error: "Invalid group"});
      return;
   }
   if (!ObjectID.isValid(billed)) {
      res.status(400);
      res.json({error: "Invalid billed member"});
      return;
   }
   if (typeof amount !== "number" || !(amount > 0 && amount <= 50000)) {
      res.status(400);
      res.json({error: "Invalid amount"});
      return;
   }
   if (typeof description !== "string" || description.length < 3) {
      res.status(400);
      res.json({error: "Invalid description"});
      return;
   }
   const participatingMembers = [billed];
   //console.log("Splitting "+amount+" among the following members of group " + groupIdStr+": " + participatingMembers);

   const billedIds = participatingMembers.map(e => new ObjectID(e));
   const groupId = new ObjectID(groupIdStr);
   const result = await mongoose.connection.collection("groups").findOne( { members: { $all: [...billedIds, payerId] }, _id:groupId} );
   if (result == null) {
      res.json({error: "Invalid"});
      return;
   }

   const splitCost = amount / billedIds.length;
   // TODO
   mongoose.connection.collection("balances").updateOne(
      {groupId: groupId, userId: payerId, other: {$in: billedIds}},
      {$inc: {total: splitCost}},
      {upsert: true}
   );

   mongoose.connection.collection("balances").updateOne(
      {groupId: groupId, userId: {$in: billedIds}, other: payerId},
      {$inc: {total: -splitCost}},
      {upsert: true}
   );
   mongoose.connection.collection("groups").updateOne(
      { _id: groupId},
      { $max: {lastActivity: new Date()} }
   );

   const time = new Date();
   const docs = billedIds/*.filter(e => e !== req.body.payer)*/.map(billedUser => {
      return {description: description, groupId: groupId, payer: payerId, billed: billedUser, amount: splitCost, time:time};
   });
   mongoose.connection.collection("expenses").insertMany(docs);
   console.log(result);

   res.json({success: true});
});

module.exports = router;
