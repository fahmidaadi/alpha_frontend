import { Internship } from "./internship";
import { Student } from "./student";

export interface StudentInternship {
    etudiant_stage_id? : number ;
    stage_id : number ;
    cin : number ;

    internship : Internship;
    student : Student;

}
