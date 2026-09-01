import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layouts";
import { Dashboard } from "./pages/dashboard";
import { Pacientes } from "./pages/pacientes/tela-principal";
import { Relatorios } from "./pages/relatorios";
import { Financeiro } from "./pages/financeiro";
import { Agendamentos } from "./pages/agenda";
import { FormularioPaciente } from "./pages/pacientes/formulario-paciente";
import { PlanoCobranca } from "./pages/planos-cobranca/tela-principal";
import { ConfiguracoesVisualizacao } from "./pages/configuracoes/visualizacao-configuracoes";
import { ConfiguracoesEdicao } from "./pages/configuracoes/edicao-configuracoes";
import { Login } from "./pages/login";
import { FormularioPlanoCobranca } from "./pages/planos-cobranca/formulario-cobranca";
import { PlanoCobrancaVisualizacao } from "./pages/planos-cobranca/visualizacao-cobranca";
import { VisualizacaoPacientes } from "./pages/pacientes/visualizacao-pacientes";

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
        path: "/pacientes/formulario/:id_paciente?",
        element: <FormularioPaciente />
      },
      {
        path: "/pacientes/visualizacao/:id_paciente",
        element: <VisualizacaoPacientes />
      },
      {
        path: "/agenda",
        element: <Agendamentos />
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
        element: <FormularioPlanoCobranca />
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

