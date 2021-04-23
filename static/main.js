(function init() {
  const VALID_FILETYPES = [
    'image/png',
    'image/jpeg'
  ];

  const input = document.getElementById('file-upload');
  input.addEventListener('change', updateImageDisplay, false);
  input.addEventListener('submit', createLoadingButton, false);

  const inputArea = input.getElementsByClassName('upload-area')[0];
  const uploadLabel = input.getElementsByClassName('upload-area-label')[0].cloneNode(true);
  const submitButton = input.getElementsByTagName('button')[0];
  submitButton.style.visibility = 'hidden';

  let submission;
  let preview;

  function updateImageDisplay(event) {
    const isFileUploaded = Boolean(event.target.files.length > 0);
    const isFileSupported = Boolean(Array.from(event.target.files).every((file) => VALID_FILETYPES.includes(file.type)));
    const hasPriorSubmission = Boolean(submission && submission.length > 0);

    while (input.getElementsByClassName('upload-area-label')[0]) {
      input.getElementsByClassName('upload-area-label')[0].parentNode.removeChild(input.getElementsByClassName('upload-area-label')[0]);
    }

    if (isFileUploaded) {
      if (isFileSupported) {
        submission = event.target.files;
        preview = makePreview(submission[0]);
        submitButton.style.visibility = '';
        return;
      } else if (hasPriorSubmission) {
        event.target.files = submission;
        preview = makePreview(submission[0]);
      } else {
        resetPreview();
        submitButton.style.visibility = 'hidden';
      }
      alert('Please upload a .png, .jpg, or .jpeg file.');
    } else if (hasPriorSubmission && preview) {
      event.target.files = submission;
      inputArea.appendChild(preview);
    } else {
      resetPreview();
    }
  }

  function makePreview(file) {
    if (file) {
      const preview = createElementWithClassName('div', 'upload-area-label flow flex flow-column');
      const fileName = createTextNodeWithContent('span', file.name);
      const img = createElementWithOptions('img', {
        attributes: {
          src: URL.createObjectURL(file)
        }
      });

      preview.append(img, fileName);
      return inputArea.appendChild(preview);
    }

    resetPreview();
  }

  function resetPreview() {
    preview = null;
    return inputArea.appendChild(uploadLabel);
  }

  function createLoadingButton() {
    submitButton.textContent = 'Please wait\u2026';
    submitButton.disabled = true;
  }
})();

function setAttributes(el, attributes) {
  for (let i = 0; i < Object.keys(attributes).length; i++) {
    if (Object.values(attributes)[i] !== null && Object.values(attributes)[i] !== undefined) {
      el.setAttribute(Object.keys(attributes)[i], Object.values(attributes)[i]);
    }
  }
}

function createElementWithClassName(nodeType, className) {
  const el = document.createElement(nodeType);
  el.className = className;
  return el;
}

function createElementWithOptions(nodeType, options) {
  const el = document.createElement(nodeType);

  for (let i = 0; i < Object.keys(options).length; i++) {
    switch (Object.keys(options)[i]) {
      case 'class':
        el.className = options.class;
        break;
      case 'attributes':
        setAttributes(el, options.attributes);
        break;
      case 'style':
        for (let k = 0; k < Object.keys(options.style).length; k++) {
          el.style[Object.keys(options.style)[k]] = Object.values(options.style)[k];
        }
        break;
      case 'content':
        el.appendChild(document.createTextNode(options.content));
        break;
      default:
        if (Object.values(options)[i] !== null && Object.values(options)[i] !== undefined) {
          el[Object.keys(options)[i]] = Object.values(options)[i];
        }
    }
  }

  return el;
}

function createTextNodeWithContent(nodeType, content) {
  const el = document.createElement(nodeType);
  el.appendChild(document.createTextNode(content));
  return el;
}
