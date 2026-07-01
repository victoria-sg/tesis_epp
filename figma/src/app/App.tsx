import { useState } from "react";
import { RoleSelector } from "./components/RoleSelector";
import { LoginScreen } from "./components/LoginScreen";
import { ResetPasswordScreen } from "./components/ResetPasswordScreen";
import { AppShell } from "./components/AppShell";
import type { LoggedUser } from "./components/data";
import { DEMO_USERS } from "./components/data";

type AppStep = "role-select" | "login" | "reset" | "app";

export default function App() {
  const [step, setStep] = useState<AppStep>("role-select");
  const [selectedUser, setSelectedUser] = useState<LoggedUser | null>(null);
  const [currentUser, setCurrentUser] = useState<LoggedUser | null>(null);

  function handleRoleSelect(user: LoggedUser) {
    setSelectedUser(user);
    setStep("login");
  }

  function handleLogin(user: LoggedUser) {
    setCurrentUser(user);
    setStep("app");
  }

  function handleLogout() {
    setCurrentUser(null);
    setSelectedUser(null);
    setStep("role-select");
  }

  if (step === "app" && currentUser) {
    return <AppShell user={currentUser} onLogout={handleLogout} />;
  }

  if (step === "role-select" || (step === "login" && selectedUser)) {
    return (
      <>
        <LoginScreen
          preselectedUser={selectedUser ?? DEMO_USERS[0]}
          onLogin={handleLogin}
          onGoToReset={() => setStep("reset")}
          onChangeRole={() => setStep("role-select")}
        />
        {step === "role-select" && <RoleSelector onSelect={handleRoleSelect} />}
      </>
    );
  }

  if (step === "reset") {
    return (
      <ResetPasswordScreen
        onReset={() => setStep(selectedUser ? "login" : "role-select")}
        onBackToLogin={() => setStep(selectedUser ? "login" : "role-select")}
      />
    );
  }

  return <RoleSelector onSelect={handleRoleSelect} />;
}
