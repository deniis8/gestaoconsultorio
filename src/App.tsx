import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./layouts";
import { Loading } from "./components/layout/loading";
import { Dashboard } from "./pages/dashboard";
import { Pacientes } from "./pages/pacientes/tela-principal";
import { Financeiro } from "./pages/financeiro/tela-principal";
import { FormularioFinanceiro } from "./pages/financeiro/formulario-financeiro";
import { VisualizacaoFinanceiro } from "./pages/financeiro/visualizacao-financeiro";
import { Agendamentos } from "./pages/agendamentos/agenda";
import { FormularioPaciente } from "./pages/pacientes/formulario-paciente";
import { PlanoCobranca } from "./pages/planos-cobranca/tela-principal";
import { ConfiguracoesVisualizacao } from "./pages/configuracoes/visualizacao-configuracoes";
import { ConfiguracoesEdicao } from "./pages/configuracoes/edicao-configuracoes";
import { Login } from "./pages/login";
import { FormularioPlanoCobranca } from "./pages/planos-cobranca/formulario-cobranca";
import { PlanoCobrancaVisualizacao } from "./pages/planos-cobranca/visualizacao-cobranca";
import { VisualizacaoPacientes } from "./pages/pacientes/visualizacao-pacientes";
import { NaoEncontrado } from "./pages/nao-encontrado";

// Lazy: Relatórios carrega xlsx/jspdf (bibliotecas pesadas, com dependências como
// html2canvas) só quando a rota é acessada, em vez de inflar o bundle inicial de todo mundo.
const Relatorios = lazy(() =>
  import("./pages/relatorios").then((modulo) => ({ default: modulo.Relatorios }))
);

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
        path: "/financeiro/formulario/:id_financeiro?",
        element: <FormularioFinanceiro />
      },
      {
        path: "/financeiro/visualizacao/:id_financeiro",
        element: <VisualizacaoFinanceiro />
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
        element: (
          <Suspense fallback={<Loading loading={true} />}>
            <Relatorios />
          </Suspense>
        )
      },
      {
        path: "/configuracoes",
        element: <ConfiguracoesVisualizacao />
      },
      {
        path: "/configuracoes/editar",
        element: <ConfiguracoesEdicao />
      },
      {
        path: "*",
        element: <NaoEncontrado />
      }
    ]
  }
])

export { router };

