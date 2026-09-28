// ================================
// DADOS MOCKADOS - FRONT-END
// ================================
// FUTURA INTEGRAÇÃO COM BACKEND:
// Substituir estes dados mockados pela API real.
const colaboradores = [
  { cpf: '98765432100', nome: 'Ester Santos', nascimento: '1998-08-20', empresa: 'Fisiomed', cargo: 'Analista de Atendimento', ultimoExame: '15/08/2026', tipoExame: 'Periódico', dataExame: '15/08/2026', demissao: '—', status: 'Ativo' },
  { cpf: '12345678909', nome: 'Kelvin Braga', nascimento: '1990-04-13', empresa: 'Fisiomed', cargo: 'Analista de Atendimento', ultimoExame: '02/09/2026', tipoExame: 'Admissional', dataExame: '02/09/2026', demissao: '—', status: 'Ativo' },
  { cpf: '11144477735', nome: 'Artur Candido', nascimento: '1995-12-06', empresa: 'Fisiomed', cargo: 'Técnico de Segurança', ultimoExame: '10/07/2026', tipoExame: 'Retorno ao trabalho', dataExame: '10/07/2026', demissao: '—', status: 'Ativo' },
  { cpf: '52998224725', nome: 'Natiele Almeida', nascimento: '1998-08-20', empresa: 'Fisiomed', cargo: 'Assistente Administrativo', ultimoExame: '21/06/2026', tipoExame: 'Periódico', dataExame: '21/06/2026', demissao: '—', status: 'Ativo' },
  { cpf: '45288912074', nome: 'Isabelle Meira', nascimento: '1988-05-14', empresa: 'TecnoLog Logística Integrada', cargo: 'Operador de Empilhadeira', ultimoExame: '09/09/2026', tipoExame: 'Admissional', dataExame: '09/09/2026', demissao: '—', status: 'Ativo' }
];

let agendamentos = [
  { nome: 'Fulano de Tal', cpf: '219.004.582-10', exame: 'Admissional', horario: '08:30', status: 'Confirmado', classe: 'confirmed' },
  { nome: 'Ester Santos', cpf: '987.654.321-00', exame: 'Periódico', horario: '10:00', status: 'Pendente', classe: 'waiting' },
  { nome: 'Kelvin Braga', cpf: '123.456.789-09', exame: 'Demissional', horario: '14:00', status: 'Cancelado', classe: 'cancelled' },
  { nome: 'Artur Candido', cpf: '111.444.777-35', exame: 'Retorno ao trabalho', horario: '15:30', status: 'Não compareceu', classe: 'absent' }
];

// Configurações temporárias do upload; podem ser ajustadas sem mudar a lógica.
const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
let arquivosSelecionados = [];

const $ = (seletor) => document.querySelector(seletor);
const cpfLimpo = (valor) => valor.replace(/D/g, '').slice(0, 11);
const formatCPF = (valor) => cpfLimpo(valor)
  .replace(/(d{3})(d)/, '$1.$2')
  .replace(/(d{3})(d)/, '$1.$2')
  .replace(/(d{3})(d{1,2})$/, '$1-$2');

function aviso(mensagem) {
  const toast = $('#toast');
  toast.textContent = mensagem;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function statusClasse(status) {
  return {
    Confirmado: 'confirmed',
    Pendente: 'waiting',
    Cancelado: 'cancelled',
    'Não compareceu': 'absent'
  }[status] || 'waiting';
}

function linhaAgendamento(agendamento, indice) {
  return `<tr>
    <td><strong>${agendamento.nome}</strong><small>${agendamento.cpf}</small></td>
    <td><strong>${agendamento.exame}</strong></td>
    <td><span class="time">${agendamento.horario}</span></td>
    <td><span class="status ${agendamento.classe}"><i></i>${agendamento.status}</span></td>
    <td><button class="table-action" data-appointment-view="${indice}" title="Visualizar ficha">◉</button><button class="table-action" data-print="${indice}" title="Imprimir comprovante">▣</button></td>
  </tr>`;
}

function renderTabela() {
  const linhas = agendamentos.map(linhaAgendamento).join('');
  $('#appointments-body').innerHTML = linhas;
  $('#appointments-full-body').innerHTML = linhas;
  $('#total-label').textContent = `Exibindo ${agendamentos.length} de ${agendamentos.length} agendamentos`;
  renderGrafico();
}

function renderGrafico() {
  const grupos = [
    { nome: 'Confirmados', status: 'Confirmado', cor: '#047857' },
    { nome: 'Pendentes', status: 'Pendente', cor: '#a16207' },
    { nome: 'Cancelados', status: 'Cancelado', cor: '#dc2626' },
    { nome: 'Não compareceu', status: 'Não compareceu', cor: '#64748b' }
  ];
  const total = Math.max(agendamentos.length, 1);
  let inicio = 0;
  const partes = grupos.map((grupo) => {
    const quantidade = agendamentos.filter((item) => item.status === grupo.status).length;
    const fim = inicio + (quantidade / total) * 360;
    const parte = `${grupo.cor} ${inicio}deg ${fim}deg`;
    inicio = fim;
    return { ...grupo, quantidade, parte };
  });

  $('#grafico-pizza').style.background = `conic-gradient(${partes.map((parte) => parte.parte).join(', ')})`;
  $('#legenda-grafico').innerHTML = partes.map((parte) => `<li><i style="background:${parte.cor}"></i>${parte.nome}<strong>${parte.quantidade}</strong></li>`).join('');
}

function renderColaboradores() {
  $('#colaboradores-body').innerHTML = colaboradores.map((colaborador) => `<tr>
    <td><strong>${colaborador.nome}</strong></td><td>${formatCPF(colaborador.cpf)}</td>
    <td>${new Date(`${colaborador.nascimento}T12:00:00`).toLocaleDateString('pt-BR')}</td>
    <td>${colaborador.cargo}</td><td>${colaborador.ultimoExame}</td><td>${colaborador.tipoExame}</td>
    <td>${colaborador.dataExame}</td><td>${colaborador.demissao}</td><td>${colaborador.status}</td>
  </tr>`).join('');
}

function mostrarPessoa(pessoa) {
  $('#resultadoBusca').dataset.pessoa = JSON.stringify(pessoa);
  $('#resultadoBusca').innerHTML = `<span class="person-icon">♙</span><div><h3>${pessoa.nome} <small>Ativo / Regular</small></h3><p><b>CPF:</b> ${formatCPF(pessoa.cpf)} &nbsp; <b>Nascimento:</b> ${new Date(`${pessoa.nascimento}T12:00:00`).toLocaleDateString('pt-BR')} &nbsp; <b>Empresa:</b> ${pessoa.empresa} &nbsp; <b>Cargo:</b> ${pessoa.cargo}</p></div><div class="result-buttons"><button type="button" class="soft" data-fill>Preencher no agendamento</button></div>`;
}

function atualizarCamposDinamicos() {
  const tipo = $('#tipo-exame').value;
  $('#campo-funcao').hidden = tipo !== 'mudanca';
  $('#area-upload').hidden = !['retorno', 'interconsulta'].includes(tipo);

  if (tipo === 'retorno') {
    $('#upload-explicacao').textContent = 'Para exames de retorno ao trabalho, é necessário anexar o atestado do INSS e/ou os atestados médicos do colaborador.';
  }
  if (tipo === 'interconsulta') {
    $('#upload-explicacao').textContent = 'Para interconsulta, é necessário anexar os atestados médicos do colaborador.';
  }
  $('#upload-limites').textContent = `Máximo de ${MAX_FILES} arquivos, até ${MAX_FILE_SIZE_MB} MB por arquivo. Formatos: PDF, JPG e PNG.`;
}

function renderArquivos() {
  $('#lista-arquivos').innerHTML = arquivosSelecionados.map((arquivo, indice) => `<li><span>${arquivo.name}</span><button type="button" data-remove-file="${indice}" aria-label="Remover arquivo">×</button></li>`).join('');
}

function validarCPF(valor) {
  const numero = cpfLimpo(valor);
  if (numero.length !== 11 || /^(\d)\1{10}$/.test(numero)) return false;
  const calcularDigito = (base) => {
    let soma = 0;
    for (let indice = 0; indice < base.length; indice += 1) soma += Number(base[indice]) * (base.length + 1 - indice);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };
  return calcularDigito(numero.slice(0, 9)) === Number(numero[9])
    && calcularDigito(numero.slice(0, 10)) === Number(numero[10]);
}

function validarAgendamento() {
  const nome = $('#nome').value.trim();
  const nascimento = $('#data-nascimento').value;
  const dataExame = $('#data-exame').value;
  const tipo = $('#tipo-exame').value;

  if (!nome) return 'Informe o nome completo.';
  if (!validarCPF($('#cpf').value)) return 'Informe um CPF válido.';
  if (!nascimento || new Date(`${nascimento}T12:00:00`) > new Date()) return 'Informe uma data de nascimento válida e não futura.';
  if (!tipo) return 'Selecione o tipo de exame.';
  if (tipo === 'mudanca' && !$('#nova-funcao').value.trim()) return 'Informe o novo cargo do colaborador.';
  if (!$('#medico').value) return 'Selecione a clínica.';
  if (!dataExame) return 'Selecione a data do exame.';
  return '';
}

function mudarView(nome) {
  document.querySelectorAll('.app-view').forEach((view) => { view.hidden = view.id !== `${nome}-view`; });
  document.querySelectorAll('.nav-item').forEach((item) => item.classList.toggle('active', item.dataset.view === nome));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderASO(termo = '') {
  const pessoas = colaboradores.filter((pessoa) => pessoa.nome.toLowerCase().includes(termo.toLowerCase()));
  $('#resultado-aso').innerHTML = pessoas.length ? pessoas.map((pessoa) => `<article class="aso-item"><div><strong>${pessoa.nome}</strong><span>ASO ${pessoa.tipoExame}</span><small>${pessoa.dataExame}</small></div><button class="soft" type="button" data-open-aso>Ver</button></article>`).join('') : '<p>Nenhum colaborador encontrado.</p>';
}

$('#buscaCPF').addEventListener('input', (evento) => { evento.target.value = formatCPF(evento.target.value); });
$('#cpf').addEventListener('input', (evento) => { evento.target.value = formatCPF(evento.target.value); });

$('#search-form').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const pessoa = colaboradores.find((colaborador) => colaborador.cpf === cpfLimpo($('#buscaCPF').value));
  if (!$('#buscaCPF').value) return aviso('Digite um CPF para pesquisar.');
  if (pessoa) return mostrarPessoa(pessoa);
  $('#resultadoBusca').innerHTML = '<div><h3>CPF não encontrado</h3><p>O colaborador não está cadastrado. Preencha os dados manualmente no agendamento.</p></div><div class="result-buttons"><button type="button" class="soft" data-new>Cadastrar novo colaborador</button></div>';
});

$('#resultadoBusca').addEventListener('click', (evento) => {
  if (evento.target.closest('[data-fill]')) {
    const pessoa = JSON.parse($('#resultadoBusca').dataset.pessoa || '{}');
    $('#nome').value = pessoa.nome || '';
    $('#cpf').value = formatCPF(pessoa.cpf || '');
    $('#data-nascimento').value = pessoa.nascimento || '';
    $('#agendamento').scrollIntoView({ behavior: 'smooth' });
  }
  if (evento.target.closest('[data-new]')) { $('#agendamento').scrollIntoView({ behavior: 'smooth' }); $('#nome').focus(); }
});

$('#tipo-exame').addEventListener('change', atualizarCamposDinamicos);
$('#documentos').addEventListener('change', (evento) => {
  const novosArquivos = [...evento.target.files];
  for (const arquivo of novosArquivos) {
    if (!ALLOWED_FILE_TYPES.includes(arquivo.type)) return aviso('Selecione somente arquivos PDF, JPG ou PNG.');
    if (arquivo.size > MAX_FILE_SIZE_MB * 1024 * 1024) return aviso(`Cada arquivo pode ter até ${MAX_FILE_SIZE_MB} MB.`);
  }
  if (arquivosSelecionados.length + novosArquivos.length > MAX_FILES) return aviso(`Você pode selecionar até ${MAX_FILES} arquivos.`);
  arquivosSelecionados = [...arquivosSelecionados, ...novosArquivos];
  evento.target.value = '';
  renderArquivos();
});

$('#appointment-form').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const erro = validarAgendamento();
  if (erro) return aviso(erro);

  // ================================
  // FUTURA INTEGRAÇÃO COM BACKEND
  // ================================
  // Substituir persistência mockada pela API real.
  agendamentos.unshift({
    nome: $('#nome').value.trim(),
    cpf: formatCPF($('#cpf').value),
    exame: $('#tipo-exame').selectedOptions[0].text,
    horario: 'A definir',
    status: 'Confirmado',
    classe: statusClasse('Confirmado')
  });
  renderTabela();
  evento.target.reset();
  arquivosSelecionados = [];
  renderArquivos();
  atualizarCamposDinamicos();
  aviso('Agendamento confirmado com sucesso.');
});

$('#novo-agendamento').addEventListener('click', () => {
  mudarView('dashboard');
  setTimeout(() => $('#agendamento').scrollIntoView({ behavior: 'smooth' }), 100);
});

$('#busca-aso').addEventListener('input', (evento) => renderASO(evento.target.value));
$('#cliente-form').addEventListener('submit', (evento) => {
  evento.preventDefault();
  aviso('Cliente cadastrado na simulação de front-end.');
  evento.target.reset();
});

document.addEventListener('click', (evento) => {
  const menu = evento.target.closest('[data-view]');
  if (menu) mudarView(menu.dataset.view);
  if (evento.target.closest('[data-remove-file]')) {
    arquivosSelecionados.splice(Number(evento.target.closest('[data-remove-file]').dataset.removeFile), 1);
    renderArquivos();
  }
  if (evento.target.closest('[data-view]')) return;
  if (evento.target.closest('[data-open-aso]')) $('#modal-aso').hidden = false;
  if (evento.target.closest('[data-close-aso]')) $('#modal-aso').hidden = true;
  if (evento.target.closest('[data-download-aso]')) aviso('Download demonstrativo disponível na futura integração com backend.');
  const visualizar = evento.target.closest('[data-appointment-view]');
  if (visualizar) aviso(`Ficha de ${agendamentos[visualizar.dataset.appointmentView].nome} aberta.`);
  if (evento.target.closest('[data-print]')) aviso('Comprovante preparado para impressão.');
});

renderTabela();
renderColaboradores();
renderASO();
atualizarCamposDinamicos();
