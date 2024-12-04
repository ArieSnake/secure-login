export interface IUser{
    id:number
    name:string
    surname:string;
    login:string
    password:string
    time:number | null
    attempts:number 
  
}

export interface IUserBlockUpdate {
    id: number
    attempts: number
    time: number | null
}


export type InputUser = Omit<IUser, 'id' | 'time' | 'attempts'>

export interface ISession {
    id: string
    user_id: number
    expires: number
}