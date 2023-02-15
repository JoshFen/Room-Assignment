const currentPage = window.location.pathname.split('/').slice(-1);

const minimizeButton = document.getElementById('minimizeIcon');
if (minimizeButton) {
    minimizeButton.addEventListener('click', () => {
        window.api.minimize();
    });
}

const closeButton = document.getElementById('closeIcon');
if (closeButton) {
    closeButton.addEventListener('click', () => {
        window.api.close();
    });
}


function changePage(e, url) {
    e.preventDefault();
    window.location.href = url;
}

function disableButton(button) {
    button.disabled = true;
    button.classList.add('disabled');
}

function enableButton(button) {
    button.disabled = false;
    button.classList.remove('disabled');
}

if (currentPage == 'index.html') {

    window.api.changePageToPreprocess();

    const fileInput = document.getElementById('fileInput');
    const dragAndDropInput = document.getElementById("dragAndDrop");
    let dropArea = document.getElementById('dragAndDrop');
    const chosenFileText = document.getElementById('chosenFileText');
    const menuButton = document.getElementById('menuIcon');
    const INVALID_FILE_STRING = 'File must be an Excel sheet (.xls)';

    // On submit listener for the form that contains the file input
    document.getElementById('excelSheetForm').onsubmit = (e) => {
        // filePath variable holds the path to the excel file
        filePath = fileInput.files[0].path;
        /* We send the file path from this renderer-process to the backend
        * main-process so that it can be processed using the 'uploadFile'
        * channel in preload.js. We await the response, and when we get it
        * we trigger the isLoading() function defined below.
        */ 
        window.api.uploadFile(filePath);
        window.api.changePageToPreprocess();
        //changePage(e, 'views/preprocess.html');
    }

    // Simply displays a loading UI element while our file is being processed.
    function isLoading() {
        document.getElementById('loadingContainer').style.display = 'inline';
    }


    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    })

    function preventDefaults (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ;['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false)
    })

    ;['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false)
    })

    function highlight(e) {
        dropArea.classList.add('highlight')
    }

    function unhighlight(e) {
        dropArea.classList.remove('highlight')
    }

    fileInput.addEventListener('change', () => {
        changeFileText(true, fileInput.files[0].path);
    })

    dragAndDropInput.addEventListener('drop', (e) => {

        let dt = e.dataTransfer;
        let file = dt.files[0];
        if (file.type === 'application/vnd.ms-excel') {
            fileInput.files = dt.files;
            changeFileText(true, dt.files[0].path);
            
        }
        else {
            fileInput.files = null;
            changeFileText(false, INVALID_FILE_STRING);
        }
    })

    dragAndDropInput.addEventListener('click', (e) => {
        fileInput.click();
    })

    function changeFileText(validFile, text) {
        chosenFileText.innerText = text;
        if (validFile == true) {
            chosenFileText.style.color = 'var(--success)';
            enableButton(document.getElementById('beginButton'));
        }
        else {
            chosenFileText.style.color = 'var(--danger)';
            disableButton(document.getElementById('beginButton'));
        }
    }
}


if (currentPage == 'preprocess.html') {

    window.api.changePageToPostprocess();
    window.api.LLCInfoError();

    const inputs = document.querySelectorAll('.LLCNameInput').forEach( element => {
        element.addEventListener('keyup', () => {
            if (element.value !== '') {
                enableButton(document.getElementById('continueButton'));
            } 
            else {
                disableButton(document.getElementById('continueButton'));
            }
        })
    });

    const LLCForm = document.getElementById('LLCForm');
    LLCForm.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(LLCForm).entries();
        let data = {};
        let counter = 0;
        do {
            const LLCName = formData.next().value[1];
            const LLCFloor = formData.next().value[1];
            if (LLCName !== "") {
                data[LLCName] = LLCFloor;
            }
            counter++;
        }
        while (counter < 3);

        window.api.sendLLCInfo(data);
    }
}

if (currentPage == 'postprocess.html') {

    const downloadButton = document.getElementById('downloadFileButton');
    downloadButton.addEventListener('click', async () => {
        const response =  await window.api.downloadFile();
    })
}

if (currentPage == 'confirmation-popup.html') {

    const runButton = document.getElementById('popupRunButton');
    runButton.addEventListener('click', () => {
        window.api.runAssignment();
    })

    const cancelButton = document.getElementById('popupCancelButton');
    cancelButton.addEventListener('click', () => {
        window.api.cancelRun();
    })
}

if (currentPage == 'download-error-popup.html') {

    const okayButton = document.getElementById('popupOkayButton');
    okayButton.addEventListener('click', () => {
        window.api.closeErrorPopup();
    })
}
