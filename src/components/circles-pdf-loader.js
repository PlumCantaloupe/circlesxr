//code form Mozilla Hubs implementation: https://github.com/mozilla/hubs

//import pdfjs from "pdfjs-dist";
//import errorImageSrc from "../assets/images/media-error.png";

//const pdfjsLib = window['pdfjs-dist/build/pdf.js'];
//pdfjs.GlobalWorkerOptions.workerSrc = '!!file-loader?outputPath=assets/js&name=[name]-[hash].js!pdfjs-dist/build/pdf.worker.js';

// const pdfjs = import('pdfjs-dist/build/pdf');
// const pdfjsWorker = import('pdfjs-dist/build/pdf.worker.entry');

// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function scaleToAspectRatio(el, ratio) {
    const width = Math.min(1.0, 1.0 / ratio);
    const height = Math.min(1.0, ratio);
    el.object3DMap.mesh.scale.set(width, height, 1);
    el.object3DMap.mesh.matrixNeedsUpdate = true;
}

AFRAME.registerComponent("circles-pdf-loader", {
    schema: {
        src: { type: "string" },
        projection: { type: "string", default: "flat" },
        contentType: { type: "string" },
        index: { default: 0 },
        batch: { default: false },
    },
    multiple: false,
    init: function() {
        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        this.pdfjs = window['pdfjs-dist/build/pdf'];

        // The workerSrc property shall be specified.
        this.pdfjs.GlobalWorkerOptions.workerSrc = '/global/js/libs/pdf.worker.min.js';

        this.canvas = document.createElement("canvas");
        this.canvasContext = this.canvas.getContext("2d");

        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.encoding = THREE.sRGBEncoding;
        this.texture.minFilter = THREE.LinearFilter;
        this.createControls();
    },
    createControls: function() {
        const CONTEXT_AF = this;
        const CONTROL_BUTTON_SIZE = 0.25;

        CONTEXT_AF.controlsWrapper = document.createElement('a-entity');
        CONTEXT_AF.controlsWrapper.setAttribute('id', 'pdf_controls_wrapper');
        CONTEXT_AF.controlsWrapper.setAttribute('position', {x:0, y:-0.7, z:0});
        CONTEXT_AF.el.appendChild(CONTEXT_AF.controlsWrapper);

        CONTEXT_AF.nextBtn = document.createElement('a-entity');
        CONTEXT_AF.nextBtn.setAttribute('id', 'pdfNextBtn');
        CONTEXT_AF.nextBtn.setAttribute('class', 'button');
        CONTEXT_AF.nextBtn.setAttribute('position', {x:0.2, y:0, z:0});
        CONTEXT_AF.nextBtn.setAttribute('rotation', {x:0, y:0, z:90});
        CONTEXT_AF.nextBtn.setAttribute('geometry', {primitive:'plane', width:CONTROL_BUTTON_SIZE, height:CONTROL_BUTTON_SIZE});
        CONTEXT_AF.nextBtn.setAttribute('material', {src:CIRCLES.CONSTANTS.ICON_RELEASE, color:'rgb(255,255,255)', shader:'flat', transparent:true,side:'double'});
        CONTEXT_AF.nextBtn.setAttribute('circles-interactive-object', {type:'scale'});
        CONTEXT_AF.controlsWrapper.appendChild(CONTEXT_AF.nextBtn);
        CONTEXT_AF.nextBtn.addEventListener('click', function (evt){
            if (CONTEXT_AF.pageNum >= CONTEXT_AF.pdf.numPages) {
                return;
            }
            CONTEXT_AF.changePage(CONTEXT_AF.pageNum + 1);
        });

        CONTEXT_AF.prevBtn = document.createElement('a-entity');
        CONTEXT_AF.prevBtn.setAttribute('id', 'pdfPrevBtn');
        CONTEXT_AF.prevBtn.setAttribute('class', 'button');
        CONTEXT_AF.prevBtn.setAttribute('position', {x:-0.2, y:0, z:0});
        CONTEXT_AF.prevBtn.setAttribute('rotation', {x:0, y:0, z:-90});
        CONTEXT_AF.prevBtn.setAttribute('geometry', {primitive:'plane', width:CONTROL_BUTTON_SIZE, height:CONTROL_BUTTON_SIZE});
        CONTEXT_AF.prevBtn.setAttribute('material', {src:CIRCLES.CONSTANTS.ICON_RELEASE, color:'rgb(255,255,255)', shader:'flat', transparent:true,side:'double'});
        CONTEXT_AF.prevBtn.setAttribute('circles-interactive-object', {type:'scale'});
        CONTEXT_AF.controlsWrapper.appendChild(CONTEXT_AF.prevBtn);
        CONTEXT_AF.prevBtn.addEventListener('click', function (evt){
            if (CONTEXT_AF.pageNum <= 1) {
                return;
            }
            CONTEXT_AF.changePage(CONTEXT_AF.pageNum - 1);
        });
    },
    async update(oldData) {
        const CONTEXT_AF = this;
        const CONTROL_BUTTON_SIZE = 0.25;
        const data = this.data;
        let ratio = 1;

        if ( (oldData.src !== data.src) && (data.src !== '') ) {
        {
            // Using DocumentInitParameters object to load binary data.
            const loadingTask = CONTEXT_AF.pdfjs.getDocument(data.src);
            loadingTask.promise.then(function(pdf) {
                /* following simpler example from here: https://jsfiddle.net/pdfjs/cq0asLqz/ */
                
                CONTEXT_AF.pdf = pdf;
                CONTEXT_AF.el.setAttribute("media-pager", { maxIndex: CONTEXT_AF.pdf.numPages - 1 });
                var pageNumber = 1;
                CONTEXT_AF.changePage(pageNumber);
                
            }, function (reason) {
                // PDF loading error
                console.error("Error loading PDF", reason);
            });
        }
    }},
    async changePage(pageNum) {
        const CONTEXT_AF = this;

        if (!CONTEXT_AF.pdf) {
            console.warn('No PDF loaded yet.');
            return;
        }

        if (pageNum < 1 || pageNum > CONTEXT_AF.pdf.numPages - 1) {
            //console.warn('The page ' + pageNum + ' selected is out of range of PDF pages [1, ' + CONTEXT_AF.pdf.numPages + '] available.');
            return;
        }

        //let's save which page we are at so we can save it for later
        CONTEXT_AF.pageNum = pageNum;

        CONTEXT_AF.pdf.getPage(pageNum).then(function(page) {
            var scale = 3.0;
            var viewport = page.getViewport({scale: scale});
        
            // Prepare canvas using PDF page dimensions
            CONTEXT_AF.canvas.height = viewport.height;
            CONTEXT_AF.canvas.width = viewport.width;
            ratio = CONTEXT_AF.canvas.height / CONTEXT_AF.canvas.width;
        
            // Render PDF page into canvas context
            var renderContext = {
                canvasContext: CONTEXT_AF.canvasContext,
                viewport: viewport
            };
            var renderTask = page.render(renderContext);
            renderTask.promise.then(function () {
                if (!CONTEXT_AF.mesh) {
                    const material = new THREE.MeshBasicMaterial();
                    const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1, CONTEXT_AF.texture.flipY);
                    material.side = THREE.DoubleSide;

                    CONTEXT_AF.mesh = new THREE.Mesh(geometry, material);
                    CONTEXT_AF.el.setObject3D("mesh", CONTEXT_AF.mesh);
                }

                CONTEXT_AF.mesh.material.transparent        = false;
                CONTEXT_AF.mesh.material.map                = CONTEXT_AF.texture;
                CONTEXT_AF.mesh.material.map.needsUpdate    = true;
                CONTEXT_AF.mesh.material.needsUpdate        = true;

                scaleToAspectRatio(CONTEXT_AF.el, ratio);
            });
        });
    }
});