
const form = document.getElementById('dateForm');
const result = document.getElementById('result');
const summary = document.getElementById('summary');
const copyButton = document.getElementById('copyButton');

// Evitar seleccionar fechas pasadas
const dateInput = document.getElementById('date');
const today = new Date();
const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
).toISOString().split('T')[0];

dateInput.min = localDate;

let proposalText = '';

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const plan = document.getElementById('plan').value;
    const location = document.getElementById('location').value.trim();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const budget = document.getElementById('budget').value;
    const notes = document.getElementById('notes').value.trim();
    const flexible = document.getElementById('flexible').checked;

    const formattedDate = new Date(date + 'T12:00:00')
        .toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

    const details = [
        ['Nombre', name],
        ['Contacto', email || 'No indicado'],
        ['Plan', plan],
        ['Zona', location],
        ['Fecha', flexible ? 'Flexible' : formattedDate],
        ['Hora', flexible ? 'Flexible' : time],
        ['Presupuesto', budget],
        ['Comentarios', notes || 'Ninguno']
    ];

    proposalText = [
        'MI PROPUESTA PARA QUEDAR',
        '',
        ...details.map(([label, value]) => `${label}: ${value}`),
        '',
        '¡Ahora solo queda organizarlo!'
    ].join('\n');

    summary.innerHTML = details.map(([label, value]) => `
        <div>
            <strong>${label}:</strong>
            ${escapeHTML(value)}
        </div>
    `).join('');

    result.classList.remove('hidden');
    copyButton.textContent = 'Copiar propuesta';

    result.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
});

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[char]);
}

copyButton.addEventListener('click', async function() {
    try {
        await navigator.clipboard.writeText(proposalText);
        copyButton.textContent = '¡Copiado correctamente!';
    } catch (error) {
        const textArea = document.createElement('textarea');
        textArea.value = proposalText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();

        copyButton.textContent = '¡Copiado correctamente!';
    }
});
