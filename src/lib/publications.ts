import type { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { DashboardMetrics, Publication, PublicationFilters } from "@/lib/types";

type FilterOptions = {
  disciplinas: string[];
};

type PublicationListResult = {
  data: Publication[] | null;
  error: PostgrestError | null;
};

type PublicationResult = {
  data: Publication | null;
  error: PostgrestError | null;
};

type DashboardResult = {
  error: PostgrestError | null;
  metrics: DashboardMetrics | null;
  upcoming: Publication[];
  recent: Publication[];
};

function cleanTextFilter(value?: string) {
  const cleaned = value?.trim();
  if (!cleaned) return "";
  return cleaned.replace(/[%,]/g, " ");
}

export function getFilters(searchParams: Record<string, string | string[] | undefined>) {
  const getValue = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    tipo: getValue("tipo") ?? "",
    disciplina: getValue("disciplina") ?? "",
    status: getValue("status") ?? "",
    busca: getValue("busca") ?? ""
  };
}

export async function getPublicPublications(
  filters: PublicationFilters
): Promise<PublicationListResult> {
  const supabase = await createClient();
  let query = supabase
    .from("tb_th_publicacao")
    .select("*")
    .eq("st_publicacao", "publicado")
    .order("dt_criacao", { ascending: false });

  if (filters.tipo) query = query.eq("tp_publicacao", filters.tipo);
  if (filters.disciplina) query = query.eq("nm_disciplina", filters.disciplina);

  const busca = cleanTextFilter(filters.busca);
  if (busca) {
    query = query.or(`nm_titulo.ilike.%${busca}%,ds_publicacao.ilike.%${busca}%`);
  }

  const { data, error } = await query;

  return {
    data: (data ?? null) as Publication[] | null,
    error
  };
}

export async function getPublicPublicationById(id: string): Promise<PublicationResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tb_th_publicacao")
    .select("*")
    .eq("id_publicacao", id)
    .eq("st_publicacao", "publicado")
    .maybeSingle();

  return {
    data: (data ?? null) as Publication | null,
    error
  };
}

export async function getAdminPublications(
  filters: PublicationFilters
): Promise<PublicationListResult> {
  const supabase = await createClient();
  let query = supabase
    .from("tb_th_publicacao")
    .select("*")
    .order("dt_criacao", { ascending: false });

  if (filters.tipo) query = query.eq("tp_publicacao", filters.tipo);
  if (filters.disciplina) query = query.eq("nm_disciplina", filters.disciplina);
  if (filters.status) query = query.eq("st_publicacao", filters.status);

  const busca = cleanTextFilter(filters.busca);
  if (busca) {
    query = query.or(`nm_titulo.ilike.%${busca}%,ds_publicacao.ilike.%${busca}%`);
  }

  const { data, error } = await query;

  return {
    data: (data ?? null) as Publication[] | null,
    error
  };
}

export async function getPublicationForEdit(id: string): Promise<PublicationResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tb_th_publicacao")
    .select("*")
    .eq("id_publicacao", id)
    .maybeSingle();

  return {
    data: (data ?? null) as Publication | null,
    error
  };
}

export async function getFilterOptions(admin = false): Promise<FilterOptions> {
  const supabase = await createClient();
  let query = supabase.from("tb_th_publicacao").select("nm_disciplina");

  if (!admin) {
    query = query.eq("st_publicacao", "publicado");
  }

  const { data, error } = await query;

  if (error || !data) {
    return { disciplinas: [] };
  }

  const rows = data as Array<Pick<Publication, "nm_disciplina">>;

  return {
    disciplinas: [...new Set(rows.map((item) => item.nm_disciplina).filter(Boolean))].sort()
  };
}

export async function getDashboardData(): Promise<DashboardResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tb_th_publicacao")
    .select("*")
    .order("dt_criacao", { ascending: false });

  if (error) {
    return {
      error,
      metrics: null,
      upcoming: [],
      recent: []
    };
  }

  const publications = (data ?? []) as Publication[];
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const metrics: DashboardMetrics = {
    totalProvas: publications.filter((item) => item.tp_publicacao === "prova").length,
    totalAtividades: publications.filter((item) => item.tp_publicacao === "atividade").length,
    totalEventos: publications.filter((item) => item.tp_publicacao === "evento").length,
    totalAvisos: publications.filter((item) => item.tp_publicacao === "aviso").length,
    totalPublicadas: publications.filter((item) => item.st_publicacao === "publicado").length,
    totalRascunhos: publications.filter((item) => item.st_publicacao === "rascunho").length,
    totalArquivadas: publications.filter((item) => item.st_publicacao === "arquivado").length
  };

  const upcoming = publications
    .filter((item) => {
      if (!item.dt_inicio) return false;
      const start = new Date(item.dt_inicio);
      return start >= now && start <= nextWeek;
    })
    .sort((a, b) => {
      const startA = a.dt_inicio ? new Date(a.dt_inicio).getTime() : Number.POSITIVE_INFINITY;
      const startB = b.dt_inicio ? new Date(b.dt_inicio).getTime() : Number.POSITIVE_INFINITY;
      return startA - startB;
    })
    .slice(0, 6);

  const recent = publications.slice(0, 6);

  return {
    error: null,
    metrics,
    upcoming,
    recent
  };
}
