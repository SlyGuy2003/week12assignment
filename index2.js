  class User {
    constructor(userName, id){
    this.userName = userName
    this.id = id
    }
}

class UserService{    
    static url = "https://64f3c773932537f40519fc39.mockapi.io/Users/Users"

    static getAllUsers() {
        return $.get(this.url)
    }

    static getUser(id){
        return $.get(this.url + `/${id}`)
    }

    static createUser(user){
        return $.ajax({
            url: this.url,
            datatype: 'json',
            data: JSON.stringify(user),
            contentType: `application/json`,
            type: `POST`
        })
    }

    static updateUser(user){
        return $.ajax({
            url: this.url + `/${user.id}`,
            datatype: 'json',
            data: JSON.stringify(user),
            contentType: `application/json`,
            type: `PUT`
        })
    }

    static deleteUser(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: `DELETE`
        })
    }
}

class DOMManager {
    static users

    static getAllUsers() {
    UserService.getAllUsers().then(users => this.render(users))
    }

    static createUser(userName){
        let createdId = (this.users.length + 1)
        UserService.createUser(new User(userName, createdId))
        .then(() => {
        return UserService.getAllUsers()
        })
    .then((users) => this.render(users))
    }


    static deleteUser(id){
        UserService.deleteUser(id)
        .then(() =>{
            return UserService.getAllUsers()
        })
        .then((users) => this.render(users))
    }

    static updateUser(id){
        for (let user of this.users){
            if (user.id == id){
                let newUserName = $(`#${user.id}-user-name`).val()
                this.users.splice((id-1), 1, (new User(`${newUserName}`, `${user.id}`)))
                console.log(this.users)
                UserService.updateUser(this.users[id-1])
                .then(() =>{
                    return UserService.getAllUsers()
                })
                .then((users) => this.render(this.users))
            }
        }
    }



    static render(users) {
        console.log(users)
        this.users = users
        $('#app').empty()
        for (let user of users){
            let userID = parseInt(user.id)
            $('#app').prepend(
                `
                <div id="${userID}" class = "container mt-5 card">
                    <div class = "card-header">
                        <div class = "row">
                                <h2 class = "col-sm" >${user.userName}</h2>
                                <button class = "col-sm btn btn-danger" onclick = "DOMManager.deleteUser('${userID}')">Delete</button>
                            </div>
                        </div>
                    </div>
                    <div class = "class-body">
                        <div class = "card">
                            <div class= "row">
                                <div class = "col-sm">
                                    <input type = "text" id= "${userID}-user-name" class = "form-control" placeholder = "Update Username">
                                </div>
                            </div>
                            <button id="${userID}-new-user" onclick="DOMManager.updateUser('${userID}')" class = "btn btn-primary form-conrtol">Update</button>
                        </div>
                    </div>
                </div><br>
                `
            )
            //for (let game of users.games){
              //  $(`#${user._id}`).find('card-body').append(
                //    `<p>
                   // <span id="name-${game._id}"> Name: </strong> ${game.gameName}</span>
                  //  <span id="name-${game._id}"> Developer: </strong> ${game.developer}</span>
                  //  <button class = "btn btn-danger" onclick="DOMManager.deleteRoom('${user._id}', ${game._id})>Delete Room </button>
                  //  `
               // )
            }

        }

    }
//}
$(`#new-user-bttn`).click(() => {
    DOMManager.createUser($(`#new-userName-input`).val())
    $(`#new-userName-input`).val('')
})
DOMManager.getAllUsers()