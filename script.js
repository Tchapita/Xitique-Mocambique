document.addEventListener("DOMContentLoaded", () => {
  const formSection = document.getElementById('formSection');
  const simulacaoSection = document.getElementById('simulacaoSection');
  const confirmacaoSection = document.getElementById('confirmacaoSection');
  const inscricaoForm = document.getElementById('inscricaoForm');
  const simulacaoForm = document.getElementById('simulacaoForm');
  const primeiroReceber = document.getElementById('primeiroReceber');
  const taxaSection = document.getElementById('taxaSection');
  const mensagemTaxa = document.getElementById('mensagemTaxa');
  const comprovativoInput = document.getElementById('comprovativo');

  let dadosUsuario = {};
  let metodoPagamento = "";

  // --- Dados com logotipos offline e fallback online ---
  const dadosPagamento = {
    "M-Pesa": {
      numero: "84 123 4567",
      nome: "Xitique Moz Lda",
      logo: "assets/mpesa.png",
      logoBackup: "https://upload.wikimedia.org/wikipedia/commons/5/59/M-Pesa-Logo.png",
      cor: "from-green-100 to-green-50"
    },
    "e-Mola": {
      numero: "86 987 6543",
      nome: "Xitique Moz Lda",
      logo: "assets/emola.png",
      logoBackup: "https://upload.wikimedia.org/wikipedia/commons/5/5a/EMola_logo.png",
      cor: "from-blue-100 to-blue-50"
    },
    "mKesh": {
      numero: "85 222 3344",
      nome: "Xitique Moz Lda",
      logo: "assets/mkesh.png",
      logoBackup: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Mkesh_logo.png",
      cor: "from-yellow-100 to-yellow-50"
    }
  };

  // --- Fallback automático se as imagens locais não existirem ---
  Object.values(dadosPagamento).forEach(metodo => {
    const img = new Image();
    img.src = metodo.logo;
    img.onerror = () => (metodo.logo = metodo.logoBackup);
  });

  // --- Formulário de inscrição ---
  inscricaoForm.addEventListener('submit', e => {
    e.preventDefault();
    dadosUsuario.nome = document.getElementById('nome').value;
    dadosUsuario.provincia = document.getElementById('provincia').value;
    dadosUsuario.telefone = document.getElementById('telefone').value;
    formSection.classList.add('hidden');
    simulacaoSection.classList.remove('hidden');
  });

  // --- Mostrar opções ---
  primeiroReceber.addEventListener('change', () => {
    const valor = parseFloat(document.getElementById('valorXitique').value);
    if (primeiroReceber.checked && valor > 0) {
      const taxa = valor * 0.1;
      mensagemTaxa.textContent = `Para seres o primeiro a receber, paga 10% (${taxa.toFixed(2)} MZN) agora. Escolhe o método de pagamento:`;
      taxaSection.classList.remove('hidden');
    } else {
      taxaSection.classList.add('hidden');
    }
  });

  // --- Botões de pagamento ---
  const botoes = {
    mpesa: document.getElementById('btnMpesa'),
    emola: document.getElementById('btnEmola'),
    mkesh: document.getElementById('btnMkesh')
  };

  Object.entries(botoes).forEach(([key, btn]) => {
    btn.addEventListener('click', () => mostrarDadosPagamento(key));
  });

  function mostrarDadosPagamento(tipo) {
    const metodo = tipo === "mpesa" ? "M-Pesa" : tipo === "emola" ? "e-Mola" : "mKesh";
    metodoPagamento = metodo;
    const info = dadosPagamento[metodo];

    let box = document.getElementById('dadosPagamentoBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'dadosPagamentoBox';
      taxaSection.appendChild(box);
    }

    box.className = `mt-3 border border-emerald-300 rounded-xl p-4 bg-gradient-to-br ${info.cor}`;
    box.innerHTML = `
      <div class="flex items-center gap-3 mb-2">
        <img src="${info.logo}" alt="${metodo}" class="w-10 h-10" onerror="this.src='${info.logoBackup}'">
        <h3 class="text-lg font-semibold text-emerald-700">Pagamento via ${metodo}</h3>
      </div>
      <p class="text-gray-700 text-sm whitespace-pre-line">
        Número: ${info.numero}\nNome: ${info.nome}\n\nDepois de pagar, faz upload do comprovativo para continuar.
      </p>
    `;
  }

  // --- Upload com animação ---
  comprovativoInput.addEventListener('change', () => {
    if (comprovativoInput.files.length > 0 && metodoPagamento) {
      const fileName = comprovativoInput.files[0].name;
      const box = document.getElementById('dadosPagamentoBox');
      const loading = document.createElement('div');
      loading.className = "mt-3 flex flex-col items-center text-emerald-700";
      loading.innerHTML = `<div class="loader mb-2"></div><p>A processar pagamento via ${metodoPagamento}...</p>`;
      box.appendChild(loading);

      setTimeout(() => {
        loading.remove();
        box.innerHTML += `
          <div class="mt-3 p-3 bg-emerald-100 border border-emerald-400 rounded-lg text-center text-emerald-700 font-medium">
            ✅ Pagamento via ${metodoPagamento} confirmado com sucesso!<br>
            Comprovativo enviado: <em>${fileName}</em>
          </div>`;
        Object.values(botoes).forEach(b => { b.disabled = true; b.classList.add('opacity-60'); });
      }, 3000);
    }
  });

  // --- Confirmação final ---
  simulacaoForm.addEventListener('submit', e => {
    e.preventDefault();
    const valor = parseFloat(document.getElementById('valorXitique').value);
    const participantes = parseInt(document.getElementById('participantes').value);
    const taxa = primeiroReceber.checked ? valor * 0.1 : 0;

    confirmacaoSection.classList.remove('hidden');
    simulacaoSection.classList.add('hidden');

    document.getElementById('resumoInscricao').innerHTML = `
      <strong>Nome:</strong> ${dadosUsuario.nome}<br>
      <strong>Província:</strong> ${dadosUsuario.provincia}<br>
      <strong>Telefone:</strong> ${dadosUsuario.telefone}<br>
      <strong>Valor do Xitique:</strong> ${valor} MZN<br>
      <strong>Participantes:</strong> ${participantes}<br>
      <strong>Posição:</strong> ${primeiroReceber.checked ? '1º a receber (taxa paga de ' + taxa.toFixed(2) + ' MZN)' : 'Aguardando sorteio'}<br>
      ${metodoPagamento ? `<strong>Método de pagamento:</strong> ${metodoPagamento}` : ''}
    `;
  });
});
