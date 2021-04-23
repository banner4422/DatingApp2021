// OBS. Dette er bare opsætning af relevante
// klasser udefra ERD og Klassediagrammet

///////////////////////////////////////////////////

// Class User (parent class)
class User{
    constructor( email, password) {
        this._email = email;
        this._password = password;
        this._isAdmin = 0;
    }

}

///////////////////////////////////////////////////

// TinderUser Class (datter af user)
module.exports = class TinderUser extends User{
    constructor( email, password, firstName, lastName, city, age, interest, gender, description, genderInterest, ageMin, ageMax ) {
        super( email, password)
        this._isAdmin = 0;
        this._firstName = firstName;
        this._lastName = lastName;
        this._city = city;
        this._age = age;
        this._interest = interest;
        this._gender = gender;
        this._description = description;
        this._genderInterest = genderInterest;
        this._ageMin = ageMin;
        this._ageMax = ageMax;
        
    }

    postTinderUser = function() {
        // funktion indmad
    }

    updateTinderUser = function() {
        // funktion indmad
    }

    deleteTinderUser = function() {
        // funktion indmad
    }

}

// test
// new TinderUser(2,2,2,2,2,2,2,2,2,2,2,2,2)
// console.log(tinderUser1)
///////////////////////////////////////////////////

// Admin Class (datter af User)
class Admin extends User{
    constructor( email, password) {
        super( email, password)
        this._isAdmin = 1;
    }

    getUserCount = function() {
            // funktion indmad
            // return "der er 13 brugere i databasen"
    }

    getMatchCount = function(){
            // funktion indmad
    }

    updateUserByEmail = function(){
        // funktion indmad
    }
    
    deleteUserByEmail = function(){
        // funktion indmad
    }
}

//test
// admin1 = new Admin(1, "test@email", "test321")
// console.log(admin1)
// console.log(admin1.getUserCount())


///////////////////////////////////////////////////