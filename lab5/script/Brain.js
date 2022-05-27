
// Класс brain является основным классом нейронной сети. Он содержит ссылки на объекты сетевого уровня.
var Brain = (function () {

    function Brain(brainData) {
        this.Layers = [];

        // Если предустановлено значение в brainData, то перестраиваем мозг brain на основе предыдущего состояния
        if (brainData !== null) {
            for (var i = 0; i < brainData.Layers.length; i++) {
                var layerData = brainData.Layers[i];
                var layer = new Layer();
                this.Layers.push(layer);
                for (var j = 0; j < layerData.Neurons.length; j++) {
                    var neuronData = layerData.Neurons[j];

                    var neuron = new Neuron();
                    neuron.AxonValue = neuronData.AxonValue;
                    neuron.Name = neuronData.Name;
                    layer.Neurons.push(neuron);
                    if (i > 0) {
                        // Соединяем нейрон со всеми нейронами предыдущего слоя
                        this.Layers[i - 1].ConnectNeuron(neuron);
                    }
                    // Устанавливаем веса для каждого дендрита
                    for (var k = 0; k < neuronData.Dendrites.length; k++) {
                        neuron.Dendrites[k].Weight = neuronData.Dendrites[k].Weight;
                    }
                }

            }
        }
    }

    // Заставляем каждый слой в сети генерировать выходные значения
    Brain.prototype.Think = function () {
        for (var i = 0; i < this.Layers.length; i++) {
            this.Layers[i].Think();
        }
    };

    // Обучаем выходной нейрон с входными данными. Входные данные считаются хорошим примером, для выходного нейрона.
    Brain.prototype.Train = function (inputData, outputNeuron) {

        // Если нет слов
        if (this.Layers.length === 0) {
            return;
        }

        // Заполняем первый слой входными данными, чтобы насытить сеть
        var inputLayer = this.Layers[0];
        for (var i = 0; i < inputData.length; i++) {
            inputLayer.Neurons[i].AxonValue = inputData[i];
        }

        // Генерируем вывод для заданных входов
        this.Think();

        // Корректируем веса с помощью дельты
        // Сгенерированный результат сравнивается с вводом для обучения: здесь это рисунок
        // Вычитание - это ошибка, которая будет исправлена путем корректировки веса
        var delta = 0;
        var learningRate = 0.01;
        for (var i = 0; i < outputNeuron.Dendrites.length; i++) {
            var dendrite = outputNeuron.Dendrites[i];
            delta = parseFloat(Math.max(inputData[i], 0) - outputNeuron.AxonValue);
            dendrite.Weight += parseFloat(Math.max(inputData[i], 0) * delta * learningRate);
        }

    }
    return Brain;
}
)();


// Слой представляет собой набор нейронов
var Layer = (function () {


    // Конструктор
    function Layer(neuronCount) {
        var neuronsToAdd = typeof neuronCount !== "undefined" ? neuronCount : 0;
        this.Neurons = [];


        // Создаем запрошенные объекты нейрона
        for (var i = 0; i < neuronsToAdd; i++) {
            this.Neurons.push(new Neuron());
        }
    }


    // Заставляем все нейроны слоя генерировать выходное значение
    Layer.prototype.Think = function () {
        for (var i = 0; i < this.Neurons.length; i++) {
            this.Neurons[i].Think();
        }
    };

    // Эта функция соединяет нейрон другого слоя со всеми нейронами текущего слоя
    Layer.prototype.ConnectNeuron = function (neuron) {
        for (var i = 0; i < this.Neurons.length; i++) {
            neuron.Dendrites.push(new Dendrite(this.Neurons[i]))
        }
    };

    // Поиск нейрона с указанным именем
    Layer.prototype.GetNeuron = function (name) {
        for (var i = 0; i < this.Neurons.length; i++) {
            if (this.Neurons[i].Name.toUpperCase() === name.toUpperCase()) {
                return this.Neurons[i];
            }
        }
        return null;
    };

    // Возвращаем нейрон с самым высоким значением аксона в текущем слое
    Layer.prototype.BestGuess = function () {
        var max = 0;
        var bestGuessIndex = 0;

        // Находим индекс нейрона с наибольшим значением аксона
        for (var i = 0; i < this.Neurons.length; i++) {
            if (this.Neurons[i].AxonValue > max) {
                max = this.Neurons[i].AxonValue;
                bestGuessIndex = i;
            }
        }
        return this.Neurons[bestGuessIndex];
    }



    return Layer;
}
)();

// Нейрон является вычислительной единицей и должен осуществлять генерацию выходного значения
var Neuron = (function () {


    // Конструктор нейронов, присутствуют имена для легкого поиска
    function Neuron(name) {
        this.Name = name;
        this.Dendrites = [];
        this.AxonValue = 0.5;
    }

    // Генерируем выходное значение на основе входных значений, умноженных на соответствующие веса
    // Выходное значение всегда находится между 0 и 1 из-за сигмовидной функции
    Neuron.prototype.Think = function () {
        var sum = 0;
        if (this.Dendrites.length > 0) {
            for (var i = 0; i < this.Dendrites.length; i++) {
                sum += this.Dendrites[i].SourceNeuron.AxonValue * this.Dendrites[i].Weight;
            }

            // Применяем сигмовидную функцию для преобразования суммы в значение от 0 до 1.
            this.AxonValue = 1 / (1 + Math.exp(-sum));
        }
    };
    return Neuron;
}
)();

// Дендрит представляет собой, входное соединение с нейроном
// Исходный нейрон, к которому он подключен, передаём в конструктор
var Dendrite = (function () {
    function Dendrite(sourceNeuron) {
        this.SourceNeuron = sourceNeuron;
        this.Weight = 0;
    }
    return Dendrite;
}
)();
