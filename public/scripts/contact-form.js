// scripts/contact-form.js
console.log('contact-form.js cargado v3 (Serverless Local)');

document.addEventListener('DOMContentLoaded', () => {
  console.log('Inicializando form listener');
  const form = document.getElementById('contact-form');
  if (!form) return;

  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const contactCompletion = document.getElementById('contact-completion');
  const projectCompletion = document.getElementById('project-completion');
  const charCounter = document.getElementById('char-counter');

  // Variables para Turnstile
  let turnstileToken = null;
  let turnstileWidgetId = null;
  let turnstileContainer = null;
  
  const fileInput = document.getElementById('file-input');
  const dropZone = document.getElementById('drop-zone');
  const fileListContainer = document.getElementById('file-list');
  const selectedFilesDiv = document.getElementById('selected-files');

  // Constantes para validación de archivos
  const MAX_FILES = 10;
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB en bytes
  let selectedFiles = [];

  // ⭐ OBTENER SITE KEY DE TURNSTILE
  const getTurnstileSiteKey = () => {
    console.log('🔑 [getTurnstileSiteKey] Detectando site key...');
    const container = document.querySelector('.cf-turnstile');
    if (container && container.getAttribute('data-sitekey')) {
      return container.getAttribute('data-sitekey');
    }
    if (typeof import.meta.env !== 'undefined' && import.meta.env.PUBLIC_TURNSTILE_SITE_KEY) {
      return import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;
    }
    return "0x4AAAAAABmIObvYsHsPKW2T";
  };

  // Función para limpiar completamente Turnstile
  function cleanupTurnstile() {
    console.log('🧹 Limpiando Turnstile...');
    if (window.turnstile && turnstileWidgetId) {
      try {
        window.turnstile.remove(turnstileWidgetId);
      } catch (error) {
        console.warn('⚠️ Error al remover widget:', error);
      }
    }
    document.querySelectorAll('.cf-turnstile').forEach(container => container.innerHTML = '');
    document.querySelectorAll('[id^="cf-chl-widget-"]').forEach(el => el.remove());
    turnstileWidgetId = null;
    turnstileToken = null;
    turnstileContainer = null;
  }

  // LIMPIAR FORMULARIO AL CARGAR LA PÁGINA
  function clearFormOnLoad() {
    form.reset();
    selectedFiles = [];
    if (fileInput) fileInput.value = '';
    if (fileListContainer) fileListContainer.classList.add('hidden');
    if (selectedFilesDiv) selectedFilesDiv.innerHTML = '';
    
    document.querySelectorAll('.validation-message').forEach(msg => {
      msg.textContent = '';
      msg.classList.add('hidden');
    });
    
    document.querySelectorAll('input, textarea, select').forEach(field => {
      field.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20');
      field.classList.add('border-gray-300/60', 'focus:border-blue-500', 'focus:ring-blue-500/20');
    });
    
    if (dropZone) {
      dropZone.classList.remove('border-red-500/60', 'bg-red-50/30', 'dark:bg-red-900/20');
      dropZone.classList.add('border-gray-300/60', 'dark:border-gray-600/60');
    }

    cleanupTurnstile();
    setTimeout(initTurnstile, 500);
  }

  // Validaciones
  const validators = {
    name: (value) => {
      if (!value.trim()) return 'El nombre es requerido';
      if (value.trim().length < 5) return 'El nombre debe tener al menos 5 caracteres';
      if (value.trim().length > 50) return 'El nombre no puede exceder 50 caracteres';
      return null;
    },
    email: (value) => {
      if (!value.trim()) return 'El email es requerido';
      if (value.trim().length > 50) return 'El email no puede exceder 50 caracteres';
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(value.trim())) return 'Formato de email inválido';
      return null;
    },
    company: (value) => {
      if (value && value.trim().length > 100) return 'El nombre de la empresa no puede exceder 100 caracteres';
      return null;
    },
    phone: (value) => {
      if (value && value.trim()) {
        const phoneRegex = /^[\d\s\-\(\)\+]*$/;
        if (!phoneRegex.test(value.trim())) return 'Formato inválido';
        if (value.trim().length > 20) return 'Máximo 20 caracteres';
        if (!/\d/.test(value.trim())) return 'Debe contener un número';
      }
      return null;
    },
    project_details: (value) => {
      if (!value.trim()) return 'Requerido';
      if (value.trim().length < 150) return 'Mínimo 150 caracteres';
      return null;
    },
    files: (files) => {
      if (files.length > MAX_FILES) return `Máximo ${MAX_FILES} archivos permitidos`;
      for (let file of files) {
        if (file.size > MAX_FILE_SIZE) return `El archivo "${file.name}" excede 50MB`;
      }
      return null;
    }
  };

  const requiredFields = [
    { element: form.querySelector('[name="name"]'), validator: 'name', type: 'contact' },
    { element: form.querySelector('[name="email"]'), validator: 'email', type: 'contact' },
    { element: form.querySelector('[name="project_details"]'), validator: 'project_details', type: 'project' }
  ];

  const optionalFields = [
    { element: form.querySelector('[name="company"]'), validator: 'company', type: 'contact' },
    { element: form.querySelector('[name="phone"]'), validator: 'phone', type: 'contact' }
  ];

  function showValidationMessage(field, message) {
    let validationDiv = field.closest('div').querySelector('.validation-message');
    if (!validationDiv) validationDiv = field.closest('div').parentElement.querySelector('.validation-message');
    if (validationDiv) {
      validationDiv.textContent = message || '';
      validationDiv.classList.toggle('hidden', !message);
    }
  }

  function showFileValidationMessage(message) {
    const fileSection = document.querySelector('#file-input').closest('div').parentElement;
    let validationDiv = fileSection.querySelector('.validation-message');
    if (!validationDiv) {
      validationDiv = document.createElement('div');
      validationDiv.className = 'validation-message hidden text-xs text-red-400 mt-1';
      fileSection.appendChild(validationDiv);
    }
    validationDiv.textContent = message || '';
    validationDiv.classList.toggle('hidden', !message);
  }

  function validateField(fieldData) {
    const { element, validator } = fieldData;
    if (!element) return true;
    const error = validators[validator] ? validators[validator](element.value) : null;
    showValidationMessage(element, error);
    if (error) {
      element.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20');
      element.classList.remove('border-gray-300/60', 'focus:border-blue-500', 'focus:ring-blue-500/20');
    } else {
      element.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20');
      element.classList.add('border-gray-300/60', 'focus:border-blue-500', 'focus:ring-blue-500/20');
    }
    return !error;
  }

  function validateFiles() {
    const error = validators.files(selectedFiles);
    showFileValidationMessage(error);
    if (dropZone) {
      if (error) {
        dropZone.classList.add('border-red-500/60', 'bg-red-50/30', 'dark:bg-red-900/20');
        dropZone.classList.remove('border-gray-300/60', 'dark:border-gray-600/60');
      } else {
        dropZone.classList.remove('border-red-500/60', 'bg-red-50/30', 'dark:bg-red-900/20');
        dropZone.classList.add('border-gray-300/60', 'dark:border-gray-600/60');
      }
    }
    return !error;
  }

  function isSectionComplete(sectionType) {
    return requiredFields.filter(field => field.type === sectionType).every(validateField);
  }

  function updateSectionCompletions() {
    if (contactCompletion) contactCompletion.classList.toggle('hidden', !isSectionComplete('contact'));
    if (projectCompletion) projectCompletion.classList.toggle('hidden', !isSectionComplete('project'));
  }

  function updateCharCounter() {
    const textarea = form.querySelector('[name="project_details"]');
    if (textarea && charCounter) {
      const len = textarea.value.length;
      charCounter.textContent = `${len}/1000`;
      charCounter.classList.toggle('text-red-500', len < 150);
      charCounter.classList.toggle('text-green-500', len >= 150);
    }
  }

  function updateSubmitButton() {
    const allValid = requiredFields.every(validateField) && validateFiles() && turnstileToken;
    if (submitBtn) {
      submitBtn.disabled = !allValid;
      if (submitText) {
        if (!turnstileToken) submitText.textContent = 'Completa la verificación de seguridad';
        else if (!requiredFields.every(validateField) || !validateFiles()) submitText.textContent = 'Completa los campos requeridos';
        else submitText.textContent = 'Enviar consulta';
      }
    }
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
      if (fileListContainer) fileListContainer.classList.remove('hidden');
      selectedFiles.forEach((file, idx) => {
        const fileRow = document.createElement('div');
        fileRow.className = 'flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 px-3 py-2 rounded border border-gray-200 dark:border-gray-700/50';
        fileRow.innerHTML = `
          <div class="flex-1 min-w-0">
            <span class="text-sm font-medium text-gray-900 dark:text-gray-200 truncate block">${file.name}</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">${formatFileSize(file.size)}</span>
          </div>
          <button type="button" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm ml-2 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" onclick="removeFileAtIndex(${idx})">Eliminar</button>
        `;
        selectedFilesDiv.appendChild(fileRow);
      });
    } else {
      if (fileListContainer) fileListContainer.classList.add('hidden');
    }
    validateFiles(); updateSubmitButton();
  }

  window.removeFileAtIndex = (indexToRemove) => {
    selectedFiles.splice(indexToRemove, 1);
    renderFileList();
  }

  function processNewFiles(newFiles) {
    let errorMessages = [];
    const filesToAdd = [];
    for (let file of newFiles) {
      if (file.size > MAX_FILE_SIZE) { errorMessages.push(`"${file.name}" excede 50MB`); continue; }
      if (selectedFiles.some(existing => existing.name === file.name && existing.size === file.size)) { errorMessages.push(`"${file.name}" ya está seleccionado`); continue; }
      filesToAdd.push(file);
    }
    if (selectedFiles.length + filesToAdd.length > MAX_FILES) {
      errorMessages.push(`Solo puedes agregar ${MAX_FILES - selectedFiles.length} archivos más`);
    }
    if (errorMessages.length > 0) {
      showFileValidationMessage(errorMessages[0]);
      return;
    }
    if (filesToAdd.length > 0) {
      selectedFiles.push(...filesToAdd);
      renderFileList();
    }
  }

  if (dropZone) {
    ['dragover', 'dragenter'].forEach(eventName => dropZone.addEventListener(eventName, (e) => { e.preventDefault(); dropZone.classList.add('border-blue-500/80', 'bg-blue-50/30', 'dark:bg-blue-900/20'); }));
    ['dragleave', 'dragend'].forEach(eventName => dropZone.addEventListener(eventName, (e) => { e.preventDefault(); dropZone.classList.remove('border-blue-500/80', 'bg-blue-50/30', 'dark:bg-blue-900/20'); }));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('border-blue-500/80', 'bg-blue-50/30', 'dark:bg-blue-900/20');
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) processNewFiles(droppedFiles);
    });
  }

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const newFiles = Array.from(e.target.files || []);
      if (newFiles.length > 0) processNewFiles(newFiles);
      e.target.value = '';
    });
  }

  ['project-help', 'files-help'].forEach(id => {
    const btn = document.getElementById(`${id}-btn`);
    const tooltip = document.getElementById(id);
    if (btn && tooltip) btn.addEventListener('click', () => tooltip.classList.toggle('hidden'));
  });

  requiredFields.forEach(fieldData => {
    if (fieldData.element) {
      fieldData.element.addEventListener('input', () => {
        if (fieldData.validator === 'email' && fieldData.element.value.includes('@')) { validateField(fieldData); updateSectionCompletions(); updateSubmitButton(); }
        else if (fieldData.validator !== 'email' && (fieldData.element.value.trim() || fieldData.element.classList.contains('border-red-500'))) { validateField(fieldData); updateSectionCompletions(); updateSubmitButton(); }
        if (fieldData.validator === 'project_details') updateCharCounter();
      });
      fieldData.element.addEventListener('blur', () => { validateField(fieldData); updateSectionCompletions(); updateSubmitButton(); if (fieldData.validator === 'project_details') updateCharCounter(); });
      if (fieldData.validator === 'project_details') fieldData.element.addEventListener('keyup', updateCharCounter);
    }
  });

  optionalFields.forEach(fieldData => {
    if (fieldData.element) {
      fieldData.element.addEventListener('input', () => {
        if (fieldData.element.value.trim()) validateField(fieldData);
        else {
          showValidationMessage(fieldData.element, null);
          fieldData.element.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20');
          fieldData.element.classList.add('border-gray-300/60', 'focus:border-blue-500', 'focus:ring-blue-500/20');
        }
      });
      fieldData.element.addEventListener('blur', () => { if (fieldData.element.value.trim()) validateField(fieldData); });
    }
  });

  const phoneInput = form.querySelector('[name="phone"]');
  const countrySelect = form.querySelector('[name="country_code"]');

  function applyPhoneErrorStyles(hasError) {
    [phoneInput, countrySelect].forEach(el => {
      if (el) {
        if (hasError) { el.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20'); el.classList.remove('border-gray-300/60', 'focus:border-blue-500', 'focus:ring-blue-500/20'); } 
        else { el.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500/20'); el.classList.add('border-gray-300/60', 'focus:border-blue-500', 'focus:ring-blue-500/20'); }
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      if (phoneInput.value.trim()) { const isValid = validateField({ element: phoneInput, validator: 'phone', type: 'contact' }); applyPhoneErrorStyles(!isValid); } 
      else { showValidationMessage(phoneInput, null); applyPhoneErrorStyles(false); }
    });
    phoneInput.addEventListener('blur', () => {
      if (phoneInput.value.trim()) { const isValid = validateField({ element: phoneInput, validator: 'phone', type: 'contact' }); applyPhoneErrorStyles(!isValid); }
    });
  }

  const initTurnstile = () => {
    console.log('🚀 Inicializando Turnstile...');
    if (!window.turnstile) return setTimeout(initTurnstile, 300);
    turnstileContainer = document.querySelector('.cf-turnstile');
    if (!turnstileContainer) return;
    cleanupTurnstile();
    turnstileContainer = document.querySelector('.cf-turnstile');
    try {
      turnstileWidgetId = window.turnstile.render(turnstileContainer, {
        sitekey: getTurnstileSiteKey(),
        theme: 'auto',
        size: 'normal',
        callback: (token) => { turnstileToken = token; updateSubmitButton(); },
        'error-callback': () => { turnstileToken = null; updateSubmitButton(); setTimeout(() => { cleanupTurnstile(); setTimeout(initTurnstile, 1500); }, 1000); },
        'expired-callback': () => { turnstileToken = null; updateSubmitButton(); setTimeout(() => { cleanupTurnstile(); setTimeout(initTurnstile, 1500); }, 1000); }
      });
    } catch (error) { setTimeout(() => { cleanupTurnstile(); initTurnstile(); }, 2000); }
  };

  clearFormOnLoad();
  updateSectionCompletions();
  updateSubmitButton();
  updateCharCounter();
  renderFileList();
  initTurnstile();

  // ⭐ ENVÍO DEL FORMULARIO - API INTERNA SERVERLESS
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    if (!turnstileToken) { alert('⚠️ Por favor, completa la verificación de seguridad'); return; }
    if (!(requiredFields.every(validateField) && validateFiles())) { alert('⚠️ Por favor, corrige los errores antes de enviar'); return; }

    if (submitBtn) submitBtn.disabled = true;
    const originalText = submitText ? submitText.textContent : 'Enviar consulta';
    if (submitText) submitText.textContent = 'Enviando...';

    try {
      const formData = new FormData(form);
      formData.append('turnstile-token', turnstileToken);
      if (fileInput) fileInput.value = '';
      selectedFiles.forEach(file => formData.append('technical_docs', file));

      // 🔴 AQUÍ ESTÁ LA MAGIA: RUTA RELATIVA AL MISMO VERCEL
      const endpoint = '/api/contact';
      console.log('📤 Enviando formulario a Astro Serverless:', endpoint);

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        const firstName = form.querySelector('[name="name"]').value.trim().split(' ')[0];
        alert(`✅ ¡Gracias, ${firstName}! Hemos recibido sus requerimientos. 📋 Nuestro equipo le contactará en menos de 48 horas.`);
        clearFormOnLoad();
        updateSectionCompletions();
        updateSubmitButton();
        updateCharCounter();
        renderFileList();
        cleanupTurnstile();       
      } else { 
        const errorMsg = Array.isArray(result.errors) ? result.errors.join('\n') : result.error || result.message || 'Error desconocido';
        alert(`❌ Error: ${errorMsg}`);
        cleanupTurnstile(); 
        setTimeout(initTurnstile, 500);
      }
    } catch (error) {
      console.error('❌ Error al enviar formulario:', error);
      alert('🔌 Error de conexión. Intenta nuevamente.');
      cleanupTurnstile();
      setTimeout(initTurnstile, 500);
    } finally {
      if (submitText) submitText.textContent = originalText;
      updateSubmitButton();
    }
  });

  window.addEventListener('beforeunload', () => clearFormOnLoad());
});