
// On submit listener for the form that contains the file input
document.getElementById('excelSheetForm').onsubmit = async () => {
    // filePath variable holds the path to the excel file
    const filePath = document.getElementById('fileInput').files[0].path;
    /* We send the file path from this renderer-process to the backend
     * main-process so that it can be processed using the 'uploadFile'
     * channel in preload.js. We await the response, and when we get it
     * we trigger the isLoading() function defined below.
     */ 
    const response = await window.api.uploadFile(file).then(
        isLoading()
    )
}

// Simply displays a loading UI element while our file is being processed.
function isLoading() {
    document.getElementById('loadingContainer').style.display = 'inline';
}

