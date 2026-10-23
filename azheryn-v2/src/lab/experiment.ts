export type LabStatus = "PASS" | "FAIL" | "UNKNOWN";
export type LabExperiment<I,O>={id:string;title:string;hypothesis:string;seed:number;input:I;run:(input:I,seed:number)=>O;evaluate:(output:O)=>LabStatus};
export type LabRun<O>={experimentId:string;seed:number;startedAt:string;output:O;status:LabStatus};
export function runExperiment<I,O>(e:LabExperiment<I,O>):LabRun<O>{const output=e.run(e.input,e.seed);return{experimentId:e.id,seed:e.seed,startedAt:new Date().toISOString(),output,status:e.evaluate(output)}}
export function runReplicates<I,O>(e:LabExperiment<I,O>,seeds:number[]){return seeds.map(seed=>runExperiment({...e,seed}))}
