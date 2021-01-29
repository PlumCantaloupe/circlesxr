// import pdfjs from "pdfjs-dist";
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
// const errorImage = new Image();
// errorImage.src = errorImageSrc;
// const errorTexture = new THREE.Texture(errorImage);
// errorImage.onload = () => {
//     errorTexture.needsUpdate = true;
// };


AFRAME.registerComponent("circles-pdf-loader", {
    schema: {
        src: { type: "string" },
        projection: { type: "string", default: "flat" },
        contentType: { type: "string" },
        index: { default: 0 },
        batch: { default: false },
    },
    multiple: false,
    init() {

        // Loaded via <script> tag, create shortcut to access PDF.js exports.
        this.pdfjs = window['pdfjs-dist/build/pdf'];

        // The workerSrc property shall be specified.
        this.pdfjs.GlobalWorkerOptions.workerSrc = '/global/js/libs/pdf.worker.min.js';

        this.canvas = document.createElement("canvas");
        this.canvasContext = this.canvas.getContext("2d");

        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.encoding = THREE.sRGBEncoding;
        this.texture.minFilter = THREE.LinearFilter;
    },
    async update(oldData) {
        const CONTEXT_AF = this;
        const data = this.data;
        let ratio = 1;

        if ( (oldData.src !== data.src) && (data.src !== '') ) {
            // Using DocumentInitParameters object to load binary data.
            const loadingTask = CONTEXT_AF.pdfjs.getDocument(data.src);
            loadingTask.promise.then(function(pdf) {
                /* following simpler example from here: https://jsfiddle.net/pdfjs/cq0asLqz/ */
                console.log('PDF loaded');

                CONTEXT_AF.pdf = pdf;
                CONTEXT_AF.el.setAttribute("media-pager", { maxIndex: CONTEXT_AF.pdf.numPages - 1 });
        
                // Fetch the first page
                var pageNumber = 1;
                CONTEXT_AF.pdf.getPage(pageNumber).then(function(page) {
                    console.log('Page loaded');

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
                        console.log('Page rendered');

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
            }, function (reason) {
                // PDF loading error
                console.error("Error loading PDF", reason);
            });
        }

    //     try {
    //         const { src, index } = this.data;
    //         if (!src) return;

    //         if (this.renderTask) {
    //             await this.renderTask.promise;
    //             if (src !== this.data.src || index !== this.data.index) return;
    //         }
    //         if (src !== oldData.src) {
    //             const loadingSrc = this.data.src;
    //             const pdf = await CONTEXT_AF.pdfjs.getDocument(src);
    //             if (loadingSrc !== this.data.src) return;

    //             this.pdf = pdf;
    //             this.el.setAttribute("media-pager", { maxIndex: this.pdf.numPages - 1 });
    //         }
    //         const page = await this.pdf.getPage(index + 1);
    //         if (src !== this.data.src || index !== this.data.index) return;
    //         const viewport = page.getViewport({ scale: 3 });
    //         const pw = viewport.width;
    //         const ph = viewport.height;
    //         texture = this.texture;
    //         ratio = ph / pw;

    //         this.canvas.width = pw;
    //         this.canvas.height = ph;
    //         this.renderTask = page.render({ canvasContext: this.canvasContext, viewport });

    //         await this.renderTask.promise;

    //         this.renderTask = null;
    //         if (src !== this.data.src || index !== this.data.index) return;
    //     } catch (e) {
    //         console.error("Error loading PDF", this.data.src, e);
    //         texture = errorTexture;
    //     }

    //     if (!this.mesh) {
    //         const material = new THREE.MeshBasicMaterial();
    //         const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1, texture.flipY);
    //         material.side = THREE.DoubleSide;

    //         this.mesh = new THREE.Mesh(geometry, material);
    //         this.el.setObject3D("mesh", this.mesh);
    //     }

    //     this.mesh.material.transparent = texture == errorTexture;
    //     this.mesh.material.map = texture;
    //     this.mesh.material.map.needsUpdate = true;
    //     this.mesh.material.needsUpdate = true;

    //     scaleToAspectRatio(this.el, ratio);

    }
});