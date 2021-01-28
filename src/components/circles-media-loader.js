import pdfjs from "pdfjs-dist";
//import errorImageSrc from "../assets/images/media-error.png";

//const pdfjsLib = window['pdfjs-dist/build/pdf.js'];
pdfjs.GlobalWorkerOptions.workerSrc = '!!file-loader?outputPath=assets/js&name=[name]-[hash].js!pdfjs-dist/build/pdf.worker.js';



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

        this.canvas = document.createElement("canvas");
        this.canvasContext = this.canvas.getContext("2d");

        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.encoding = THREE.sRGBEncoding;
        this.texture.minFilter = THREE.LinearFilter;
    },
    async update(oldData) {
        let texture;
        let ratio = 1;

        try {
            const { src, index } = this.data;
            if (!src) return;

            if (this.renderTask) {
                await this.renderTask.promise;
                if (src !== this.data.src || index !== this.data.index) return;
            }
            if (src !== oldData.src) {
                const loadingSrc = this.data.src;
                const pdf = await pdfjs.getDocument(src);
                if (loadingSrc !== this.data.src) return;

                this.pdf = pdf;
                this.el.setAttribute("media-pager", { maxIndex: this.pdf.numPages - 1 });

            }
            const page = await this.pdf.getPage(index + 1);
            if (src !== this.data.src || index !== this.data.index) return;
            const viewport = page.getViewport({ scale: 3 });
            const pw = viewport.width;
            const ph = viewport.height;
            texture = this.texture;
            ratio = ph / pw;

            this.canvas.width = pw;
            this.canvas.height = ph;
            this.renderTask = page.render({ canvasContext: this.canvasContext, viewport });

            await this.renderTask.promise;

            this.renderTask = null;
            if (src !== this.data.src || index !== this.data.index) return;
        } catch (e) {
            console.error("Error loading PDF", this.data.src, e);
            texture = errorTexture;
        }

        if (!this.mesh) {
            const material = new THREE.MeshBasicMaterial();
            const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1, texture.flipY);
            material.side = THREE.DoubleSide;

            this.mesh = new THREE.Mesh(geometry, material);
            this.el.setObject3D("mesh", this.mesh);
        }

        this.mesh.material.transparent = texture == errorTexture;
        this.mesh.material.map = texture;
        this.mesh.material.map.needsUpdate = true;
        this.mesh.material.needsUpdate = true;

        scaleToAspectRatio(this.el, ratio);



    }


});