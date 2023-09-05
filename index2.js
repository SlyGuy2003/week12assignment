  class User { //user class that will be used when creating new users to the API
    constructor(userName, id){
    this.userName = userName
    this.id = id
    }
}

class UserService{   // Userservice class proforms all the the actions on the API 
    static url = "https://64f3c773932537f40519fc39.mockapi.io/Users/Users"

    static getAllUsers() { // reads all users
        return $.get(this.url)
    }

    static createUser(user){ // function that places a created user inside the API
        return $.ajax({
            url: this.url,
            datatype: 'json',
            data: JSON.stringify(user),
            contentType: `application/json`,
            type: `POST`
        })
    }

    static updateUser(user){ //updates user on the API based on entered information
        return $.ajax({
            url: this.url + `/${user.id}`,
            datatype: 'json',
            data: JSON.stringify(user),
            contentType: `application/json`,
            type: `PUT`
        })
    }

    static deleteUser(id) { //deletes the user from the API
        return $.ajax({
            url: this.url + `/${id}`,
            type: `DELETE`
        })
    }
}

class DOMManager { // class that holds functions that work on the DOM
    static users

    static getAllUsers() { // function that reads all users from the API then renders them to the HTML via the render function
    UserService.getAllUsers().then(users => this.render(users))
    }

    static createUser(userName){ //creates a user based on what was entered in the input box at the top of the screen, adds another card to the HTML
        let createdId = (this.users.length + 1)
        UserService.createUser(new User(userName, createdId))
        .then(() => {
        return UserService.getAllUsers()
        })
    .then((users) => this.render(users))
    }


    static deleteUser(id){ // function that deletes the user based on its id, removes from HTML and API
        UserService.deleteUser(id)
        .then(() =>{
            return UserService.getAllUsers()
        })
        .then((users) => this.render(users))
    }

    static updateUser(id){ //updates a users name based on what was entered into the input box, in both the HTML and the API
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



    static render(users) { // renders all of the users names onto cards with their own update input box and delete button
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
            }
        }
    }
$(`#new-user-bttn`).click(() => { // on click listener that calls the create user function from DOMManager whecn the new-user-bttn is clicked
    DOMManager.createUser($(`#new-userName-input`).val())
    $(`#new-userName-input`).val('')
})
DOMManager.getAllUsers()