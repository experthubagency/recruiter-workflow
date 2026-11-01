import { NextResponse } from "next/server";

export interface AppUser {
  email: string;
  name: string;
  passwordHash: string;
  role: "super_admin" | "admin" | "recruiter";
  status: "approved" | "pending" | "revoked";
  createdAt: string;
  updatedAt: string;
}

const SUPER_ADMIN_EMAIL = (
  process.env.SUPER_ADMIN_EMAIL || "admin@apexexec.com"
).toLowerCase().trim();

const SUPER_ADMIN_PASSWORD =
  process.env.SUPER_ADMIN_PASSWORD || "ApexMaster2026!";

declare global {
  var __apexUsersStore: Record<string, AppUser> | undefined;
}

function getDefaultSuperAdmin(): AppUser {
  return {
    email: SUPER_ADMIN_EMAIL,
    name: "Founder & Super Admin",
    passwordHash: SUPER_ADMIN_PASSWORD,
    role: "super_admin",
    status: "approved",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function loadUsers(): Promise<Record<string, AppUser>> {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const res = await fetch(`${kvUrl.replace(/\/$/, "")}/get/apex_users_v1`, {
        headers: { Authorization: `Bearer ${kvToken}` },
        cache: "no-store",
      });
      const data = await res.json();
      if (data?.result) {
        const parsed =
          typeof data.result === "string" ? JSON.parse(data.result) : data.result;
        parsed[SUPER_ADMIN_EMAIL] = {
          ...(parsed[SUPER_ADMIN_EMAIL] || {}),
          ...getDefaultSuperAdmin(),
        };
        return parsed;
      }
    } catch {}
  }

  if (!globalThis.__apexUsersStore) {
    globalThis.__apexUsersStore = {
      [SUPER_ADMIN_EMAIL]: getDefaultSuperAdmin(),
    };
  } else {
    globalThis.__apexUsersStore[SUPER_ADMIN_EMAIL] = {
      ...(globalThis.__apexUsersStore[SUPER_ADMIN_EMAIL] || {}),
      ...getDefaultSuperAdmin(),
    };
  }

  return globalThis.__apexUsersStore;
}

async function saveUsers(users: Record<string, AppUser>): Promise<void> {
  users[SUPER_ADMIN_EMAIL] = {
    ...(users[SUPER_ADMIN_EMAIL] || {}),
    ...getDefaultSuperAdmin(),
  };
  globalThis.__apexUsersStore = users;

  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (kvUrl && kvToken) {
    try {
      await fetch(`${kvUrl.replace(/\/$/, "")}/set/apex_users_v1`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${kvToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(JSON.stringify(users)),
      });
    } catch {}
  }
}

function sanitizeUser(u: AppUser) {
  return {
    email: u.email,
    name: u.name,
    role: u.role,
    status: u.status,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, password, name, actorEmail, targetEmail, newRole, newStatus } =
      body;

    const users = await loadUsers();

    // 1. LOGIN
    if (action === "login") {
      const cleanEmail = (email || "").toLowerCase().trim();
      const user = users[cleanEmail];

      if (!user || user.passwordHash !== password) {
        return NextResponse.json(
          { error: "Invalid email or password." },
          { status: 401 }
        );
      }

      if (user.status === "pending") {
        return NextResponse.json(
          {
            error:
              "Your authorization request is still pending approval by an Administrator.",
            status: "pending",
          },
          { status: 403 }
        );
      }

      if (user.status === "revoked") {
        return NextResponse.json(
          {
            error:
              "Your access to ApexExec Suite has been revoked by an Administrator.",
            status: "revoked",
          },
          { status: 403 }
        );
      }

      return NextResponse.json({
        user: sanitizeUser(user),
        allUsers:
          user.role === "super_admin" || user.role === "admin"
            ? Object.values(users).map(sanitizeUser)
            : [],
      });
    }

    // 2. REQUEST AUTHORIZATION (SIGN UP)
    if (action === "request_access") {
      const cleanEmail = (email || "").toLowerCase().trim();
      if (!cleanEmail || !cleanEmail.includes("@") || !password || !name) {
        return NextResponse.json(
          { error: "Please provide your full name, valid email, and password." },
          { status: 400 }
        );
      }

      if (cleanEmail === SUPER_ADMIN_EMAIL) {
        return NextResponse.json(
          { error: "This email is reserved for the Super Admin. Please sign in directly." },
          { status: 400 }
        );
      }

      const existing = users[cleanEmail];
      if (existing) {
        if (existing.status === "approved") {
          return NextResponse.json(
            { error: "Account already approved! Please switch to Sign In." },
            { status: 400 }
          );
        }
        if (existing.status === "pending") {
          return NextResponse.json(
            { error: "Your authorization request is already in the approval queue." },
            { status: 400 }
          );
        }
      }

      const newUser: AppUser = {
        email: cleanEmail,
        name: name.trim(),
        passwordHash: password,
        role: "recruiter",
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      users[cleanEmail] = newUser;
      await saveUsers(users);

      return NextResponse.json({
        message:
          "Authorization request submitted! Once the Super Admin or an Admin approves your request, you can sign in.",
        user: sanitizeUser(newUser),
      });
    }

    // 3. VERIFY LIVE SESSION & SYNC DIRECTORY
    if (action === "verify_session") {
      const cleanEmail = (email || "").toLowerCase().trim();
      const user = users[cleanEmail];

      if (!user || user.status !== "approved") {
        return NextResponse.json(
          { error: "Session expired or access revoked.", valid: false },
          { status: 403 }
        );
      }

      return NextResponse.json({
        valid: true,
        user: sanitizeUser(user),
        allUsers:
          user.role === "super_admin" || user.role === "admin"
            ? Object.values(users).map(sanitizeUser)
            : [],
      });
    }

    // 4. ADMIN & SUPER ADMIN MANAGEMENT ACTIONS
    if (action === "manage_user") {
      const cleanActor = (actorEmail || "").toLowerCase().trim();
      const cleanTarget = (targetEmail || "").toLowerCase().trim();

      const actor = users[cleanActor];
      const target = users[cleanTarget];

      if (!actor || actor.status !== "approved" || (actor.role !== "super_admin" && actor.role !== "admin")) {
        return NextResponse.json(
          { error: "Unauthorized: Admin privileges required." },
          { status: 403 }
        );
      }

      if (!target) {
        return NextResponse.json({ error: "Target user not found." }, { status: 404 });
      }

      // Supreme Authority Protection: Nobody can alter the Super Admin
      if (target.role === "super_admin" || cleanTarget === SUPER_ADMIN_EMAIL) {
        return NextResponse.json(
          { error: "Supreme Authority Protection: The Super Admin account cannot be modified or revoked." },
          { status: 403 }
        );
      }

      // Standard Admins cannot modify other Admins or promote anyone to Admin
      if (actor.role === "admin") {
        if (target.role === "admin") {
          return NextResponse.json(
            { error: "Only the Super Admin has authority to modify or revoke other Admins." },
            { status: 403 }
          );
        }
        if (newRole && newRole !== "recruiter") {
          return NextResponse.json(
            { error: "Only the Super Admin can promote users to Admin status." },
            { status: 403 }
          );
        }
      }

      if (newStatus) {
        target.status = newStatus;
      }
      if (newRole && actor.role === "super_admin" && (newRole === "admin" || newRole === "recruiter")) {
        target.role = newRole;
      }

      target.updatedAt = new Date().toISOString();
      users[cleanTarget] = target;
      await saveUsers(users);

      return NextResponse.json({
        message: `Updated ${target.name} (${target.email})`,
        allUsers: Object.values(users).map(sanitizeUser),
      });
    }

    // 5. DIRECTLY ADD / INVITE PRE-APPROVED USER OR ADMIN
    if (action === "create_user") {
      const cleanActor = (actorEmail || "").toLowerCase().trim();
      const cleanTarget = (targetEmail || "").toLowerCase().trim();
      const actor = users[cleanActor];

      if (!actor || actor.status !== "approved" || (actor.role !== "super_admin" && actor.role !== "admin")) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
      }

      if (!cleanTarget || !cleanTarget.includes("@") || !password || !name) {
        return NextResponse.json(
          { error: "Provide name, email, and temporary password." },
          { status: 400 }
        );
      }

      const assignedRole =
        actor.role === "super_admin" && newRole === "admin" ? "admin" : "recruiter";

      users[cleanTarget] = {
        email: cleanTarget,
        name: name.trim(),
        passwordHash: password,
        role: assignedRole,
        status: "approved",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveUsers(users);
      return NextResponse.json({
        message: `Added ${name} as ${assignedRole.toUpperCase()}.`,
        allUsers: Object.values(users).map(sanitizeUser),
      });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Auth server error" },
      { status: 500 }
    );
  }
}
