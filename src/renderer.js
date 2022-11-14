const currentPage = window.location.pathname.split('/').slice(-1);

function changePage(e, url) {
    e.preventDefault();
    window.location.href = url;
}

if (currentPage == 'index.html') {  
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
        //const response = await window.api.uploadFile(filePath);
        changePage(e, 'views/preprocess.html');
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
        }
        else {
            chosenFileText.style.color = 'var(--danger)';
        }
    }
}


if (currentPage == 'preprocess.html') {
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

        window.api.sendLLCInfo(e);
        changePage(e, 'postprocess.html');
    }
}

if (currentPage == 'postprocess.html') {

    const downloadButton = document.getElementById('downloadFileButton');
    downloadButton.addEventListener('click', async () => {
        const response =  await window.api.downloadFile();
    })
}
