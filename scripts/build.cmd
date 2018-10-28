@echo off
@setlocal
set NODE_ENV=production
cd %~dp0\..
call yarn build
set CW_PATH=..\clinwiki\public
del %CW_PATH%\*.js
copy /y build\* %CW_PATH%


