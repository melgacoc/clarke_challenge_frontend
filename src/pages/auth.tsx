import { useState } from "react";
import Login from "./login";
import Register from "./register";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {isLogin ? <Login /> : <Register />}
      <p className="mt-4 text-sm text-gray-600">
        {isLogin ? "Ainda não tem uma conta?" : "Já tem uma conta?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:underline"
        >
          {isLogin ? "Crie aqui" : "Realizar login"}
        </button>
      </p>
    </div>
  );
}
