// File: Backend/utils/tenantQuery.js
// Purpose: Utility functions for tenant-specific database queries

export function getTenantQuery(query, orgId) {
  if (!query || typeof query.eq !== "function") {
    throw new Error("getTenantQuery expects a Supabase query builder");
  }

  if (!Number.isInteger(orgId)) {
    throw new Error("Invalid orgId");
  }

  return query.eq("org_id", orgId);
}

