const { assert } = require('chai');
const { getUserByEmail, urlsPerUser,findUserByEmail } = require('../helpers.js');
// Funky Email Tests
const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('findUserByEmail', function() {
  it('should return true', function() {
    const user = findUserByEmail("user@example.com", testUsers)
    const expectedOutput = true;
    assert.equal(user, expectedOutput)
  });
});

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = "userRandomID";
    assert.equal(user, expectedOutput)
  });
});

// Funky Object Tests
const database = { 
  "a": {longURL: "a", userId: "asdf"},
  "b": {longURL: "b", userId: "aJ48lW"},
  "c": {longURL: "c", userId: "asdf"},
}

describe('urlsPerUser', function() {
  it('should return a object with only specific key/value pairs', function() {
    const user = urlsPerUser('asdf', database)
    const expectedOutput = {
      "a": {longURL: "a", userId: "asdf"},
      "c": {longURL: "c", userId: "asdf"}
    };
    assert.deepEqual(user, expectedOutput)
  });
});

