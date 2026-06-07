export type PublicationType = "prova" | "atividade" | "evento" | "aviso";

export type PublicationStatus = "rascunho" | "publicado" | "arquivado";

export type Publication = {
  id_publicacao: string;
  tp_publicacao: PublicationType;
  nm_titulo: string;
  ds_publicacao: string;
  nm_disciplina: string;
  nm_turma: string | null;
  dt_inicio: string | null;
  dt_fim: string | null;
  nm_local: string | null;
  ds_link_opcional: string | null;
  st_publicacao: PublicationStatus;
  dt_criacao: string;
  dt_atualizacao: string;
  id_usuario_criacao: string | null;
};

export type PublicationInsert = Omit<
  Publication,
  | "id_publicacao"
  | "dt_criacao"
  | "dt_atualizacao"
  | "nm_turma"
  | "dt_inicio"
  | "dt_fim"
  | "nm_local"
  | "ds_link_opcional"
  | "id_usuario_criacao"
> & {
  id_publicacao?: string;
  dt_criacao?: string;
  dt_atualizacao?: string;
  nm_turma?: string | null;
  dt_inicio?: string | null;
  dt_fim?: string | null;
  nm_local?: string | null;
  ds_link_opcional?: string | null;
  id_usuario_criacao?: string | null;
};

export type PublicationUpdate = Partial<PublicationInsert>;

export type AdminProfile = {
  id_usuario: string;
  nm_email: string;
  tp_perfil: "admin";
  dt_criacao: string;
};

export type PublicationFilters = {
  tipo?: string;
  disciplina?: string;
  status?: string;
  busca?: string;
};

export type DashboardMetrics = {
  totalProvas: number;
  totalAtividades: number;
  totalEventos: number;
  totalAvisos: number;
  totalPublicadas: number;
  totalRascunhos: number;
  totalArquivadas: number;
};

export type Database = {
  public: {
    Tables: {
      tb_th_publicacao: {
        Row: Publication;
        Insert: PublicationInsert;
        Update: PublicationUpdate;
        Relationships: [
          {
            foreignKeyName: "tb_th_publicacao_id_usuario_criacao_fkey";
            columns: ["id_usuario_criacao"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      tb_th_usuario_perfil: {
        Row: AdminProfile;
        Insert: {
          id_usuario: string;
          nm_email: string;
          tp_perfil?: "admin";
          dt_criacao?: string;
        };
        Update: Partial<{
          id_usuario: string;
          nm_email: string;
          tp_perfil: "admin";
          dt_criacao: string;
        }>;
        Relationships: [
          {
            foreignKeyName: "tb_th_usuario_perfil_id_usuario_fkey";
            columns: ["id_usuario"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
