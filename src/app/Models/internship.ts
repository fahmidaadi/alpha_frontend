import { ClassRoom } from "./classRoom";
import { Student } from "./student";
import { TrainingType } from "./training-type";

export interface Internship {
    stage_id ?: number ;
    start_date : string;
    end_date : string;
    status: string; 
    evaluation : string ;
    etudiant_cin: number ;
    classe_id: number ;
    niveau_formation_id :number ;

    student : Student;
    classRoom : ClassRoom;
    trainingType : TrainingType;
}
