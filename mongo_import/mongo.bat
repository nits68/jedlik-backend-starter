@echo off
chcp 65001
if EXIST "c:\Program Files\MongoDB\Server\8.0\bin\mongoimport.exe" "c:\Program Files\MongoDB\Server\8.0\bin\mongoimport.exe" --uri="mongodb://localhost:27017/AdatbázisNeve" --collection=TáblaNeveOne --drop --file=db_one.json --jsonArray
if EXIST "c:\Program Files\MongoDB\Server\8.0\bin\mongoimport.exe" "c:\Program Files\MongoDB\Server\8.0\bin\mongoimport.exe" --uri="mongodb://localhost:27017/AdatbázisNeve" --collection=TáblaNeveMany --drop --file=db_many.json --jsonArray
if EXIST "c:\Program Files\MongoDB\Server\8.0\bin\mongoimport.exe" "c:\Program Files\MongoDB\Server\8.0\bin\mongoimport.exe" --uri="mongodb://localhost:27017/AdatbázisNeve" --collection=TáblaNeveOther --drop --file=db_other.json --jsonArray

if EXIST "c:\Program Files\MongoDB\Server\7.0\bin\mongoimport.exe" "c:\Program Files\MongoDB\Server\7.0\bin\mongoimport.exe" --uri="mongodb://localhost:27017/AdatbázisNeve" --collection=TáblaNeveOne --drop --file=db_one.json --jsonArray
if EXIST "c:\Program Files\MongoDB\Server\7.0\bin\mongoimport.exe" "c:\Program Files\MongoDB\Server\7.0\bin\mongoimport.exe" --uri="mongodb://localhost:27017/AdatbázisNeve" --collection=TáblaNeveMany --drop --file=db_many.json --jsonArray
if EXIST "c:\Program Files\MongoDB\Server\7.0\bin\mongoimport.exe" "c:\Program Files\MongoDB\Server\7.0\bin\mongoimport.exe" --uri="mongodb://localhost:27017/AdatbázisNeve" --collection=TáblaNeveOther --drop --file=db_other.json --jsonArray
echo PLEASE KILL AND RESTART YOUR BACKEND SERVER DEV TASK IF RUNNING!