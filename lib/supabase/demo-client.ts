import { DEMO_READONLY_EVENT } from "@/lib/demo";
import { buildDemoData, type DemoTables, type DemoUser } from "./demo-data";

export type { DemoUser as User } from "./demo-data";

type QueryError = { message: string };
type QueryResult<Data> = {
  data: Data | null;
  count: number | null;
  error: QueryError | null;
};
type AuthResult<Data> = Promise<{ data: Data; error: QueryError | null }>;
type NoSession = { user: DemoUser | null; session: null };

// The part of the Supabase auth API the app calls
interface DemoAuth {
  getUser(): AuthResult<{ user: DemoUser | null }>;
  updateUser(attributes: {
    data: Record<string, unknown>;
  }): AuthResult<{ user: DemoUser | null }>;
  signOut(): Promise<{ error: null }>;
  signInWithPassword(credentials: {
    email: string;
    password: string;
  }): AuthResult<NoSession>;
  signInWithOAuth(credentials: {
    provider: "google";
    options?: { redirectTo?: string };
  }): AuthResult<{ url: string | null }>;
  exchangeCodeForSession(code: string): AuthResult<NoSession>;
  signUp(credentials: {
    email: string;
    password: string;
    options?: { data?: Record<string, unknown>; emailRedirectTo?: string };
  }): AuthResult<NoSession>;
}

const readOnlyError: QueryError = { message: "Guest demo is read-only" };
const noAccountsError: QueryError = {
  message: "This demo has no accounts. Use Try Live Demo on the home page.",
};
const signUpDisabledError: QueryError = {
  message: "Sign-up is disabled in this demo. Use Try Live Demo on the home page.",
};

// Tells the dashboard to show its read-only notice (browser only)
function notifyReadOnly() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(DEMO_READONLY_EVENT));
  }
}

// Read-only stand-in for the Supabase query builder over in-memory rows.
// Supports the subset of the API the dashboard uses.
class DemoQuery<Row, Data = Row[]> implements PromiseLike<QueryResult<Data>> {
  private filters: Array<(row: Row) => boolean> = [];
  private sort?: { column: keyof Row; ascending: boolean };
  private bounds?: [number, number];
  private countRows = false;
  private headOnly = false;
  private singleRow = false;
  private isWrite = false;

  constructor(private rows: Row[]) {}

  select(_columns?: string, options?: { count?: "exact"; head?: boolean }) {
    this.countRows = !!options?.count;
    this.headOnly = !!options?.head;
    return this;
  }
  // Writes are refused; the values are typed only to match the Supabase API
  insert: (values: Partial<Row>) => this = () => this.write();
  update: (values: Partial<Row>) => this = () => this.write();
  delete: () => this = () => this.write();
  eq<K extends keyof Row>(column: K, value: Row[K]) {
    this.filters.push((row) => row[column] === value);
    return this;
  }
  gte<K extends keyof Row>(column: K, value: Row[K]) {
    this.filters.push((row) => String(row[column]) >= String(value));
    return this;
  }
  order(column: keyof Row, options?: { ascending?: boolean }) {
    this.sort = { column, ascending: options?.ascending ?? true };
    return this;
  }
  range(from: number, to: number) {
    this.bounds = [from, to];
    return this;
  }
  limit(count: number) {
    return this.range(0, count - 1);
  }
  single() {
    this.singleRow = true;
    return this as unknown as DemoQuery<Row, Row>;
  }

  then<Fulfilled = QueryResult<Data>, Rejected = never>(
    onFulfilled?: (value: QueryResult<Data>) => Fulfilled | PromiseLike<Fulfilled>,
    onRejected?: (reason: unknown) => Rejected | PromiseLike<Rejected>
  ) {
    return Promise.resolve(this.execute()).then(onFulfilled, onRejected);
  }

  private write() {
    this.isWrite = true;
    return this;
  }

  private execute(): QueryResult<Data> {
    if (this.isWrite) {
      notifyReadOnly();
      return { data: null, count: null, error: readOnlyError };
    }

    let result = this.rows.filter((row) => this.filters.every((f) => f(row)));
    const count = result.length;

    if (this.sort) {
      const { column, ascending } = this.sort;
      result = [...result].sort((a, b) => {
        const cmp = String(a[column]).localeCompare(String(b[column]));
        return ascending ? cmp : -cmp;
      });
    }
    if (this.bounds) {
      result = result.slice(this.bounds[0], this.bounds[1] + 1);
    }

    const data = this.headOnly
      ? null
      : this.singleRow
        ? (result[0] ?? null)
        : result;
    return {
      data: data as Data | null,
      count: this.countRows ? count : null,
      error: null,
    };
  }
}

interface DemoSession {
  // Whether the visitor has entered the guest demo
  isSignedIn: () => boolean;
  // Leaves the guest demo
  signOut: () => void;
}

// In-memory replacement for the Supabase client: the guest demo is the only
// session, and the data is the read-only sample restaurant.
export function createDemoClient({ isSignedIn, signOut }: DemoSession) {
  const { user, tables } = buildDemoData(Date.now());
  const currentUser = () => (isSignedIn() ? user : null);
  const noSession: NoSession = { user: null, session: null };

  const auth: DemoAuth = {
    getUser: async () => ({ data: { user: currentUser() }, error: null }),
    updateUser: async () => {
      notifyReadOnly();
      return { data: { user: currentUser() }, error: readOnlyError };
    },
    signOut: async () => {
      signOut();
      return { error: null };
    },
    signInWithPassword: async () => ({ data: noSession, error: noAccountsError }),
    signInWithOAuth: async () => ({ data: { url: null }, error: noAccountsError }),
    exchangeCodeForSession: async () => ({ data: noSession, error: noAccountsError }),
    signUp: async () => ({ data: noSession, error: signUpDisabledError }),
  };

  return {
    auth,
    from: <Table extends keyof DemoTables>(table: Table) =>
      new DemoQuery<DemoTables[Table][number]>(tables[table]),
  };
}
