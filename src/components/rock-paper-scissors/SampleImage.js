const SampleImage = {
    create: () => {
        let imageEl = new Image(1024, 701);
        imageEl.src = require("../../img/sample.png");
        return new Promise(resolve => {
            imageEl.onload = function () {
                resolve(imageEl);
            }
        });
    },
};

const SampleImage1 = {
    create: () => {
        let imageEl = new Image(1024, 701);
        imageEl.src = require("../../img/sample_paper.jpg");
        return new Promise(resolve => {
            imageEl.onload = function () {
                resolve(imageEl);
            }
        });
    },
};

export { SampleImage, SampleImage1 };