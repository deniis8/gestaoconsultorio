# Pacientes

Arquivos: `src/pages/pacientes/`, `src/services/apis-supabase/pacientes/pacientes.service.ts`, `src/types/pacientes/pacientes.types.ts`.

## Regra central

**Todo paciente cadastrado é obrigado a ter um plano de cobrança vinculado** (`paciente_plano`). O formulário de paciente (`formulario-paciente/index.tsx`) salva paciente e plano juntos, em duas chamadas sequenciais no mesmo submit: primeiro `pacientesService.inserir/atualizar`, depois `pacientePlanoService.inserir/atualizar` usando o id retornado. Validação mínima: nome, data de nascimento, telefone, plano de cobrança, data de início, valor contratado e sessões contratadas são obrigatórios (checados em `validar()`, não só visualmente com `*`).

Consequência prática: em qualquer lugar do sistema que precise saber "o plano do paciente", pode-se assumir que existe (com raras exceções documentadas abaixo).

## Edição sempre é PATCH in-place

Ao editar um paciente já existente, o campo "Plano de Cobrança" no combobox pode ser trocado para outro plano — mas isso **nunca cria um novo registro `paciente_plano`**, sempre faz `PATCH` na mesma linha (`pacientePlanoService.atualizar(pacientePlano.id_paciente_plano, ...)`). Não existe hoje um fluxo de UI para "encerrar o contrato atual e iniciar um novo contrato" para um paciente já existente.

Isso importa para o Financeiro: a geração automática de cobrança de **Pacote** só dispara no caminho de **criação** (`pacientePlanoService.inserir`, paciente novo), nunca em edição — ver [financeiro.md](financeiro.md).

## Busca do plano para edição vs. para uso operacional

Existem dois métodos diferentes em `pacientePlanoService`, para dois propósitos diferentes:

- `buscarPorIdPaciente(id_paciente)` — filtra `status=eq.ativo`. Usado sempre que a intenção é "qual o plano ATIVO desse paciente agora" (Agenda e Financeiro resolvendo `id_paciente_plano` automaticamente ao criar um novo lançamento/agendamento).
- `buscarUltimoPorIdPaciente(id_paciente)` — sem filtro de status, pega o mais recente (`order=created_at.desc&limit=1`). Usado **só** para popular o formulário de edição do paciente, porque se o plano estiver inativo e a busca filtrasse por ativo, o formulário voltaria vazio e o submit criaria um `paciente_plano` duplicado em vez de atualizar o existente (bug real já corrigido).
- `buscarPorIdPacientePlano(id_paciente_plano)` — busca pela chave primária de fato, sem filtro de status. Usado quando já se tem o `id_paciente_plano` (vindo de um `agenda` ou `financeiro`) e se precisa dos dados completos do contrato (valor, quantidade de sessões, plano de cobrança).

## Planos de cobrança disponíveis no combobox

Só planos com `ativo=true` (`planosCobrancaService.listarAtivos()`). Exceção: se o paciente já tem um plano contratado que foi desativado depois, esse plano aparece mesmo assim na lista (com o nome sufixado "(inativo)"), só para não deixar o campo vazio na edição — mas não pode ser selecionado para um paciente novo.

## Visualização mostra o plano mesmo que esteja inativo

`visualizacao-pacientes` usa `buscarUltimoPorIdPaciente` (não `buscarPorIdPaciente`, que filtra `status=eq.ativo`) — assim, inativar o plano de um paciente ("pausar" o tratamento) não faz o card "Plano do Paciente" desaparecer da tela de visualização, só passa a mostrar "Inativo" no campo Status. Isso é intencional: o campo `status` do plano existe pra bloquear novos agendamentos/lançamentos automáticos (Agenda e Financeiro só resolvem `id_paciente_plano` a partir de planos **ativos**), não pra esconder o histórico contratado.

## Exclusão

Botão "Excluir" no `formulario-paciente` (modo edição), com confirmação. Se o paciente tiver `paciente_plano`/`agenda`/`financeiro` vinculados, a exclusão falha por FK e mostra mensagem amigável (ver [padroes-tecnicos.md](padroes-tecnicos.md)) — não há exclusão em cascata implementada.

## Outras regras

- Idade exibida na listagem (`tela-principal`) é calculada considerando mês/dia de nascimento (`calcularIdade` em `src/utils/dataFormat.ts`), não só "ano atual − ano de nascimento".
- CPF, telefone e valores monetários têm máscaras em `src/utils/cpfFormat.ts` e `src/utils/moneyFormat.ts` (`mascaraMoney` para exibição, `formatMoney` para digitação incremental no `InputValor`).
