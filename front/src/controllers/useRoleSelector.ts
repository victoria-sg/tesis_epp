import { useCallback } from "react";
import type { Rol } from "../models/auth.model";
import { AVAILABLE_ROLES } from "../models/auth.model";

interface Props {
  onSelect: (rol: Rol) => void;
}

export const useRoleSelector = ({ onSelect }: Props) => {
  const handleSelect = useCallback(
    (rol: Rol) => {
      onSelect(rol);
    },
    [onSelect],
  );

  return { roles: AVAILABLE_ROLES, onSelect: handleSelect };
};
