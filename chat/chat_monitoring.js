function updateUsrArr(newUser,usr_arr) {
    let status = 0
    let arr_length = usr_arr.length
    let i = 0
    while ( i < arr_length) {
        if(usr_arr[i].id == newUser.id) {
            usr_arr[i] = newUser
            status = 1
            break
        } else { 
            status = 0
        }
        i++
    }

    console.log(status)
    if(!status) {
        usr_arr.push(newUser)
    }
}


module.exports = {
    updateUsrArr,
}