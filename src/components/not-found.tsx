import { useNavigate } from "react-router";
import { HouseSimple } from "@phosphor-icons/react";
import logo from "../assets/logo.svg";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-2">
      <div className="flex flex-1 flex-col justify-center">
        <img
          src={logo}
          alt="otakuVERISSIMO"
          className="w-40 self-center cursor-pointer"
          onClick={() => navigate("/")}
        />

        <div className="flex flex-col items-center justify-center py-4">
          <strong className="text-[44px]">404</strong>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mx-auto flex w-fit items-center justify-center gap-2 rounded-lg p-2 text-xl transition hover:bg-main/10 hover:text-main"
        >
          <HouseSimple weight="duotone" size={32} />
          Back to home
        </button>
      </div>
    </div>
  );
}
