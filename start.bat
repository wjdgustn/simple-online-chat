@echo off
title simple-online-chat server
:start
echo ���� ������ �����մϴ�.
npm start
:askrestart
set /p m=������ �ߴܵǾ����ϴ�. �ٽ� �����Ͻðڽ��ϱ�?(y/n) :
if %m% == y goto start
if %m% == n exit
goto askrestart