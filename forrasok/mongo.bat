@echo off
chcp 65001
"c:\Program Files\MongoDB\Server\7.0\bin\mongoimport.exe" --uri="mongodb://localhost:27017/AdatbázisNeve" --collection=TáblaNeve1 --drop --file=db_1.json --jsonArray
"c:\Program Files\MongoDB\Server\7.0\bin\mongoimport.exe" --uri="mongodb://localhost:27017/AdatbázisNeve" --collection=TáblaNeveN --drop --file=db_n.json --jsonArray
echo PLEASE KILL AND RESTART YOUR BACKEND SERVER DEV TASK IF RUNNING!