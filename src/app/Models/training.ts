import { CollegeYear } from "./college-year";
import { Department } from "./department";

export interface Training {
    formation_id?: number;
    code_formation: string;
    lib_formation_fr: string;
    departement_id :number ;
    annee_universitaire_id : number;
    department : Department;
    collegeYear :CollegeYear;
}
