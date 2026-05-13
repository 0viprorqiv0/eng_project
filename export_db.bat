@echo off
C:\xampp\mysql\bin\mysqldump.exe -u root beelearn > "%~dp0beelearn_backup.sql"
echo Done! File saved to: %~dp0beelearn_backup.sql
pause
