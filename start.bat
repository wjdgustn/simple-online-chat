@echo off
title simple-online-chat server
:start
echo 서버 구동을 시작합니다.
npm start
:askrestart
set /p m=서버가 중단되었습니다. 다시 시작하시겠습니까?(y/n) :
if %m% == y goto start
if %m% == n exit
goto askrestart