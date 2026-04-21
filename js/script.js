// Konfiguration: Pfad zu deiner PDF-Datei im Projektordner
const PDF_URL = 'img/aboveandbelow.pdf'; 

// PDF.js Worker initialisieren
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

const container = document.getElementById('flipbook-container');

async function loadFlipbook() {
    try {
        // PDF direkt vom Server/Pfad laden
        const loadingTask = pdfjsLib.getDocument(PDF_URL);
        const pdf = await loadingTask.promise;
        
        container.innerHTML = ''; 
        
        // Jede Seite der PDF rendern
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            
            const pageDiv = document.createElement('div');
            pageDiv.className = 'page';
            
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            
            pageDiv.appendChild(canvas);
            container.appendChild(pageDiv);
        }

        initFlipbook();
        container.style.visibility = 'visible';
        
    } catch (error) {
        console.error(error);
    }
}

function initFlipbook() {
    const pageFlip = new St.PageFlip(container, {
        width: 550,
        height: 733,
        size: "stretch",
        minWidth: 315,
        maxWidth: 1000,
        minHeight: 420,
        maxHeight: 1350,
        maxShadowOpacity: 0.5,
        showCover: false,
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));
}

// Start beim Laden der Seite
loadFlipbook();