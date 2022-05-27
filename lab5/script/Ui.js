

$(document).ready(function () {
    context = document.getElementById("canvas").getContext("2d");

    // Создаём контурный контекст
    outlineContext = document.getElementById("outlines").getContext("2d");
    outlineContext.fillStyle = "red";
    outlineContext.strokeStyle = "gray";

    $('#canvas').mousedown(function (e) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;

        paint = true;
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    });

    $('#canvas').mousemove(function (e) {
        if (paint) {
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw();
        }
    });

    $('#canvas').mouseup(function (e) {
        paint = false;
    });

    $('#canvas').mouseleave(function (e) {
        paint = false;
    });

    $("#clear").on("click", function () {
        // Очищаем контекст рисования
        clickX = [];
        clickY = [];
        clickDrag = [];
        paint = false;
        redraw();

        // Придаём чёткий контур
        outlineContext.clearRect(0, 0, outlineContext.canvas.width, outlineContext.canvas.height);

        // Проясняем предположение
        $("#bestGuess").text("");
        $("#outputValues").html("");

    });

    $("#read").on("click", readDrawing);
    $("#trainCharacter").on("click", trainCharacter);

    var clickX = [];
    var clickY = [];
    var clickDrag = [];
    var paint;

    function addClick(x, y, dragging) {
        clickX.push(x);
        clickY.push(y);
        clickDrag.push(dragging);
    }

    function redraw() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

        context.strokeStyle = "green";
        context.lineJoin = "round";
        context.lineWidth = 5;

        for (var i = 0; i < clickX.length; i++) {
            context.beginPath();
            if (clickDrag[i] && i) {
                context.moveTo(clickX[i - 1], clickY[i - 1]);
            } else {
                context.moveTo(clickX[i] - 1, clickY[i]);
            }
            context.lineTo(clickX[i], clickY[i]);
            context.closePath();
            context.stroke();
        }
    }
}
);

// Создаём и возвращаем массив из 225 элементов (15 x 15), который представляет изображение с уменьшенной дискретизацией.
function getDownsampledDrawing() {
    var output = [];
    var blockSize = 10;
    var canvasSizeX = context.canvas.width;
    var canvasSizeY = context.canvas.height;

    for (var x = 0; x < canvasSizeX; x += blockSize) {
        for (var y = 0; y < canvasSizeY; y += blockSize) {
            // Получить значение RGBA на пиксель
            var data = context.getImageData(x, y, blockSize, blockSize).data;
            var found = false;
            for (var i = 0; i < data.length; i++) {
                // Если хотя бы одно из значений больше 0, то пользователь попадает в квадрат
                if (data[i]) {
                    output.push(1);

                    // Нарисовать красный квадрат в контексте контура
                    outlineContext.fillRect(x, y, blockSize, blockSize);
            

                    found = true;
                    break;
                }
            }
            if (!found) {
                output.push(-1);
            }

            outlineContext.strokeRect(x, y, blockSize, blockSize);

        }
    }

    return output;
}