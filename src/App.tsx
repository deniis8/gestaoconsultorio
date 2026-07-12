import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layouts";
import { Dashboard } from "./pages/dashboard";
import { Configuracoes } from "./pages/configuracoes";
import { Pacientes } from "./pages/pacientes/tela-principal";
import { Relatorios } from "./pages/relatorios";
import { Financeiro } from "./pages/financeiro";
import { Agenda } from "./pages/agenda";
import { NovoPaciente } from "./pages/pacientes/novo-paciente";
import { PlanoCobranca } from "./pages/cobranca";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />
      },
      {
        path: "/pacientes",
        element: <Pacientes />
      },
      {
        path: "/pacientes/novo",
        element: <NovoPaciente />
      },
      {
        path: "/agenda",
        element: <Agenda />
      },
      {
        path: "/financeiro",
        element: <Financeiro />
      },
      
      {
        path: "/planos-cobranca",
        element: <PlanoCobranca />
      },
      {
        path: "/relatorios",
        element: <Relatorios />
      },
      {
        path: "/configuracoes",
        element: <Configuracoes />
      },
    ]
  }
])

export { router };

