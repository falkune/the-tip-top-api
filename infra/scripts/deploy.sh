#!/bin/sh

[ -d ~/.ssh ] || mkdir ~/.ssh && chmod 0700 ~/.ssh
ssh-keyscan -t rsa -H 45.155.170.65 >> ~/.ssh/known_hosts
ssh -o StrictHostKeyChecking=no -l donald 45.155.170.65 ls