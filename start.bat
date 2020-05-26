@echo off
title simple-online-chat server
:start
echo Starting Server...
npm start
:askrestart
set /p m=Server stopped. Do you want to restart?(y/n) :
if %m% == y goto start
if %m% == n exit
goto askrestart