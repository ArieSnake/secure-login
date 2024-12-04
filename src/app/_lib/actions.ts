"use server"

import { redirect } from "next/navigation"
import { createSession, getUserById, getUserByLogin, insertUser, resetUserAttemptsAndTime, updateExpire, updateUserAttemptsAndTime, VerifyUser } from "./model"
import bcrypt from 'bcrypt'
import { nanoid } from "nanoid"
import { cookies } from "next/headers"
import { ISession, IUser } from "./types"
import db from "better-sqlite3"

const sql = new db("auth.db")

interface IState{
    message:string
}

export const handleSignup = async (prevState:IState,form:FormData) => {
    const name = form.get("name") as string
    const surname = form.get("surname") as string
    const login = form.get("login") as string
    let password = form.get("password") as string

    if(!name.trim() || !surname.trim() || !login.trim() || !password.trim()){
        return {message:"Please fill all the fields"}
    }

    if(password.length < 6){
        return {message:"Password is too short!!!"}
    }

    const found = getUserByLogin(login)
    if(found){
        return {message:"Login is busy!"}
    }
    password = await bcrypt.hash(password, 10)

    const result = insertUser({login, password, name, surname})
    if(result.changes){
        return redirect("/")
    }else{
        return {message:"Internal server error!"}
    }
}

export const handleLogin = async(state:IState, form:FormData) => {
    const login = form.get("login") as string
    const password = form.get("password") as string

    const found = getUserByLogin(login)
    if(!found){
        return{message:"Login is wrong babe"}
    }

    if(found.time && found.time > Date.now()){
        const remaining = Math.ceil((found.time - Date.now()) / 60_000)
        return {message:`You are blocked,go away.Trry again in ${remaining} minutes`}
    }
    const isPasswordCorrect = await bcrypt.compare(password, found.password)

    if(!isPasswordCorrect){
        const newAttempts = found.attempts + 1
        const blockTime = newAttempts >= 3? Date.now() + 5 * 60 * 1000 : null

        updateUserAttemptsAndTime({id:found.id, attempts:newAttempts, time:blockTime})

        return {
            message: blockTime
                ? "Too many incorrect attempts. You are blocked for 5 minutes."
                : `Incorrect password. ${3 - newAttempts} attempt(s) left.`,
        };

    }
    resetUserAttemptsAndTime(found.id)

    const token = nanoid()
    createSession(found.id, token);
    (await cookies()).set("token", token)

    return redirect("/profile")
}


// export const handleLogin = async (state: IState, form: FormData) => {
//     const login = form.get("login") as string
//     const password = form.get("password") as string

//     const found = getUserByLogin(login)
//     if (!found) {
//         return { message: "Login is wrong" }
//     }

//     if (found.time && found.time > Date.now()) {

//         const remaining = Math.ceil((found.time - Date.now()) / 60000)
//         return { message: `You are blocked.go away or Try again in ${remaining} minutes.` }
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, found.password)

//     if (!isPasswordCorrect) {
//         const newAttempts = found.attempts + 1
//         let blockTime = null

//         if (newAttempts >= 3) {
//             blockTime = Date.now() + 5 * 60 * 1000
//         }

//         sql.prepare(
//             `UPDATE users SET attempts = ?, time = ? WHERE id = ?`
//         ).run(newAttempts, blockTime, found.id)

//         return {
//             message: blockTime
//                 ? "Too many incorrect attempts. You are blocked for 5 minutes."
//                 : `Incorrect password. ${3 - newAttempts} attempt(s) left.`,
//         }
//     }

//     sql.prepare(
//         `UPDATE users SET attempts = 0, time = NULL WHERE id = ?`
//     ).run(found.id)

//     const token = nanoid()
//     createSession(found.id, token);
//     (await cookies()).set("token", token)
//     return redirect("/profile")
// }


// export const handleLogin = async(state:IState, form:FormData) => {
//     const login = form.get("login") as string
//     const password = form.get("password") as string
//     const found = getUserByLogin(login)
//     if(!found){
//         return {message: "Login is wrong"}
//     }
//     const result = await bcrypt.compare(password, found.password)
//     if (!result) {
//         return{message:"Wrong credentials"}
//     }
//     const token = nanoid()
//     createSession(found.id,token)
//     (await cookies()).set("token",token)
//     return redirect("/profile")
// }

export const verifyUser = async () => {
    const tokenData = (await cookies()).get('token')

    if(!tokenData) {
        return null
    }

    const userData = await VerifyUser(tokenData.value) as ISession

    if(!userData || userData.expires < Date.now()) {
        return null
    }
     
        
    const expire = await updateExpire(tokenData.value, userData.expires)
    

    const result = expire.changes == 1 && await getUserById(userData.user_id)


    return result as IUser
}

/*
    update users
    set attepmts auth + 1 where id =?
    this is hint fro the lecture
*/