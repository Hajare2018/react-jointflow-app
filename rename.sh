#!/bin/bash

for old in `find . -type f  -name "*.js";`
do 
  # echo `basename $old`
  mv $old "$old"x;
done