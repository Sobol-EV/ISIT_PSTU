// Сначала создадим глобальные переменные
var brain = new Brain(BRAIN_ABC);


// Обработчик события нажатия на кнопку
function readDrawing() {

    // Уменьшаем размер рисунка до сетки 15x15, с нулями для пустых мест и единицами для цветных мест
    // Входная переменная будет содержать 255 элементов с нулями и единицами
    var drawing = getDownsampledDrawing();

    // Входной слой будет первый слой, выходным слоем будет последний
    var inputLayer = brain.Layers[0];
    var outputLayer = brain.Layers[brain.Layers.length - 1];

    // Заполняем входной слой
    for (var i = 0; i < drawing.length; i++) {
        inputLayer.Neurons[i].AxonValue = drawing[i];
    }

    brain.Think();


    $("#outputValues").html("<h3>Output values</h3>");
    for (var i = 0; i < outputLayer.Neurons.length; i++) {
        var neuron = outputLayer.Neurons[i];
        $("#outputValues").append("<span>" + neuron.Name.toUpperCase() + ": " + neuron.AxonValue + "</span>");
    }
    var bestGuess = outputLayer.BestGuess();
    if (bestGuess !== null) {
        $("#bestGuess").text(bestGuess.Name.toUpperCase());

    }
    else {
        $("#outputValues").html("Could not read your drawing.");
    }

}

// Запускает обучающее действие для предоставленного символа
function trainCharacter() {
    var inputLayer = brain.Layers[0];
    var outputLayer = brain.Layers[brain.Layers.length - 1];

    // Определяем символ, который нужно тренировать
    var character = $("#txtCharacter").val().toUpperCase();
    if (character.length === 0) {
        //no character, no glory
        return;
    }

    // Поиск выходного нейрона для обучаймого символа
    var outputNeuron = outputLayer.GetNeuron(character);

    // Если символ ранее не обучался, добавляем его в выходной слой
    if (outputNeuron === null) {
        var outputNeuron = new Neuron(character)
        inputLayer.ConnectNeuron(outputNeuron);
        outputLayer.Neurons.push(outputNeuron);
    }

    // Обучаем сеть с текущим рисунком, примененным к выходному нейрону
    brain.Train(getDownsampledDrawing(), outputNeuron);

}
