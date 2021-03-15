import axios from 'axios';
import { API_URL } from '../../helper';


export const LoginAction = (input) => {
    return {
        type: "LOGIN",
        payload: input
    }
}

export const LogoutAction = () => {
    return {
        type: "LOGOUT"
    }
}

export const ResetAction = () => {
    return {
        type: "RESET"
    }
}

export const ErrorAction = (errmessage) => {
    return {
        type: "ERROR",
        error: errmessage
    }
}

export const LoadingAction = () => {
    return {
        type: "LOADING",
    }
}

export const CartAction = (input) => {
    return {
        type: "UPDATECART",
        cart: input
    }
}

export const LoginActionThunk = (input) => {
    let { username, password } = input
    return (dispatch) => {
        dispatch({ type: "LOADING" })
        axios
            .get(`${API_URL}/users?username=${username}&password=${password}`)
            .then((result) => {
                if (result.data.length) {
                    localStorage.setItem('id', result.data[0].id); // * id didapat dari result.data ke 0 .id
                    dispatch({ type: "LOGIN", payload: result.data[0] })
                } else {
                    dispatch({ type: "ERROR", error: "Email Tidak Ditemukan atau Password Salah" })
                }
            })
            .catch((error) => {
                console.log(error.response.statusText)
                dispatch({ type: "ERROR", error: error.response.statusText })
            })
    }

}

export const ResetActionThunk = () => {
    return (dispatch) => {
        dispatch({ type: "RESET" })

    }
}

export const RegActionThunk = (input) => {
    return (dispatch) => {
        let { email, password, confirmpassword } = input;
        let dataBaru = {
            id: 0,
            email,
            password,
            role: "users",
            cart: [],
        };
        if (password === confirmpassword) {
            dispatch({ type: "LOADING" })
            axios.get(`${API_URL}/users?email=${email}`)
                .then((result1) => {
                    let validation = new RegExp("^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])").test(password)
                    console.log(validation)
                    if (result1.data.length) {
                        dispatch({ type: "ERROR", error: "Email Telah Terdaftar" })
                    } else if (password.length < 6) {
                        dispatch({ type: "ERROR", error: "Password Minimal 6 Karakter" })
                    } else if (validation == false) {
                        dispatch({ type: "ERROR", error: "Password harus berisi minimal 1 angka, 1 huruf besar, 1 huruf kecil" })
                    } else if (!email && !password && !confirmpassword) {
                        dispatch({ type: "ERROR", error: "Data Harus Diisi" })
                    } else if (!email) {
                        dispatch({ type: "ERROR", error: "Email Harus Diisi" })
                    } else {
                        axios
                            .post(`${API_URL}/users`, dataBaru)
                            .then((result2) => {
                                localStorage.setItem('id', result2.data.id)
                                dispatch({ type: "LOGIN", payload: result2.data[0] })
                            }).catch((error) => {
                                dispatch({ type: "ERROR", error: "Server Error" })
                                console.log(error)
                            })
                    }
                })
                .catch((error) => {
                    dispatch({ type: "ERROR", error: "Server Error" })
                    console.log(error)
                })
        } else {
            dispatch({ type: "ERROR", error: "Password dan Confirm harus sama" })
        }

    }
}





