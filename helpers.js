function generateRandomString() {
  return Math.random().toString(36).substr(2, 5);
};

const urlsPerUser = (user, dataBase) => {
  let newDb = {}
  for (const key in dataBase) {
    if (dataBase[key].userId === user) {
      newDb[key] = dataBase[key]
    }
  }
  return newDb
}

const findUserByEmail = (email, database) => {
  for (const acccount in database) {
    if (email === database[acccount].email) {
      return true
    }
  }
} 

const getUserByEmail = (email, database) => {
  for (const account in database) {
    if (email === database[account].email) {
      console.log(account)
      return account
    }
  }
} 





// findUserById(req.session.user_id, users)
const findUserById = (userId, database) => {
  for (const acccount in database) {
    if (userId === database[acccount].id) {
      return database[acccount]
    }
  }
}

module.exports = {
  generateRandomString,
  urlsPerUser, 
  findUserByEmail, 
  findUserById,
  getUserByEmail
}