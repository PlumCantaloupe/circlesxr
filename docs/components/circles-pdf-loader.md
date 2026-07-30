# circles-pdf-loader
[Component, **Experimental**, Text, Object]

[circles-pdf-loader](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-pdf-loader.js) loads in PDFs with basic next page annd previous page controls.

## Properties
  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | src                | string          | the url to the PDF to be loaded                           | ''                   |
  | scale              | number          | increasing scale increases the resolution of rendered pdf | 1.5  


## Examples
  *'circles-pdf-loader' code*

  ```html
  <a-entity circles-pdf-loader="src:/global/assets/pdfs/Scavarelli2020_Article_VirtualRealityAndAugmentedReal.pdf;"></a-entity>
  ```