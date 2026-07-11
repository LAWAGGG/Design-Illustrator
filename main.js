let init = document.getElementById("init")
let textLogo = document.getElementById("textLogo")
let screenEl = document.getElementById("screen")
let board = document.getElementById("board")
let inputSizes = document.getElementById("inputSizes")
let inputWidth = document.getElementById("inputWidth")
let inputHeight = document.getElementById("inputHeight")
let layerLists = document.getElementById("layerLists")
let btnTools = document.querySelectorAll(".btnTool")
let btnShapes = document.querySelectorAll(".btnShape")
let btnOpacities = document.querySelectorAll(".btnOpacity")
let sizeValue = document.getElementById("sizeValue")
let inputBrushSize = document.getElementById("inputBrushSize")
let settings = document.querySelectorAll(".settings")
let inputRotate = document.getElementById("inputRotate")
let inputClockwise = document.getElementById("inputClockwise")
let btnFlips = document.querySelectorAll(".btnFlip")
let btnCreateShapes = document.querySelectorAll(".btnCreateShape")
let colorValue = document.getElementById("colorValue")
let textForm = document.getElementById("textForm")
let inputLayerName = document.getElementById("inputLayerName")
let selectFont = document.getElementById("selectFont")
let inputFontSize = document.getElementById("inputFontSize")
let btnStyles = document.querySelectorAll(".btnStyle")
let btnFilters = document.querySelectorAll(".btnFilter")
let btnFeatures = document.querySelectorAll(".btnFeature")
let inputIntensity = document.getElementById("inputIntensity")
let btnDuplicate = document.getElementById("btnDuplicate")
let inputRed = document.getElementById("inputRed")
let inputGreen = document.getElementById("inputGreen")
let inputBlue = document.getElementById("inputBlue")
let inputColours = document.getElementById("inputColours")
let zoomSize = document.getElementById("zoomSize")
let btnAddLayer = document.getElementById("btnAddLayer")
let inputFile = document.getElementById("inputFile")

setTimeout(() => {
    textLogo.classList.add("fadeOut")
}, 1000);
setTimeout(() => {
    init.classList.add("hide")
    screenEl.classList.remove("hide")
}, 2000);

let layers = []
let currentLayer = null
let mode = null
let shape = null
let opacity = 1
let selectedColor = "red"
let textStyle = null
let stampedData = null
let isStamped = false
let filter = null
let scale = 100
let isAdd = false

inputFile.addEventListener("input", (e) => {
    let file = URL.createObjectURL(e.target.files[0])

    createLayer(e.target.files[0].name.slice(0,10), false, false, file)
})

btnAddLayer.addEventListener("click", (e) => {
    textForm.classList.remove("hide")
    textForm.style.left = "42%"
    textForm.style.top = "50%"
    isAdd = true
})

btnFeatures.forEach(btn => {
    btn.addEventListener("click", (e) => {
        if (btn.value == "ZoomIn" && scale < 200) scale += 10
        if (btn.value == "ZoomOut" && scale > 10) scale -= 10
        if (btn.value == "ZoomIn" || btn.value == "ZoomOut") {
            board.style.transform = `scale(${scale}%)`
            zoomSize.textContent = scale + "%"
        }

        if(btn.value == "Export"){
            exportSVGToJPG(board)
        }
    })
})

inputColours.addEventListener("input", (e) => {
    let color = `rgb(${inputRed.value}, ${inputGreen.value}, ${inputBlue.value})`
    colorValue.style.backgroundColor = color
    selectedColor = color
})

btnDuplicate.addEventListener("click", (e) => {
    if (currentLayer == null) return

    createLayer("duplicate", false, true)
})

btnFilters.forEach(btn => {
    btn.addEventListener("click", (e) => {
        btnFilters.forEach(el => el.classList.remove("active"))
        filter = btn.value
        btn.classList.add("active")
    })
})

inputIntensity.addEventListener("input", (e) => {
    let layerFilter = layers[currentLayer].elements.dataset
    if (filter == "Brightness") layerFilter.brightness = inputIntensity.value
    if (filter == "Saturation") layerFilter.saturate = inputIntensity.value
    if (filter == "Grayscale") layerFilter.grayscale = inputIntensity.value
    layers[currentLayer].elements.style.filter = `saturate(${layerFilter.saturate}) brightness(${layerFilter.brightness}) grayscale(${layerFilter.grayscale})`
    if (filter == "Opacity") layers[currentLayer].elements.style.opacity = `${inputIntensity.value}`
})

btnStyles.forEach(btn => {
    btn.addEventListener("click", (e) => {
        btnStyles.forEach(el => el.classList.remove("active"))
        btn.classList.add("active")
        textStyle = btn.value
    })
})

btnCreateShapes.forEach(btn => {
    btn.addEventListener("click", (e) => {
        btnCreateShapes.forEach(el => el.classList.remove("active"))
        btn.classList.add("active")
        shape = btn.value
    })
})

inputRotate.addEventListener("input", (e) => {
    let posX = currentGroup.dataset.x
    let posY = currentGroup.dataset.y
    let scaleX = currentGroup.dataset.flipX
    let scaleY = currentGroup.dataset.flipY
    let rotate = inputRotate.value
    let isCounter = currentGroup.dataset.isCounter

    applyTransform(currentGroup, posX, posY, scaleX, scaleY, rotate, isCounter)
})

inputClockwise.addEventListener("click", (e) => {
    let posX = currentGroup.dataset.x
    let posY = currentGroup.dataset.y
    let scaleX = currentGroup.dataset.flipX
    let scaleY = currentGroup.dataset.flipY
    let rotate = currentGroup.dataset.rotate
    let isCounter = inputClockwise.checked ? true : false

    applyTransform(currentGroup, posX, posY, scaleX, scaleY, rotate, isCounter)
})

btnFlips.forEach(btn => {
    btn.addEventListener("click", (e) => {
        let posX = currentGroup.dataset.x
        let posY = currentGroup.dataset.y
        let scaleX = currentGroup.dataset.flipX
        let scaleY = currentGroup.dataset.flipY
        let rotate = currentGroup.dataset.rotate
        let isCounter = currentGroup.dataset.isCounter
        if (btn.value == "Horizontal") {
            if (currentGroup.dataset.flipX == 1) {
                scaleX = currentGroup.dataset.flipX = -1
            } else {
                scaleX = currentGroup.dataset.flipX = 1
            }
            applyTransform(currentGroup, posX, posY, scaleX, scaleY, rotate, isCounter)
        }
        if (btn.value == "Vertical") {
            if (currentGroup.dataset.flipY == 1) {
                scaleY = currentGroup.dataset.flipY = -1
            } else {
                scaleY = currentGroup.dataset.flipY = 1
            }
            applyTransform(currentGroup, posX, posY, scaleX, scaleY, rotate, isCounter)
        }
    })
})

btnShapes.forEach(btn => {
    btn.addEventListener("click", (e) => {
        btnShapes.forEach(el => el.classList.remove("active"))
        btn.classList.add("active")
        shape = btn.value
    })
})

btnTools.forEach(btn => {
    btn.addEventListener("click", async (e) => {
        btnTools.forEach(el => el.classList.remove("active"))
        btn.classList.add("active")
        mode = btn.value

        if (mode == "Picker") {
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open()

            colorValue.style.backgroundColor = result.sRGBHex
            selectedColor = result.sRGBHex
        }

        changeProps(mode)
    })
})

btnOpacities.forEach(btn => {
    btn.addEventListener("click", (e) => {
        btnOpacities.forEach(el => el.classList.remove("active"))
        btn.classList.add("active")
        opacity = btn.value
    })
})

inputBrushSize.addEventListener("input", (e) => {
    sizeValue.textContent = inputBrushSize.value + "px"
})

textForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let layer = createLayer(inputLayerName.value.slice(0, 10), false)
    if (!isAdd) {
        let text = createElement("text", {
            fill: selectedColor,
            x: selectedPos.x,
            y: selectedPos.y,
            "font-size": inputFontSize.value,
        })
        if (textStyle == "Bold") text.style.fontWeight = "bold"
        if (textStyle == "Underline") text.style.textDecoration = "underline"
        if (textStyle == "Italic") text.style.fontStyle = "italic"
        text.style.fontFamily = selectFont.value
        text.textContent = inputLayerName.value

        let g = createElement("g", { class: "group" })
        g.append(text)
        layer.append(g)
    } else {
        isAdd = false
    }

    textForm.classList.add("hide")
})

let isDrag = false
let currentGroup = null
let groupCenterOffset = { x: 0, y: 0 }
let selectedPos = { x: 0, y: 0 }

board.addEventListener("mousedown", async (e) => {
    isDrag = true
    if (mode == "Brush") {
        currentGroup = createElement("g", {
            class: "group"
        })
        layers[currentLayer].elements.append(currentGroup)
    }

    if (mode == "Eraser" || mode == "Move") {
        currentGroup = e.target.closest("g.group")

        if (mode == "Move") {
            let bbox = currentGroup.getBBox()
            groupCenterOffset = {
                x: bbox.x + bbox.width / 2,
                y: bbox.y + bbox.height / 2,
            }
        }

        if (mode == "Eraser" && currentGroup && !currentGroup.getAttribute("mask")) {
            let maskId = `mask-${Date.now()}`
            let mask = createElement("mask", { id: maskId })
            let rect = createElement("rect", {
                x: 0,
                y: 0,
                width: inputWidth.value,
                height: inputHeight.value,
                fill: "white"
            })

            mask.append(rect)
            layers[currentLayer].elements.append(mask)

            currentGroup.setAttribute("mask", `url(#${maskId})`)
            currentGroup.dataset.maskId = maskId
        }
    }

    if (mode == "Shape") {
        let position = toSvgCoords(e.clientX, e.clientY)
        currentGroup = createElement("g", { class: "group" })
        if (shape == "circle") {
            let circle = createElement("circle", {
                r: 30,
                fill: selectedColor,
                cx: position.x,
                cy: position.y,
            })

            currentGroup.append(circle)
        }
        if (shape == "rect") {
            let rect = createElement("rect", {
                width: 40,
                height: 100,
                fill: selectedColor,
                x: position.x,
                y: position.y,
            })

            currentGroup.append(rect)
        }
        if (shape == "square") {
            let square = createElement("rect", {
                width: 40,
                height: 40,
                fill: selectedColor,
                x: position.x,
                y: position.y,
            })
            currentGroup.append(square)
        }
        if (shape == "line") {
            let line = createElement("line", {
                stroke: selectedColor,
                x1: position.x,
                y1: position.y,
                x2: position.x + 100,
                y2: position.y,
                "stroke-width": 5
            })
            currentGroup.append(line)
        }
        layers[currentLayer].elements.append(currentGroup)
    }

    if (mode == "Text") {
        textForm.style.left = e.clientX + "px"
        textForm.style.top = e.clientY + "px"
        textForm.classList.remove("hide")
        selectedPos = toSvgCoords(e.clientX, e.clientY)
        console.log(selectedPos)
    }

    if (e.altKey && mode == "Stamp" && !isStamped) {
        stampedData = e.target.closest("g.group")
        isStamped = true
    } else if (isStamped && mode == "Stamp") {
        let stampedGroup = stampedData.cloneNode(true)

        let bbox = stampedData.getBBox()
        let centerX = bbox.x + bbox.width / 2
        let centerY = bbox.y + bbox.height / 2

        let position = toSvgCoords(e.clientX, e.clientY)
        let posX = position.x - centerX
        let posY = position.y - centerY

        applyTransform(stampedGroup, posX, posY, stampedData.scaleX, stampedData.scaleY, stampedData.rotate, stampedData.isCounter)

        //idk how to fix ts hmph (how to make this feature dont duplicating 
        // the mask but i want to make the effects of eraser still applying 
        // to the duplicated group) ↓

        // console.log(document.getElementById(stampedData.dataset.maskId), stampedData.getAttribute("mask"))
        // if(stampedGroup.getAttribute("mask")){
        //     stampedGroup.removeAttribute("mask")
        // }

        layers[currentLayer].elements.append(stampedGroup)
        isStamped = false
    }
})

board.addEventListener("mousemove", (e) => {
    if (!isDrag) return
    let position = toSvgCoords(e.clientX, e.clientY)

    if (mode == "Brush") {
        if (shape == "circle") {
            let circle = createElement("circle", {
                r: inputBrushSize.value,
                fill: selectedColor,
                cx: position.x,
                cy: position.y,
                opacity: opacity
            })

            currentGroup.append(circle)
        }
        if (shape == "rect") {
            let rect = createElement("rect", {
                width: inputBrushSize.value,
                height: inputBrushSize.value,
                fill: selectedColor,
                x: position.x,
                y: position.y,
                opacity: opacity
            })

            currentGroup.append(rect)
        }
    }

    if (mode == "Eraser") {
        if (!currentGroup) return
        let mask = document.getElementById(currentGroup.dataset.maskId)
        if (!mask) return

        if (shape == "circle") {
            let circle = createElement("circle", {
                r: inputBrushSize.value,
                fill: "black",
                cx: position.x,
                cy: position.y,
                opacity: opacity
            })

            mask.append(circle)
        }
        if (shape == "rect") {
            let rect = createElement("rect", {
                width: inputBrushSize.value,
                height: inputBrushSize.value,
                fill: "black",
                x: position.x,
                y: position.y,
                opacity: opacity
            })

            mask.append(rect)
        }
    }

    if (mode == "Move") {
        let scaleX = currentGroup.dataset.flipX
        let scaleY = currentGroup.dataset.flipY
        let rotate = currentGroup.dataset.rotate
        let isCounter = currentGroup.dataset.isCounter
        let posX = position.x - groupCenterOffset.x
        let posY = position.y - groupCenterOffset.y
        applyTransform(currentGroup, posX, posY, scaleX, scaleY, rotate, isCounter)
    }
})

board.addEventListener("mouseup", (e) => {
    isDrag = false
})

inputSizes.addEventListener("input", (e) => {
    board.style.width = inputWidth.value + "px"
    board.style.height = inputHeight.value + "px"

    document.querySelector(".layerBg").setAttribute("width", inputWidth.value)
    document.querySelector(".layerBg").setAttribute("height", inputHeight.value)
})

document.addEventListener("keydown", (e) => {
    if (e.key == "Delete" ) {
        let index = layers.findIndex(l => l.id == layers[currentLayer].id)
        if (layers[index].name != "Background") {
            layers[index].elements.remove()
            layers.splice(index, 1)
            fetchLayers()
        }
    }

    if (e.key == "Escape") {
        textForm.classList.add("hide")
        isAdd = false
    }
})

function applyTransform(group, posX, posY, scaleX = 1, scaleY = 1, rotate = 0, isCounter = false) {
    let transformProp = `translate(${posX ?? 0}, ${posY ?? 0}) scale(${scaleX}, ${scaleY}) rotate(${isCounter ? "-" : ""}${rotate})`
    group.dataset.x = posX
    group.dataset.y = posY
    group.dataset.flipX = scaleX
    group.dataset.flipY = scaleY
    group.dataset.rotate = rotate
    group.dataset.isCounter = isCounter == "true" ? true : false
    group.setAttribute("transform", transformProp)
    group.setAttribute("transform-origin", "center")
}

function changeProps(value) {
    settings.forEach(el => el.classList.add("hide"))
    settings.forEach(el => {
        if (el.id == "Brush" && value == "Eraser") el.classList.remove("hide")
        if (el.id == value) el.classList.remove("hide")
    })
}

function createLayer(layerName, isFirstInit = false, isDuplicate = false, file = null) {
    let g = null
    if (!isDuplicate) {
        g = createElement("g")
    }
    if (isDuplicate) {
        g = layers[currentLayer].elements.cloneNode(true)
    }
    g.dataset.brightness = 1
    g.dataset.saturate = 1
    g.dataset.grayscale = 0

    if (isFirstInit) {

        let rect = createElement("rect", {
            width: inputWidth.value,
            height: inputHeight.value,
            fill: "white",
            class: "layerBg"
        })

        g.append(rect)
    }

    if (file != null) {
        let image = createElement("image", {
            href: file,
            width: "100%",
            height: "100%",
            preserveAspectRatio: "xMidYMid meet"
        })

        g.append(image)
    }

    let layerData = {
        id: layers.length == 0 ? 1 : layers[layers.length - 1].id + 1,
        name: layerName,
        elements: g
    }

    if (isDuplicate) layerData.name = layers[currentLayer].name + " copy"

    board.append(g)

    layers.push(layerData)

    fetchLayers()

    return g
}

function exportSVGToJPG(svgElement, fileName = 'export.jpg', quality = 0.9) {
    const rect = svgElement.getBoundingClientRect();
    const width = rect.width || 800;
    const height = rect.height || 600;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.width = width;
    img.height = height;

    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);

        const jpgUrl = canvas.toDataURL('image/jpeg', quality);

        const downloadLink = document.createElement('a');
        downloadLink.href = jpgUrl;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    };

    img.onerror = function (err) {
        console.error('Error loading SVG into Image element', err);
        URL.revokeObjectURL(url);
    };

    img.src = url;
}

function fetchLayers() {
    layerLists.innerHTML = ""
    layers.forEach((layer, i) => {
        let card = document.createElement("div")
        card.className = "layer"

        card.addEventListener("click", (e) => {
            document.querySelectorAll(".layer").forEach(el => el.classList.remove("active"))
            if (currentLayer == i) {
                currentLayer = null
                card.classList.remove("active")
            } else {
                currentLayer = i
                card.classList.add("active")
            }
        })

        let p = document.createElement("p")
        p.textContent = layer.name

        let btnHide = document.createElement("button")
        btnHide.className = "btnHide"
        btnHide.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>`

        btnHide.addEventListener("click", (e) => {
            if (layer.elements.classList.contains("hide")) {
                layer.elements.classList.remove("hide")
                btnHide.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>`
            } else {
                layer.elements.classList.add("hide")

                btnHide.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                `
            }
        })

        card.append(p, btnHide)
        layerLists.append(card)
    })
}

function toSvgCoords(posX, posY) {
    let pt = board.createSVGPoint()
    pt.x = posX
    pt.y = posY
    return pt.matrixTransform(board.getScreenCTM().inverse())
}

function createElement(elementName, attributes) {
    let el = document.createElementNS("http://www.w3.org/2000/svg", elementName)

    if (!attributes) return el

    const attributeKeys = Object.keys(attributes)
    attributeKeys.forEach(key => {
        el.setAttribute(key, attributes[key])
    })

    return el
}

createLayer("Background", true)