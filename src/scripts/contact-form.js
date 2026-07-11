// scripts/contact-form.js
console.log('contact-form.js cargado');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const contactCompletion = document.getElementById('contact-completion');
  const projectCompletion = document.getElementById('project-completion');
  const charCounter = document.getElementById('char-counter');

  let turnstileToken = null;
  let turnstileWidgetId = null;
  let turnstileContainer = null;
  
  const fileInput = document.getElementById('file-input');
  const dropZone = document.getElementById('drop-zone');
  const fileListContainer = document.getElementById('file-list');
  const selectedFilesDiv = document.getElementById('selected-files');

  const MAX_FILES = 10;
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB en bytes
  let selectedFiles = [];

  const getTurnstileSiteKey = () => {
    const container = document.querySelector('.cf-turnstile');
    if (container && container.getAttribute('data-sitekey')) return container.getAttribute('data-sitekey');
    return "0x4AAAAAABmIObvYsHsPKW2T";
  };

  function cleanupTurnstile() {
    if (window.turnstile && turnstileWidgetId) {
      try { window.turnstile.remove(turnstileWidgetId); } catch (e) {}
    }
    document.querySelectorAll('.cf-turnstile').forEach(c => c.innerHTML = '');
    turnstileWidgetId = null; turnstileToken = null; turnstileContainer = null;
  }

  function clearFormOnLoad() {
    form.reset();
    selectedFiles = [];
    if (fileInput) fileInput.value = '';
    if (fileListContainer) fileListContainer.classList.add('hidden');
    if (selectedFilesDiv) selectedFilesDiv.innerHTML = '';
    document.querySelectorAll('.validation-message').forEach(msg => { msg.textContent = ''; msg.classList.add('hidden'); });
    document.querySelectorAll('input, textarea, select').forEach(f => {
      f.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20');
      f.classList.add('border-gray-300/60', 'focus:border-blue-500', 'focus:ring-blue-500/20');
    });
    if (dropZone) {
      dropZone.classList.remove('border-red-500/60', 'bg-red-50/30', 'dark:bg-red-900/20');
      dropZone.classList.add('border-gray-300/60', 'dark:border-gray-600/60');
    }
    cleanupTurnstile();
    setTimeout(initTurnstile, 500);
  }

  const validators = {
    name: (v) => (!v.trim() ? 'Requerido' : v.length < 5 ? 'Mín. 5 chars' : null),
    email: (v) => (!v.trim() ? 'Requerido' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Inválido' : null),
    project_details: (v) => (!v.trim() ? 'Requerido' : v.length < 150 ? 'Mín. 150 chars' : null),
    files: (files) => {
      if (files.length > MAX_FILES) return `Máx ${MAX_FILES} archivos`;
      for (let f of files) if (f.size > MAX_FILE_SIZE) return `"${f.name}" excede 50MB`;
      return null;
    }
  };

  const requiredFields = [
    { element: form.querySelector('[name="name"]'), validator: 'name', type: 'contact' },
    { element: form.querySelector('[name="email"]'), validator: 'email', type: 'contact' },
    { element: form.querySelector('[name="project_details"]'), validator: 'project_details', type: 'project' }
  ];

  function validateField({ element, validator }) {
    if (!element) return true;
    const error = validators[validator] ? validators[validator](element.value) : null;
    let validationDiv = element.closest('div').querySelector('.validation-message') || element.closest('div').parentElement.querySelector('.validation-message');
    if (validationDiv) { validationDiv.textContent = error || ''; validationDiv.classList.toggle('hidden', !error); }
    element.classList.toggle('border-red-500', !!error);
    return !error;
  }

  function validateFiles() {
    const error = validators.files(selectedFiles);
    const fileSection = document.querySelector('#file-input').closest('div').parentElement;
    let validationDiv = fileSection.querySelector('.validation-message');
    if (validationDiv) { validationDiv.textContent = error || ''; validationDiv.classList.toggle('hidden', !error); }
    return !error;
  }

  function updateStatus() {
    if (contactCompletion) contactCompletion.classList.toggle('hidden', !requiredFields.filter(f => f.type === 'contact').every(validateField));
    if (projectCompletion) projectCompletion.classList.toggle('hidden', !requiredFields.filter(f => f.type === 'project').every(validateField));
    
    if (charCounter) {
      const ta = form.querySelector('[name="project_details"]');
      if (ta) charCounter.textContent = `${ta.value.length}/1000`;
    }

    const allValid = requiredFields.every(validateField) && validateFiles() && turnstileToken;
    if (submitBtn) submitBtn.disabled = !allValid;
    if (submitText) submitText.textContent = !turnstileToken ? 'Verificación pendiente' : (!allValid ? 'Faltan datos' : 'Enviar consulta');
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function renderFileList() {
    if (!selectedFilesDiv) return;
    selectedFilesDiv.innerHTML = '';
    if (selectedFiles.length > 0) {
      fileListContainer.classList.remove('hidden');
      selectedFiles.forEach((file, idx) => {
        const row = document.createElement('div');
        row.className = 'flex justify-between items-center text-sm p-2 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200';
        row.innerHTML = `<span>${file.name} (${formatFileSize(file.size)})</span><button type="button" class="text-red-500 hover:text-red-700 ml-2" onclick="removeFile(${idx})">X</button>`;
        selectedFilesDiv.appendChild(row);
      });
    } else {
      fileListContainer.classList.add('hidden');
    }
    validateFiles(); updateStatus();
  }

  window.removeFile = (idx) => { selectedFiles.splice(idx, 1); renderFileList(); };

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      Array.from(e.target.files).forEach(file => {
        if (file.size <= MAX_FILE_SIZE && !selectedFiles.some(f => f.name === file.name)) selectedFiles.push(file);
      });
      e.target.value = '';
      renderFileList();
    });
  }

  requiredFields.forEach(f => {
    if (f.element) { f.element.addEventListener('input', updateStatus); f.element.addEventListener('blur', updateStatus); }
  });

  const initTurnstile = () => {
    if (!window.turnstile) return setTimeout(initTurnstile, 300);
    turnstileContainer = document.querySelector('.cf-turnstile');
    if (!turnstileContainer) return;
    try {
      turnstileWidgetId = window.turnstile.render(turnstileContainer, {
        sitekey: getTurnstileSiteKey(),
        callback: (token) => { turnstileToken = token; updateStatus(); },
        'error-callback': () => { turnstileToken = null; updateStatus(); }
      });
    } catch (e) {}
  };

  clearFormOnLoad(); initTurnstile();

  // ENVÍO DIRECTO A LA API INTERNA DE ASTRO (VERCEL)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!turnstileToken || !requiredFields.every(validateField) || !validateFiles()) return;

    submitBtn.disabled = true;
    submitText.textContent = 'Enviando...';

    try {
      const formData = new FormData(form);
      formData.append('turnstile-token', turnstileToken);
      
      formData.delete('technical_docs');
      selectedFiles.forEach(file => formData.append('technical_docs', file));

      console.log('📤 Enviando formulario a /api/contact...'); // <-- Log para confirmar

      // Llama a la ruta API interna de Astro
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert('✅ ¡Gracias! Hemos recibido sus requerimientos. Nuestro equipo le contactará en breve.');
        clearFormOnLoad();
      } else { 
        alert(`❌ Error: ${result.errors ? result.errors[0] : 'Error desconocido'}`);
      }
    } catch (error) {
      console.error(error);
      alert('🔌 Error de conexión. Intenta nuevamente.');
    } finally {
      submitText.textContent = 'Enviar consulta';
      cleanupTurnstile();
      setTimeout(initTurnstile, 500);
    }
  });
});