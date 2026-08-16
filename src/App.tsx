import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layouts";
import { Dashboard } from "./pages/dashboard";
import { Pacientes } from "./pages/pacientes/tela-principal";
import { Relatorios } from "./pages/relatorios";
import { Financeiro } from "./pages/financeiro";
import { Agenda } from "./pages/agenda";
import { NovoPaciente } from "./pages/pacientes/novo-paciente";
import { PlanoCobranca } from "./pages/cobranca/tela-principal";
import { ConfiguracoesVisualizacao } from "./pages/configuracoes/visualizacao-configuracoes";
import { ConfiguracoesEdicao } from "./pages/configuracoes/edicao-configuracoes";
import { Login } from "./pages/login";
import { NovoPlanoCobranca } from "./pages/cobranca/nova-cobranca";
import { PlanoCobrancaVisualizacao } from "./pages/cobranca/visualizacao-cobranca";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
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
        path: "/planos-cobranca/formulario/:id_plano_cobranca?",
        element: <NovoPlanoCobranca />
      },
      {
        path: "/planos-cobranca/visualizacao/:id_plano_cobranca",
        element: <PlanoCobrancaVisualizacao />
      },
      {
        path: "/relatorios",
        element: <Relatorios />
      },
      {
        path: "/configuracoes",
        element: <ConfiguracoesVisualizacao />
      },
      {
        path: "/configuracoes/editar",
        element: <ConfiguracoesEdicao />
      }
    ]
  }
])

export { router };

