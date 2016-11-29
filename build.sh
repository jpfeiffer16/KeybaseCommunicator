#! /bin/bash

# The copy method below throws an error regarding recursive copying when executed. Switched to rsync to avoid, but left the old command in for review.
# cp ./* ./build -r

if [ -d "./build" ];
then
  rm -r ./build
fi

mkdir ./build

rsync -av --exclude './build' ./* ./build
cp "$(which node)" ./build/
rm ./build/build.sh
rm ./build/build -r
zip -r build.zip ./build/
rm -r ./build