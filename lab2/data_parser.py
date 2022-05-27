import os


class NodeParam:

    """Класс для промежуточных вопросов"""

    def __init__(self, name, question, options_response=None):
        self.name = name
        self.question = question
        self.transform_bool = False if options_response else True
        self.options_response = options_response if options_response \
            else [True, False]
        self.used = False

    def run(self):
        """Функция для вывода вопроса пользователю и получения ответа"""
        response = input(f"(?) {self.question} \n > ")
        if self.transform_bool:
            try:
                response = eval(response)
            except Exception as E:
                # на случай неверного ввода
                pass
        return response


class NodeRules:

    """Класс для хранения правил"""

    def __init__(self, name, rule, response, priority=0):
        self.name = name
        self.priority = priority  # в реализации не пригодилась, приоритет в порядке правил
        self.rule = rule
        self.response = response
        self.used = False


class Parser:

    """Класс считывает файлы с правилами и промежуточными вопросами,
    и создаёт словарик с экземплярами классов"""

    def __init__(self, filename, char_separator):
        self.filename = filename
        self.char_separator = char_separator
        self.type_parser = filename.split(".")[0]
        self.result_dict_params = {}

    @staticmethod
    def repo_root():
        """Путь до папки с проектом"""
        return os.path.abspath(os.path.join(__file__, os.path.pardir))

    def read_datafile(self):
        # получаем полный путь
        file_path = os.path.join(self.repo_root(), self.filename)
        # открою на чтение текстовик
        with open(file_path, 'r', encoding="utf8") as f:
            file = f.read()
            file = file.split('\n')
            for line in file:  # читаем построчно
                line_split = line.split(self.char_separator)
                if self.type_parser == 'params':
                    # промежуточные вопросы
                    if len(line_split) == 2:
                        # для вопросов с ответом да\нет
                        self.result_dict_params[line_split[0]] = NodeParam(
                            line_split[0],
                            line_split[1],
                        )
                    if len(line_split) == 3:
                        # для вопросов со списком ответов
                        self.result_dict_params[line_split[0]] = NodeParam(
                            line_split[0],
                            line_split[1],
                            line_split[2],
                        )
                if self.type_parser == 'rules':
                    # правила
                    if len(line_split) == 3:
                        self.result_dict_params[line_split[0]] = NodeRules(
                            line_split[0],
                            line_split[1],
                            line_split[2],
                        )

            return self.result_dict_params

