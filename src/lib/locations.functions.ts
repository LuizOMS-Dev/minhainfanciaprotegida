import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { requireRole } from "@/lib/require-role";

const locationTypes = ["conselho_tutelar", "creas", "cras", "delegacia", "disque", "mp"] as const;
export type LocationType = (typeof locationTypes)[number];

export interface AdminHelpLocation {
  id: string;
  name: string;
  type: LocationType;
  state: string;
  city: string;
  address: string | null;
  phone: string | null;
  hours: string | null;
  official_url: string | null;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

const safeOptionalUrl = z
  .union([
    z
      .string()
      .url()
      .refine((v) => /^https?:\/\//i.test(v), { message: "URL inválida." }),
    z.literal(""),
  ])
  .optional()
  .nullable();

const baseSchema = z.object({
  name: z.string().min(2).max(200),
  type: z.enum(locationTypes),
  state: z.string().length(2),
  city: z.string().min(1).max(120),
  address: z.string().max(300).optional().nullable(),
  phone: z.string().max(40).optional().nullable(),
  hours: z.string().max(160).optional().nullable(),
  official_url: safeOptionalUrl,
  lat: z.number().min(-90).max(90).optional().nullable(),
  lng: z.number().min(-180).max(180).optional().nullable(),
});

const upsertSchema = baseSchema.extend({ id: z.string().uuid().optional() });

export const listAdminLocations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireRole(context.supabase, context.userId, ["admin", "editor", "revisor"]);
    const { data, error } = await context.supabase
      .from("help_locations")
      .select("*")
      .order("state", { ascending: true })
      .order("city", { ascending: true });
    if (error) {
      console.error("[locations.list]", error);
      throw new Error("Não foi possível carregar os locais de ajuda.");
    }
    return { locations: (data ?? []) as AdminHelpLocation[] };
  });

export const getAdminLocation = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await requireRole(context.supabase, context.userId, ["admin", "editor", "revisor"]);
    const { data: row, error } = await context.supabase
      .from("help_locations")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) {
      console.error("[locations.get]", error);
      throw new Error("Não foi possível carregar o local.");
    }
    return { location: row as AdminHelpLocation | null };
  });

function clean(v?: string | null) {
  const s = (v ?? "").trim();
  return s.length ? s : null;
}

export const upsertAdminLocation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => upsertSchema.parse(i))
  .handler(async ({ data, context }) => {
    await requireRole(context.supabase, context.userId, ["admin", "editor"]);
    const payload = {
      ...data,
      address: clean(data.address),
      phone: clean(data.phone),
      hours: clean(data.hours),
      official_url: clean(data.official_url),
    };
    const isUpdate = Boolean(data.id);
    let saved: AdminHelpLocation;
    if (data.id) {
      const { data: row, error } = await context.supabase
        .from("help_locations")
        .update(payload)
        .eq("id", data.id)
        .select()
        .single();
      if (error) {
        console.error("[locations.update]", error);
        throw new Error("Não foi possível atualizar o local.");
      }
      saved = row as AdminHelpLocation;
    } else {
      const { data: row, error } = await context.supabase
        .from("help_locations")
        .insert(payload)
        .select()
        .single();
      if (error) {
        console.error("[locations.insert]", error);
        throw new Error("Não foi possível criar o local.");
      }
      saved = row as AdminHelpLocation;
    }
    const { logAudit } = await import("@/lib/audit.server");
    logAudit({
      action: "location_change",
      userId: context.userId,
      targetType: "help_location",
      targetId: saved.id,
      targetTitle: saved.name,
      metadata: { mode: isUpdate ? "update" : "create", state: data.state, city: data.city },
    });
    return { location: saved };
  });

export const deleteAdminLocation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) => z.object({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data, context }) => {
    await requireRole(context.supabase, context.userId, ["admin"]);
    const { data: prev } = await context.supabase
      .from("help_locations")
      .select("name")
      .eq("id", data.id)
      .maybeSingle();
    const { error } = await context.supabase.from("help_locations").delete().eq("id", data.id);
    if (error) {
      console.error("[locations.delete]", error);
      throw new Error("Não foi possível excluir o local.");
    }
    const { logAudit } = await import("@/lib/audit.server");
    logAudit({
      action: "location_change",
      userId: context.userId,
      targetType: "help_location",
      targetId: data.id,
      targetTitle: prev?.name ?? null,
      metadata: { mode: "delete" },
    });
    return { ok: true };
  });

const csvRowSchema = baseSchema;

export const importAdminLocationsCsv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i) =>
    z.object({ rows: z.array(z.record(z.string(), z.string())).min(1).max(2000) }).parse(i),
  )
  .handler(async ({ data, context }) => {
    await requireRole(context.supabase, context.userId, ["admin", "editor"]);
    const parsed: z.infer<typeof csvRowSchema>[] = [];
    const errors: { line: number; message: string }[] = [];

    data.rows.forEach((raw, idx) => {
      const line = idx + 2; // header is line 1
      const lat = raw.lat ? Number(raw.lat.replace(",", ".")) : null;
      const lng = raw.lng ? Number(raw.lng.replace(",", ".")) : null;
      const candidate = {
        name: (raw.name ?? "").trim(),
        type: (raw.type ?? "conselho_tutelar").trim() as LocationType,
        state: (raw.state ?? "").trim().toUpperCase(),
        city: (raw.city ?? "").trim(),
        address: clean(raw.address),
        phone: clean(raw.phone),
        hours: clean(raw.hours),
        official_url: clean(raw.official_url),
        lat: Number.isFinite(lat as number) ? lat : null,
        lng: Number.isFinite(lng as number) ? lng : null,
      };
      const r = csvRowSchema.safeParse(candidate);
      if (!r.success) {
        errors.push({ line, message: r.error.issues.map((i) => i.message).join("; ") });
      } else {
        parsed.push(r.data);
      }
    });

    if (parsed.length === 0) {
      return { inserted: 0, errors };
    }

    const { data: inserted, error } = await context.supabase
      .from("help_locations")
      .insert(parsed)
      .select("id");
    if (error) {
      console.error("[locations.csv]", error);
      throw new Error("Falha ao inserir os locais. Verifique os campos obrigatórios.");
    }
    const { logAudit } = await import("@/lib/audit.server");
    logAudit({
      action: "csv_import",
      userId: context.userId,
      targetType: "help_location",
      metadata: { inserted: inserted?.length ?? 0, errors: errors.length },
    });
    return { inserted: inserted?.length ?? 0, errors };
  });
