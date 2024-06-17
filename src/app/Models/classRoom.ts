import { TrainingType } from "./training-type";

export interface ClassRoom {
    classe_id? : number;
    code_classe : string;
    lib_classe_fr : string;
    niveau_formation_id : number;
    trainingType : TrainingType;
}
