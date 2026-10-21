const botaoMenu = document.querySelector('.alternador');
const menu = document.getElementById('menu-principal');

function alternarMenu(abrir) {
  botaoMenu.setAttribute('aria-expanded', abrir);
  botaoMenu.classList.toggle('alternador--ativo', abrir);
  menu.classList.toggle('menu--aberto', abrir);
}

botaoMenu.addEventListener('click', () => {
  alternarMenu(botaoMenu.getAttribute('aria-expanded') !== 'true');
});

menu.querySelectorAll('.menu__link').forEach(link =>
  link.addEventListener('click', () => alternarMenu(false))
);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') alternarMenu(false);
});

const formulario = document.getElementById('formulario-contato');
const retorno = document.getElementById('retorno-formulario');

formulario.addEventListener('submit', (e) => {
  e.preventDefault();
  retorno.classList.remove('formulario__status--erro');

  if (!formulario.checkValidity()) {
    retorno.textContent = 'Preencha nome, um e-mail válido e a mensagem para enviar.';
    retorno.classList.add('formulario__status--erro');
    formulario.reportValidity();
    return;
  }

  const nome = formulario.nome.value.trim().split(' ')[0];
  retorno.textContent = 'Obrigado, ' + nome + '! Recebemos sua mensagem e responderemos em breve.';
  formulario.reset();
});
