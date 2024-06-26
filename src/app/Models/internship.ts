import { ClassRoom } from "./classRoom";
import { Student } from "./student";
import { Supervisor } from "./supervisor";
import { TrainingType } from "./training-type";

export interface Internship {
    stage_id ?: number ;
    start_date : string;
    end_date : string;
    status: string; 
    evaluation : string ;
    classe_id: number ;
    niveau_formation_id :number ;
    encadrant_id : number ;
    
    etudiants : String[];

    Etudiants :Student[];

    classRoom : ClassRoom;
    trainingType : TrainingType;
    supervisor : Supervisor;
    etudiant1_cin? : Student ;
    etudiant2_cin? : Student | null;
    

}
