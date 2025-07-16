// lib/permissions.ts
const permissions = {
  ADMIN: {
    canEditUsers: true,
    canViewAllLeads: true,
    dashboardAccess: "all",
  },
  DIRECTOR: { ... },
  MANAGER: { ... },
  AGENT: {
    canEditUsers: false,
    canViewAllLeads: false,
    dashboardAccess: "own",
  },
};

export function getPermissions(role: string) {
  return permissions[role as keyof typeof permissions] || {};
}
