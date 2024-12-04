import db from 'better-sqlite3'
import { InputUser, IUser, IUserBlockUpdate } from './types'
const sql = new db('auth.db')

export const getUserByLogin = (login:string):(IUser|null) => {
    const user = sql.prepare("SELECT * FROM users where login = ?").get(login)
    if(user){
        return user as IUser
    }
    return null
}

export const getAllUsers = () => {
    return sql.prepare("SELECT * FROM users").all()
}

export const insertUser = (user:InputUser):db.RunResult => {
    return sql.prepare(`INSERT INTO users(name, surname, login, password)
                        VALUES(@name, @surname, @login, @password)                    
    `).run(user)
}

export const createSession = (user:number, token:string) => {
    return sql.prepare(`INSERT INTO session(id, user_id, expires)
                        VALUES(?, ?, ?)`).run(token, user, Date.now() + 50000)

}

export const getUserById = (userId: number): (IUser | null) => {
    const user = sql.prepare(`SELECT * FROM users WHERE id = ?`).get(userId)

    if(!user) {
        return null
    }

    return user as IUser
}

export const VerifyUser = (token: string) => {
    const user = sql.prepare(`SELECT * FROM session WHERE id = ?`).get(token)

    if(!user) {
        return null
    }

    return user
}

export const deleteUserInSession = (token: string) => {
    return sql.prepare(`DELETE FROM session WHERE id = ?`).run(token)
} 
export const updateExpire = (token: string, expires: number) => {
    return sql.prepare(`UPDATE session SET expires = ? WHERE id = ?`).run(expires + 500, token)
}

export const updateUserAttemptsAndTime = ({id, attempts, time,}: IUserBlockUpdate): db.RunResult => {
    return sql.prepare(`
        UPDATE users
        SET attempts = ?, time = ?
        WHERE id = ?
    `).run(attempts, time, id)
}

export const resetUserAttemptsAndTime = (userId: number): db.RunResult => {
    return sql.prepare(`
        UPDATE users
        SET attempts = 0, time = NULL
        WHERE id = ?
    `).run(userId);
}