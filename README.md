# KPI Schedule Cleaner
Данное расширение создано для очистки расписания КПИ от ненужных выборных предметов.
Работает на следующих доменах:
- epi.kpi.ua
- schedule.kpi.ua

# Установка и настройка
Ссылка на установщик - 
https://chrome.google.com/webstore/detail/kpi-scedule-fixer/eghemfbcldijcjjhfocnaplahkpkaflh?hl=ru&


1) Скачиваем репозиторий
2) Устанавливаем парочку зависимостей и создаем бандл.
```shell
yarn # установит зависимости
yarn run build # создаст папку dist, она нам и понадобится для загрузки в хром.
```
3) Заходим на chrome://extensions/
4) Включаем режим разработчика
![image](https://user-images.githubusercontent.com/33464332/131471858-88ac93ce-7d7e-428e-be34-fb1254d231c9.png)
5) Тыкаем "Загрузить распакованное расширение", выбираем папку dist
![image](https://user-images.githubusercontent.com/33464332/131471979-83e299f1-624e-4129-8059-40b0c4e7ed3c.png)
6) Тыкаем на иконку расширения, забиваем по очереди все предметы с расписания

     **Важно! Вбивайте имя предмета полностью, (не "Ін. мова" а "Ін. мова проф-1. Проф" , не "РСК" а "РСК 2 (1-9)"**
 
     ![image](https://user-images.githubusercontent.com/33464332/131473369-4f823f35-e06c-4674-a483-03d4af4d19dc.png)
6) Тыкаем чекбокс "ВКЛ" 

      ![image](https://user-images.githubusercontent.com/33464332/131473415-b7d9cbba-c26f-4993-95e9-bf4cac448e76.png)

Useful info:
- https://stackoverflow.com/a/18316107/12018208
- https://stackoverflow.com/a/9517879/12018208