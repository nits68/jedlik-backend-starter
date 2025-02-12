@ECHO off
ECHO "Transactions working only with replica set."
ECHO "Please run mongosh to initiate replica set with rs.initiate() command."
ECHO "Replica set config stored in c:/data/db, so if you delete this folder, you have to reinitiate replica set."
ECHO "Run mongosh to check replica set status with rs.status() command."
ECHO "Run mongosh to check replica set configuration with rs.conf() command."
ECHO "Press any key to continue..."
PAUSE > nul
if not exist "c:\data\" mkdir "c:\data"
if not exist "c:\data\db" mkdir "c:\data\db"
if EXIST "c:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" "c:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --replSet "rs0" --port 27017 --dbpath "c:/data/db" --bind_ip localhost
if EXIST "c:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" "c:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --replSet "rs0" --port 27017 --dbpath "c:/data/db" --bind_ip localhost
