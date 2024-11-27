import { useState, useEffect } from "react";

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export function Login() {
  interface User {
    name: string;
    picture: string;
  }

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    // Carga el SDK de Facebook al iniciar la app
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: import.meta.env.VITE_APP_ID, // Reemplaza con tu App ID de Facebook
        cookie: true,
        xfbml: true,
        version: "v21.0",
      });
    };

    // Cargar el script de Facebook SDK
    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    })(document, "script", "facebook-jssdk");
  }, []);

  const handleLogin = () => {
    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          window.FB.api(
            "/me",
            { fields: "id,name,picture" },
            (userData: {
              name: string;
              picture: { data: { url: string } };
            }) => {
              setUser({
                name: userData.name,
                picture: userData.picture.data.url,
              });
              console.log(userData);
            }
          );
        } else {
          alert("El inicio de sesión fue cancelado.");
        }
      },
      { scope: "public_profile,email" }
    );
  };
  return (
    <div>
      <h2>Iniciar Sesión con Facebook Js</h2>
      {!user ? (
        <button
          onClick={handleLogin}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4267B2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Iniciar Sesión con Facebook
        </button>
      ) : (
        <div>
          <h2>Bienvenido, {user.name}</h2>
          <img
            src={user.picture}
            alt="Perfil"
            style={{ borderRadius: "50%", marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  );
}
