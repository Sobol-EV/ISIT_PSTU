import data_parser

data_params_path = 'params.txt'
data_rules_path = 'rules.txt'
separator = '||'
current_dict = {'repair': None}

database_params = data_parser.Parser(data_params_path, separator)
database_rules = data_parser.Parser(data_rules_path, separator)
database_params = database_params.read_datafile()  # разпарсили промежуточные вопросы
database_rules = database_rules.read_datafile()  # разпарсил правила

for key in database_params:  # создал словарик для текущих значений ответов на вопросы
    current_dict[key] = None

print("Лабораторная работа по ИСИТ № 2")
print("--------------------------------")

while not current_dict["repair"]:  # пока не поймал итоговое заключение
    for elem in database_rules.values():  # идём по правилам
        response = "None"
        if (eval(elem.rule)) and not elem.used:  # если правило сработало и оно не использовалось ранее
            if elem.response in database_params:  # если результат срабатования не итоговый
                # спрашиваем пока пользователь не введёт что требуется
                while not (response in database_params[elem.response].options_response):
                    response = database_params[elem.response].run()  # вопрос и ответ
                    if response in database_params[elem.response].options_response:  # убедились, что ответ правильный
                        current_dict[elem.response] = response  # закинул в текущие
                        elem.used = True  # пометил как использованный
                        break  # вышел из цикла проверки ответа
                    else:
                        print("(!) Выбран неизвестный вариант ответа, попробуйте ещё раз!")
                break  # вышел из цикла правил и пошёл по списку заново
            else:
                # Если же результат сработавшего правила не промежуточный, то вывожу его как итоговый
                print(f"\n---> Итоговое заключение:", elem.response)
                current_dict["repair"] = True  # останавливаю цикл, помечая что нашёл итоговое заключение

