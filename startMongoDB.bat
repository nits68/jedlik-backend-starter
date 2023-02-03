if not exist "c:\data\" mkdir "c:\data"
if not exist "c:\data\db" mkdir "c:\data\db"
if EXIST "c:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" "c:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath="c:\data\db"
if EXIST "c:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" "c:\Program Files\MongoDB\Server\6.0\bin\mongod.exe" --dbpath="c:\data\db"