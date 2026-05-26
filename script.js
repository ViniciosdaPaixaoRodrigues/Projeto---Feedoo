document.addEventListener('DOMContentLoaded', () => {
    // Feedback ao clicar em adicionar ao carrinho
    const addButtons = document.querySelectorAll('.btn-add');
    
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productName = button.parentElement.querySelector('h3').innerText;
            alert(`${productName} foi adicionado ao seu carrinho!`);
        });
    });

    // Efeito de scroll no header
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '0.5rem 5%';
            header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.padding = '1rem 5%';
            header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }
    });

    // Simulação de navegação suave
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
});
