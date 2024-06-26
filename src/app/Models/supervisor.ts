import { Department } from "./department";

export interface Supervisor {
    supervisor_id? : number ;
    name : string ;
    contact_info : string ;
    departement_id : number ;

    departement? : Department;
}
