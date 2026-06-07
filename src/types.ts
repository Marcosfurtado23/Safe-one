export interface ClientInfo {
  nome: string;
  idade: number;
  profissao: string;
  classeRisco: 'baixo' | 'medio' | 'alto';
  isFumante: boolean;
  capitalSegurado: number; // R$ of desired coverage
}

export interface AdditionalCoverages {
  morteAcidental: boolean;
  invalidezAcidente: boolean;
  doencasGraves: boolean;
  dit: boolean; // Diária por Incapacidade Temporária
  assistenciaFuneral: boolean;
}

export interface SimulationResult {
  clientInfo: ClientInfo;
  coverages: AdditionalCoverages;
  totalMonthly: number;
  baseCost: number;
  coverageDetails: { name: string; value: number }[];
}
