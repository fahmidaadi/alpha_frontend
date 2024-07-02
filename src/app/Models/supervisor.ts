import { Department } from "./department";

export interface Supervisor {
    encadrant_id? : number ;
    name : string ;
    contact_info : string ;
    departement_id : number ;
    email : string; 

    departement? : Department;
}
