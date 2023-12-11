interface DatasetConfig {
  backgroundColor: string | string[],
  label: string,
  data: number[],
}

export interface GraficoConfig {
  titulo: string,
  labels: string[],
  datasets: DatasetConfig[]
}
