class Chat {
    constructor(id) {
        this.id = id
    }
    #res_arr_title = []
    #res_arr_id = []

    push_arr_title(elem) {
        this.#res_arr_title.push(elem)
    }
    push_arr_id(elem) {
        this.#res_arr_id.push(elem)
    }
    get_arr_title() {
        return this.#res_arr_title
    }
    get_arr_id() {
        return this.#res_arr_id
    }
} 

module.exports = Chat