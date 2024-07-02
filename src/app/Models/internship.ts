import { ClassRoom } from "./classRoom";
import { Project } from "./project";
import { Student } from "./student";
import { Supervisor } from "./supervisor";
import { TrainingType } from "./training-type";

export interface Internship {
    stage_id ?: number ;
    start_date : string;
    end_date : string;
    date_soutenance : string ;
    status: string; 
    evaluation : string ;
    classe_id: number ;
    niveau_formation_id :number ;
    project_id : number ;
    encadrant_id : number ;

    etudiants : string[];
    Etudiants? :Student[];
    EtudiantStages?: { cin: string; etudiant_stage_id: number; stage_id: number }[];
    project?: Project;
    classRoom : ClassRoom;
    trainingType : TrainingType;
    supervisor : Supervisor;
    etudiant1_cin? : Student ;
    etudiant2_cin? : Student | null;
    

}
