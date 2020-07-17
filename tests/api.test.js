const fetch = require('node-fetch');
const mongoose = require('mongoose');
const {ObjectID} = require('mongodb');
const dbHandler = require('./db-handler');
const jwt_decode = require('jwt-decode');

let server;
beforeAll(async () => {
    await dbHandler.connect();
    server = await require("../server.js");
});
beforeEach(async () => { await seedDatabase(); });
afterEach(async () => { await dbHandler.clearDatabase(); });
afterAll(async () => {
    await dbHandler.closeDatabase();
    await server.close();
});
describe('login', () => {
    it('login_success', async () => {
        const res = await fetch("http://localhost:5000/api/users/login", {
            method: 'POST',
            body: JSON.stringify({email: "person1@person1.com", password: "securepassword"}),
            headers: {'Content-Type': 'application/json'}
        });
        const result = await res.json();
        expect(res.status).toBe(200);
        expect(result.email).toBe("person1@person1.com");
    });
    it('login_wrongpassword', async () => {
        const res = await fetch("http://localhost:5000/api/users/login", {
            method: 'POST',
            body: JSON.stringify({email: "person1@person1.com", password: "incorrectpassword"}),
            headers: {'Content-Type': 'application/json'}
        });
        const result = await res.json();
        expect(res.status).toBe(400);
        expect(result.passwordincorrect).toBe('Password incorrect');
    });
});

describe('register', () => {
    it('register_success', async () => {
        const userData = {name: "Test", email: "person2@person2.com", password: "securepassword", password2: "securepassword"};
        const res = await fetch("http://localhost:5000/api/users/register", {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: {'Content-Type': 'application/json'}
        });
        expect(res.status).toBe(200);
        const result = await res.json();
        const userDoc = await mongoose.connection.collection("users").findOne({_id: new ObjectID(result._id)});
        expect(userDoc.name).toBe(userData.name);
        expect(userDoc.email).toBe(userData.email);
    });
    it('register_email_exists', async () => {
        const res = await fetch("http://localhost:5000/api/users/register", {
            method: 'POST',
            body: JSON.stringify({name: "Test", email: "person1@person1.com", password: "securepassword", password2: "securepassword"}),
            headers: {'Content-Type': 'application/json'}
        });
        const result = await res.json();
        expect(res.status).toBe(400);
        expect(result.email).toBe('Email already exists');
    });

});

describe('groups', () => {
    it('groups_unauthorized', async () => {
        const login = await doLogin();
        const res = await fetch(`http://localhost:5000/draftapi/user/${login.id}/groups`);
        expect(res.status).toBe(401);
        const result = await res.text();
        expect(result).toBe("Unauthorized");
    });
    it('groups_success', async () => {
        const login = await doLogin();
        const res = await fetch(`http://localhost:5000/draftapi/user/${login.id}/groups`,
            {headers: {Authorization: login.token}});
        expect(res.status).toBe(200);
        const result = await res.json();
        const groups = result.groups;
        expect(groups.length).toBe(1);
        const group = groups[0];
        expect(group.name).toBe(group1.name);
        expect(group.description).toBe(group1.description);
        expect(group.balance).toBe(balance1_3.total);
    });


});

describe('createGroup', () => {
    it('createGroup_unauthorized', async () => {
        const res = await fetch(`http://localhost:5000/draftapi/user/${person1._id}/createGroup`, {method: 'POST'});
        expect(res.status).toBe(401);
        const result = await res.text();
        expect(result).toBe("Unauthorized");
    });
    it('createGroup_success', async () => {
        const login = await doLogin();
        const newGroup = {name: "New Group", description: "New Group Description"};
        const response = await fetch(`http://localhost:5000/draftapi/user/${login.id}/createGroup`, {
            method: 'POST',
            body: JSON.stringify(newGroup),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': login.token
            }
        });
        expect(response.status).toBe(200);
        const result = await response.json();
        const dbGroup = await mongoose.connection.collection("groups").findOne({_id: new ObjectID(result.group.id)});
        expect(result.group.name).toBe(newGroup.name);
        expect(result.group.description).toBe(newGroup.description);
        expect(dbGroup.name).toBe(newGroup.name);
        expect(dbGroup.description).toBe(newGroup.description);
        expect(dbGroup.members).toEqual([new ObjectID(login.id)]);
    })
});

describe('expenses', () => {
    it('expenses_unauthorized', async () => {
        const res = await fetch(`http://localhost:5000/draftapi/group/${group1._id}/expenses`);
        expect(res.status).toBe(401);
        const result = await res.text();
        expect(result).toBe("Unauthorized");
    });
    it('expenses_success', async () => {
        const login = await doLogin();
        const res = await fetch(`http://localhost:5000/draftapi/group/${group1._id}/expenses`, {headers: {Authorization: login.token}});
        expect(res.status).toBe(200);
        const result = await res.json();
        expect(result.expenses).toHaveLength(1);
        const expense = result.expenses[0];
        expect(expense.description).toBe(expense1.description);
        expect(expense.amount).toBe(expense1.amount);
        expect(expense.payer.id).toBe(expense1.payer.toString());
        expect(expense.billed.id).toBe(expense1.billed.toString())
    });
});

describe('balances', () => {
    it('balances_unauthorized', async () => {
        const res = await fetch(`http://localhost:5000/draftapi/group/${group1._id}/balance/${person1._id}`);
        expect(res.status).toBe(401);
        const result = await res.text();
        expect(result).toBe("Unauthorized");
    });
    it('balances_success', async () => {
        const login = await doLogin();
        const res = await fetch(`http://localhost:5000/draftapi/group/${group1._id}/balance/${login.id}`, {headers: {Authorization: login.token}});
        expect(res.status).toBe(200);
        const result = await res.json();
        expect(result.group.id).toBe(group1._id.toString());
        expect(result.members).toEqual([
            {name: person1.name, id: person1._id.toString(), balance:0},
            {name: person3.name, id: person3._id.toString(), balance: balance1_3.total}
        ]);
    });
});

describe('recordExpense', () => {
    it('recordExpense_unauthorized', async () => {
        const res = await fetch(`http://localhost:5000/draftapi/group/${group1._id}/recordExpense`, {method: 'POST'});
        expect(res.status).toBe(401);
        const result = await res.text();
        expect(result).toBe("Unauthorized");
    });
    it('recordExpense_success', async () => {
        const login = await doLogin();
        const amount = 900;
        const description = "Unique recordExpense_success description";
        const balanceDb1 = await mongoose.connection.collection("balances").findOne({_id: balance1_3._id});
        const res = await fetch(`http://localhost:5000/draftapi/group/${group1._id}/recordExpense`, {
            method: 'POST',
            headers: {Authorization: login.token, 'Content-Type': 'application/json'},
            body: JSON.stringify({payer: login.id, billed: person3._id.toString(), amount: amount, description: description})
        });
        expect(res.status).toBe(200);
        const result = await res.json();
        expect(result.success).toBe(true);
        
        const balanceDb2 = await mongoose.connection.collection("balances").findOne({_id: balance1_3._id});
        expect(balanceDb2.total - balanceDb1.total).toBe(amount );
    });
});

async function doLogin() {
    const loginRes = await fetch("http://localhost:5000/api/users/login", {
            method: 'POST',
            body: JSON.stringify({email: "person1@person1.com", password: "securepassword"}),
            headers: {'Content-Type': 'application/json'}
    });
    const loginResult = await loginRes.json();
    const decoded = jwt_decode(loginResult.token);
    return Object.assign(decoded, loginResult);
}



let person1;
let person3;
let group1;
let expense1;
let balance1_3;
let balance3_1;
async function seedDatabase() {
    person1 = {name: "Person 1", email: "person1@person1.com", password: "$2a$10$j8GhBM23U/I8djcFRYFU1e81sX08VTXcotgK8recZLVN5ABAq5P8a",};
    person3 = {name: "Person 3", email: "person3@person3.com", password: "$2a$10$j8GhBM23U/I8djcFRYFU1e81sX08VTXcotgK8recZLVN5ABAq5P8a",};
    await mongoose.connection.collection("users").insertMany([person1, person3]);
    group1 = {
        name: "Group 1",
        description: "Group 1 Description",
        inviteCode: "N/A",
        members: [person1._id, person3._id],
        lastActivity: new Date()
    }
    await mongoose.connection.collection("groups").insertOne(group1);

    balance1_3 = {groupId: group1._id, userId: person1._id, other: person3._id, total: 900};
    let balance_dummy = {groupId: "bad_group_id", userId: person1._id, other: person3._id, total: -9000};
    balance3_1 = {groupId: group1._id, userId: person3._id, other: person1._id, total: -900};
    await mongoose.connection.collection("balances").insertMany([balance1_3, balance3_1, balance_dummy]);

    expense1 = {
        description: "Expense 1 Description",
        groupId: group1._id,
        payer: person1._id,
        billed: person3._id,
        amount: 500,
        time: new Date()
    }
    await mongoose.connection.collection("expenses").insertOne(expense1);
}
