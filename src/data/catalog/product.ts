/** Modelo de produto do catálogo (gerado em chunks e search-index). */
export interface Product {
  id: number;
  codigo: string;
  nome: string;
  preco: number;
  imagem: string;
  cor: string;
  categoriaTipo: string;
  slug: string;
  coresDisponiveis: string[];
  tamanhos: string[];
  descricao: string;
  tipos: string[];
  /** Dados do Supabase administrativo; nunca contém custos internos. */
  supabaseId?: string;
  /** Galeria publicada pelo sistema de gestão. */
  imagens?: string[];
  atualizadoEm?: string;
  criadoEm?: string;
}
