@echo off
setlocal
cd %~dp0\..
call yarn build
cd %~dp0\..
cd build
robocopy /mir .  ..\..\public
