@echo off
chcp 65001
"c:\Program Files\MongoDB\Server\5.0\bin\mongoimport.exe" --uri="mongodb://localhost:27017/AdatbázisNeve" --collection=TáblaNeve1 --drop --file=db_1.json --jsonArray
"c:\Program Files\MongoDB\Server\5.0\bin\mongoimport.exe" --uri="mongodb://localhost:27017/AdatbázisNeve" --collection=TáblaNeveN --drop --file=db_n.json --jsonArray
"c:\Program Files\MongoDB\Server\5.0\bin\mongoimport.exe" --uri="mongodb://localhost:27017/AdatbázisNeve" --collection=identitycounters --drop --file=db_counters.json --jsonArray
echo PLEASE KILL AND RESTART YOUR BACKEND SERVER DEV TASK IF RUNNING!