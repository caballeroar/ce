import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  acceptInvite,
  getUser,
  handleAuthCallback,
  login,
  logout,
  onAuthChange,
  requestPasswordRecovery,
  updateUser,
  type User,
} from "@netlify/identity";
import { LoaderCircle, Sparkles } from "lucide-react";
import "./AuthGate.css";

const allowedEmails = new Set([
  "amelrc@gmail.com",
  "jay@justcommonpeople.com",
]);

type AuthMode = "login" | "invite" | "forgot" | "recovery";
type AuthState = "checking" | "signed-out" | "authenticated" | "denied";

let authCallback: ReturnType<typeof handleAuthCallback> | undefined;

type AuthGateProps = {
  children: (user: User, onLogout: () => Promise<void>) => ReactNode;
};

function getAuthCallback() {
  authCallback ??= handleAuthCallback();
  return authCallback;
}

function isAllowed(user: User) {
  return Boolean(user.email && allowedEmails.has(user.email.trim().toLowerCase()));
}

function errorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Er ging iets mis. Probeer het opnieuw.";
}

export default function AuthGate({ children }: AuthGateProps) {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<AuthMode>("login");
  const [inviteToken, setInviteToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    let rejectedSession = false;

    async function applyUser(nextUser: User | null) {
      if (!active) return;
      if (nextUser && !isAllowed(nextUser)) {
        rejectedSession = true;
        setUser(null);
        setAuthState("denied");
        try {
          await logout();
        } catch (error) {
          if (active) setMessage(errorMessage(error));
        }
        return;
      }

      if (nextUser) {
        rejectedSession = false;
        setUser(nextUser);
        setAuthState("authenticated");
        setMessage("");
        return;
      }

      setUser(null);
      setAuthState(rejectedSession ? "denied" : "signed-out");
    }

    const unsubscribe = onAuthChange((event, changedUser) => {
      if (event === "recovery") return;
      void applyUser(changedUser);
    });

    async function initialize() {
      try {
        const callback = await getAuthCallback();
        if (!active) return;

        if (callback?.type === "invite" && callback.token) {
          setInviteToken(callback.token);
          setMode("invite");
          setAuthState("signed-out");
          return;
        }
        if (callback?.type === "recovery" && callback.user) {
          setMode("recovery");
          setAuthState("signed-out");
          return;
        }

        await applyUser(await getUser());
      } catch (error) {
        if (!active) return;
        setMessage(errorMessage(error));
        setAuthState("signed-out");
      }
    }

    void initialize();
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      if (mode === "forgot") {
        await requestPasswordRecovery(email.trim().toLowerCase());
        setMessage("Controleer je e-mail voor de herstellink.");
        return;
      }

      if (mode === "recovery") {
        await updateUser({ password });
        const currentUser = await getUser();
        if (!currentUser) {
          throw new Error("Je sessie is verlopen. Vraag een nieuwe herstellink aan.");
        }
        if (!isAllowed(currentUser)) {
          await logout();
          setAuthState("denied");
          return;
        }
        setUser(currentUser);
        setAuthState("authenticated");
        setPassword("");
        return;
      }

      const currentUser =
        mode === "invite"
          ? await acceptInvite(inviteToken, password)
          : await login(email.trim().toLowerCase(), password);

      if (!isAllowed(currentUser)) {
        await logout();
        setAuthState("denied");
        setMessage("Dit account heeft geen toegang tot deze roadmap.");
        return;
      }

      setUser(currentUser);
      setAuthState("authenticated");
      setMode("login");
      setPassword("");
    } catch (error) {
      setMessage(errorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  async function signOut() {
    try {
      await logout();
      setUser(null);
      setAuthState("signed-out");
      setMessage("");
    } catch (error) {
      setUser(null);
      setAuthState("signed-out");
      setMode("login");
      setMessage(errorMessage(error));
    }
  }

  if (authState === "checking") {
    return (
      <main className="auth-page" aria-busy="true">
        <div className="auth-loading">
          <LoaderCircle size={22} className="auth-spinner" />
          <span>Toegang controleren...</span>
        </div>
      </main>
    );
  }

  if (authState === "authenticated" && user) {
    return children(user, signOut);
  }

  return (
    <main className="auth-page">
      <div className="auth-cityscape" aria-hidden="true" />
      <section className="auth-card" aria-labelledby="auth-title">
        <header className="auth-heading">
          <h1 id="auth-title">Transitie Roadmap</h1>
          <p>Circulaire Economie Den Haag</p>
        </header>

        <form className="auth-form" onSubmit={submit}>
          {(mode === "login" || mode === "forgot") && (
            <label>
              <span>E-mail</span>
              <input
                autoComplete="email"
                autoFocus
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
          )}

          {(mode === "login" || mode === "invite" || mode === "recovery") && (
            <label>
              <span>{mode === "login" ? "Password" : "Nieuw wachtwoord"}</span>
              <input
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                autoFocus={mode !== "login"}
                minLength={8}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
          )}

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting && <LoaderCircle size={18} className="auth-spinner" />}
            {submitting
              ? "Even geduld..."
              : mode === "invite"
                ? "Uitnodiging accepteren"
                : mode === "forgot"
                  ? "Herstellink versturen"
                  : mode === "recovery"
                    ? "Wachtwoord opslaan"
                    : "Inloggen"}
          </button>
        </form>

        {mode === "login" ? (
          <button
            className="auth-text-button"
            type="button"
            onClick={() => {
              setMode("forgot");
              setMessage("");
            }}
          >
            Wachtwoord vergeten?
          </button>
        ) : mode === "forgot" ? (
          <button
            className="auth-text-button"
            type="button"
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
          >
            Terug naar inloggen
          </button>
        ) : null}

        {(message || authState === "denied") && (
          <p
            className="auth-message"
            role={authState === "denied" ? "alert" : "status"}
          >
            {message || "Dit account is niet gemachtigd voor de roadmap."}
          </p>
        )}
      </section>
      <div className="auth-partner" aria-label="Powered by Just Common People">
        <span>Powered by</span>
        <strong>
          just common people <Sparkles size={20} aria-hidden="true" />
        </strong>
      </div>
    </main>
  );
}
