module.exports = class Dislike{
    constructor(id, id1, id2){
     // id1 & id2 er 2 forskellige TinderUsers
    this._id = id; // id er for id'et for selve disliken, gøres automatisk NULL da det angives i DB.
    this._id1 = id1; // TinderUserID 1   
    this._id2 = id2; // TinderUserID 2
    }
}