import { Organisme } from "./organisme";

export interface Project {

    project_id? : number ;
    title :string ;
    description : string ;
    status : string 
    organisme_id : number ;

    organisme? : Organisme;
}
