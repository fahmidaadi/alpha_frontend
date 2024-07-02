import { UserType } from "./user-type";

export interface User {
    user_id? :number;
    username: string;
    password: string;
    firstname : string ;
    lastname : string; 
    email : string ;
    user_type : number ;

    userType? : UserType;
  }