import type { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { DashboardMetrics, Publication, PublicationFilters } from "@/lib/types";

type FilterOptions = {
  disciplinas: string[];
  turmas: string[];
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

function dateStart(value?: string) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function dateEnd(value?: string) {
  if (!value) return "";
  const date = new Date(`${value}T23:59:59.999`);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function getFilters(searchParams: Record<string, string | string[] | undefined>) {
  const getValue = (key: string) => {
    const value = searchParams[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return {
    tipo: getValue("tipo") ?? "",
    disciplina: getValue("disciplina") ?? "",
    turma: getValue("turma") ?? "",
    status: getValue("status") ?? "",
    inicio: getValue("inicio") ?? "",
    fim: getValue("fim") ?? "",
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
    .order("dt_inicio", { ascending: true });

  if (filters.tipo) query = query.eq("tp_publicacao", filters.tipo);
  if (filters.disciplina) query = query.eq("nm_disciplina", filters.disciplina);
  if (filters.turma) query = query.eq("nm_turma", filters.turma);
  if (dateStart(filters.inicio)) query = query.gte("dt_inicio", dateStart(filters.inicio));
  if (dateEnd(filters.fim)) query = query.lte("dt_inicio", dateEnd(filters.fim));

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
    .order("dt_inicio", { ascending: true });

  if (filters.tipo) query = query.eq("tp_publicacao", filters.tipo);
  if (filters.disciplina) query = query.eq("nm_disciplina", filters.disciplina);
  if (filters.turma) query = query.eq("nm_turma", filters.turma);
  if (filters.status) query = query.eq("st_publicacao", filters.status);
  if (dateStart(filters.inicio)) query = query.gte("dt_inicio", dateStart(filters.inicio));
  if (dateEnd(filters.fim)) query = query.lte("dt_inicio", dateEnd(filters.fim));

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
  let query = supabase.from("tb_th_publicacao").select("nm_disciplina,nm_turma");

  if (!admin) {
    query = query.eq("st_publicacao", "publicado");
  }

  const { data, error } = await query;

  if (error || !data) {
    return { disciplinas: [], turmas: [] };
  }

  const rows = data as Array<Pick<Publication, "nm_disciplina" | "nm_turma">>;

  return {
    disciplinas: [...new Set(rows.map((item) => item.nm_disciplina).filter(Boolean))].sort(),
    turmas: [...new Set(rows.map((item) => item.nm_turma).filter(Boolean))].sort()
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
      const start = new Date(item.dt_inicio);
      return start >= now && start <= nextWeek;
    })
    .sort((a, b) => new Date(a.dt_inicio).getTime() - new Date(b.dt_inicio).getTime())
    .slice(0, 6);

  const recent = publications.slice(0, 6);

  return {
    error: null,
    metrics,
    upcoming,
    recent
  };
}
